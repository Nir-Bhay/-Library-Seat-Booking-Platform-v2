const TimeSlot = require('../models/TimeSlot');
const Library = require('../models/Library');

// @desc    Get all time slots for a library
// @route   GET /api/time-slots/library/:libraryId
// @access  Public
const getTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find({
      library_id: req.params.libraryId,
      isActive: true
    }).sort('startTime');

    res.status(200).json({
      success: true,
      data: timeSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create time slot
// @route   POST /api/time-slots
// @access  Private (Librarian)
const createTimeSlot = async (req, res) => {
  try {
    const { library_id, slotName, startTime, endTime, price, maxCapacity } = req.body;

    // Check if library exists and belongs to the librarian
    const library = await Library.findById(library_id);

    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    if (library.librarian_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create time slot for this library'
      });
    }

    // Check for overlapping time slots
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        success: false,
        error: 'Start time must be before end time'
      });
    }

    // Check for overlapping slots
    const existingSlots = await TimeSlot.find({ library_id, isActive: true });
    
    for (const slot of existingSlots) {
      const [slotStartHour, slotStartMin] = slot.startTime.split(':').map(Number);
      const [slotEndHour, slotEndMin] = slot.endTime.split(':').map(Number);
      const slotStartMinutes = slotStartHour * 60 + slotStartMin;
      const slotEndMinutes = slotEndHour * 60 + slotEndMin;

      // Check if new slot overlaps with existing slot
      if (
        (startMinutes >= slotStartMinutes && startMinutes < slotEndMinutes) ||
        (endMinutes > slotStartMinutes && endMinutes <= slotEndMinutes) ||
        (startMinutes <= slotStartMinutes && endMinutes >= slotEndMinutes)
      ) {
        return res.status(409).json({
          success: false,
          error: `Time slot overlaps with existing slot: ${slot.slotName}`
        });
      }
    }

    const timeSlot = await TimeSlot.create({
      library_id,
      slotName,
      startTime,
      endTime,
      price,
      maxCapacity
    });

    res.status(201).json({
      success: true,
      data: timeSlot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update time slot
// @route   PUT /api/time-slots/:id
// @access  Private (Librarian)
const updateTimeSlot = async (req, res) => {
  try {
    let timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found'
      });
    }

    // Check if library belongs to the librarian
    const library = await Library.findById(timeSlot.library_id);

    if (library.librarian_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this time slot'
      });
    }

    timeSlot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: timeSlot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete time slot
// @route   DELETE /api/time-slots/:id
// @access  Private (Librarian)
const deleteTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found'
      });
    }

    // Check if library belongs to the librarian
    const library = await Library.findById(timeSlot.library_id);

    if (library.librarian_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this time slot'
      });
    }

    await timeSlot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Time slot deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
};
