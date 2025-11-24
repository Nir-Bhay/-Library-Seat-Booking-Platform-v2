const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array().map(err => err.msg).join(', ')
    });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'librarian'])
    .withMessage('Role must be either user or librarian')
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Library validation
const libraryValidation = [
  body('libraryName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Library name must be at least 3 characters long'),
  body('address.area')
    .trim()
    .notEmpty()
    .withMessage('Area is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.pincode')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be exactly 6 digits'),
  body('contactNumber')
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  body('totalSeats')
    .isInt({ min: 1 })
    .withMessage('Total seats must be at least 1'),
  body('pricePerHour')
    .isFloat({ min: 1 })
    .withMessage('Price per hour must be at least 1')
];

// Booking validation
const bookingValidation = [
  body('library_id')
    .trim()
    .notEmpty()
    .withMessage('Library ID is required'),
  body('timeSlot_id')
    .trim()
    .notEmpty()
    .withMessage('Time slot ID is required'),
  body('bookingDate')
    .isISO8601()
    .withMessage('Valid booking date is required'),
  body('seatNumber')
    .trim()
    .notEmpty()
    .withMessage('Seat number is required')
];

// Time slot validation
const timeSlotValidation = [
  body('library_id')
    .trim()
    .notEmpty()
    .withMessage('Library ID is required'),
  body('slotName')
    .trim()
    .notEmpty()
    .withMessage('Slot name is required'),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:MM format'),
  body('price')
    .isFloat({ min: 1 })
    .withMessage('Price must be at least 1'),
  body('maxCapacity')
    .isInt({ min: 1 })
    .withMessage('Max capacity must be at least 1')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  libraryValidation,
  bookingValidation,
  timeSlotValidation
};
