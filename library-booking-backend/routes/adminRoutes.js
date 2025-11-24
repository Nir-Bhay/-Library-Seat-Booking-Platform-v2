const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin authorization
router.use(protect, authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/pending-libraries', getPendingLibraries);
router.put('/approve-library/:id', approveLibrary);
router.put('/reject-library/:id', rejectLibrary);
router.get('/all-users', getAllUsers);
router.put('/user/:id/status', updateUserStatus);
router.delete('/user/:id', deleteUser);
router.get('/all-libraries', getAllLibraries);
router.get('/all-bookings', getAllBookings);
router.get('/commission-report', getCommissionReport);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
