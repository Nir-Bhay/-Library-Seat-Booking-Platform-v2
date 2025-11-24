const Booking = require('../models/Booking');
const Library = require('../models/Library');
const TimeSlot = require('../models/TimeSlot');
const { calculatePriceBreakdown, isValidBookingDate, canCancelBooking } = require('../utils/helpers');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { library_id, timeSlot_id, bookingDate, seatNumber } = req.body;

    // Validate booking date
    const dateValidation = isValidBookingDate(bookingDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        error: dateValidation.message
      });
    }

    // Check if library exists and is approved
    const library = await Library.findById(library_id);
    if (!library || !library.isApproved || !library.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Library not found or not available'
      });
    }

    // Check if time slot exists
    const timeSlot = await TimeSlot.findById(timeSlot_id);
    if (!timeSlot || !timeSlot.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found or not available'
      });
    }

    // Check if seat is already booked
    const existingBooking = await Booking.findOne({
      library_id,
      timeSlot_id,
      bookingDate: new Date(bookingDate),
      seatNumber,
      bookingStatus: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: 'This seat is already booked for the selected date and time'
      });
    }

    // Calculate price
    const priceBreakdown = calculatePriceBreakdown(timeSlot.price);

    // Create booking
    const booking = await Booking.create({
      user_id: req.user._id,
      library_id,
      timeSlot_id,
      bookingDate: new Date(bookingDate),
      seatNumber,
      basePrice: priceBreakdown.basePrice,
      taxAmount: priceBreakdown.taxAmount,
      platformFee: priceBreakdown.platformFee,
      totalAmount: priceBreakdown.totalAmount
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user_id: req.user._id };
    if (status) {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('library_id', 'libraryName address images coverImage')
      .populate('timeSlot_id', 'slotName startTime endTime')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('library_id', 'libraryName address contactNumber')
      .populate('timeSlot_id', 'slotName startTime endTime')
      .populate('user_id', 'fullName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking or is librarian/admin
    if (
      booking.user_id._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'librarian' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Only confirmed bookings can be cancelled'
      });
    }

    // Check cancellation window
    if (!canCancelBooking(booking.bookingDate)) {
      return res.status(400).json({
        success: false,
        error: 'Bookings can only be cancelled at least 24 hours before the booking date'
      });
    }

    // Update booking
    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = req.body.cancellationReason || 'User cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get librarian's bookings
// @route   GET /api/bookings/librarian/bookings
// @access  Private (Librarian)
const getLibrarianBookings = async (req, res) => {
  try {
    // Get all libraries owned by the librarian
    const libraries = await Library.find({ librarian_id: req.user._id }).select('_id');
    const libraryIds = libraries.map(lib => lib._id);

    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { library_id: { $in: libraryIds } };
    
    if (status) {
      query.bookingStatus = status;
    }
    
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('user_id', 'fullName email phone')
      .populate('library_id', 'libraryName')
      .populate('timeSlot_id', 'slotName startTime endTime')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Check seat availability
// @route   GET /api/bookings/check-availability
// @access  Public
const checkAvailability = async (req, res) => {
  try {
    const { libraryId, date, timeSlotId } = req.query;

    if (!libraryId || !date || !timeSlotId) {
      return res.status(400).json({
        success: false,
        error: 'Library ID, date, and time slot ID are required'
      });
    }

    const library = await Library.findById(libraryId);
    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    // Get all bookings for this library, date, and time slot
    const bookings = await Booking.find({
      library_id: libraryId,
      bookingDate: new Date(date),
      timeSlot_id: timeSlotId,
      bookingStatus: { $in: ['pending', 'confirmed'] }
    }).select('seatNumber');

    const bookedSeats = bookings.map(b => b.seatNumber);
    const totalSeats = library.totalSeats;
    const availableSeatsCount = totalSeats - bookedSeats.length;

    res.status(200).json({
      success: true,
      data: {
        totalSeats,
        bookedSeats,
        availableSeats: availableSeatsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getLibrarianBookings,
  checkAvailability
};
