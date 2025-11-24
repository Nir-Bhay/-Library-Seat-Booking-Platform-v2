const User = require('../models/User');
const Library = require('../models/Library');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');
const AdminSetting = require('../models/AdminSetting');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalLibrarians = await User.countDocuments({ role: 'librarian' });
    const totalLibraries = await Library.countDocuments({ isApproved: true });
    const totalBookings = await Booking.countDocuments();
    
    const bookings = await Booking.find({ paymentStatus: 'paid' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    const transactions = await Transaction.find({ settlementStatus: { $in: ['pending', 'processing', 'settled'] } });
    const commissionEarned = transactions.reduce((sum, txn) => sum + txn.platformCommission, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLibrarians,
        totalLibraries,
        totalBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        commissionEarned: Math.round(commissionEarned * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get pending libraries
// @route   GET /api/admin/pending-libraries
// @access  Private (Admin)
const getPendingLibraries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const libraries = await Library.find({ isApproved: false })
      .populate('librarian_id', 'fullName email phone')
      .populate('amenities', 'name icon')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Library.countDocuments({ isApproved: false });

    res.status(200).json({
      success: true,
      data: libraries,
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

// @desc    Approve library
// @route   PUT /api/admin/approve-library/:id
// @access  Private (Admin)
const approveLibrary = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);

    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    library.isApproved = true;
    library.isActive = true;
    library.approvedBy = req.user._id;
    library.approvedAt = new Date();
    await library.save();

    res.status(200).json({
      success: true,
      message: 'Library approved successfully',
      data: library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Reject library
// @route   PUT /api/admin/reject-library/:id
// @access  Private (Admin)
const rejectLibrary = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const library = await Library.findById(req.params.id);

    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    library.isApproved = false;
    library.isActive = false;
    library.rejectionReason = rejectionReason || 'Does not meet platform requirements';
    await library.save();

    res.status(200).json({
      success: true,
      message: 'Library rejected',
      data: library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/all-users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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

// @desc    Update user status
// @route   PUT /api/admin/user/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot modify admin users'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete admin users'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all libraries
// @route   GET /api/admin/all-libraries
// @access  Private (Admin)
const getAllLibraries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status === 'approved') query.isApproved = true;
    if (status === 'pending') query.isApproved = false;
    if (search) {
      query.$or = [
        { libraryName: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') }
      ];
    }

    const libraries = await Library.find(query)
      .populate('librarian_id', 'fullName email phone')
      .populate('amenities', 'name icon')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Library.countDocuments(query);

    res.status(200).json({
      success: true,
      data: libraries,
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

// @desc    Get all bookings
// @route   GET /api/admin/all-bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.bookingStatus = status;
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('user_id', 'fullName email phone')
      .populate('library_id', 'libraryName address')
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

// @desc    Get commission report
// @route   GET /api/admin/commission-report
// @access  Private (Admin)
const getCommissionReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('library_id', 'libraryName')
      .populate('booking_id', 'bookingId')
      .sort('-createdAt');

    const totalCommission = transactions.reduce((sum, txn) => sum + txn.platformCommission, 0);
    const totalPayout = transactions.reduce((sum, txn) => sum + txn.librarianPayout, 0);
    const totalRevenue = transactions.reduce((sum, txn) => sum + txn.bookingAmount, 0);

    // Group by library
    const libraryBreakdown = {};
    transactions.forEach(txn => {
      const libId = txn.library_id._id.toString();
      if (!libraryBreakdown[libId]) {
        libraryBreakdown[libId] = {
          libraryName: txn.library_id.libraryName,
          totalBookings: 0,
          totalRevenue: 0,
          commission: 0,
          payout: 0
        };
      }
      libraryBreakdown[libId].totalBookings += 1;
      libraryBreakdown[libId].totalRevenue += txn.bookingAmount;
      libraryBreakdown[libId].commission += txn.platformCommission;
      libraryBreakdown[libId].payout += txn.librarianPayout;
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTransactions: transactions.length,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCommission: Math.round(totalCommission * 100) / 100,
          totalPayout: Math.round(totalPayout * 100) / 100
        },
        libraryBreakdown: Object.values(libraryBreakdown),
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
const getSettings = async (req, res) => {
  try {
    const settings = await AdminSetting.find();

    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.status(200).json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await AdminSetting.findOneAndUpdate(
        { key },
        { value, updatedBy: req.user._id },
        { upsert: true, new: true }
      );
    }

    const settings = await AdminSetting.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settingsObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getPendingLibraries,
  approveLibrary,
  rejectLibrary,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllLibraries,
  getAllBookings,
  getCommissionReport,
  getSettings,
  updateSettings
};
