const express = require('express');
const router = express.Router();
const {
  getTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} = require('../controllers/timeSlotController');
const { protect, authorize } = require('../middleware/auth');
const { timeSlotValidation, validate } = require('../middleware/validator');

router.get('/library/:libraryId', getTimeSlots);
router.post('/', protect, authorize('librarian'), timeSlotValidation, validate, createTimeSlot);
router.put('/:id', protect, authorize('librarian'), updateTimeSlot);
router.delete('/:id', protect, authorize('librarian'), deleteTimeSlot);

module.exports = router;
