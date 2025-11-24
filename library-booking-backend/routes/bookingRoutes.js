const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getLibrarianBookings,
  checkAvailability
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { bookingValidation, validate } = require('../middleware/validator');

router.get('/check-availability', checkAvailability);
router.post('/', protect, bookingValidation, validate, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/librarian/bookings', protect, authorize('librarian'), getLibrarianBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
