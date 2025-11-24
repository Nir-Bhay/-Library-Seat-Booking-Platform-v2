const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  library_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  timeSlot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required']
  },
  basePrice: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 5
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    default: ''
  },
  paidAt: {
    type: Date
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes - bookingId already indexed via unique: true
bookingSchema.index({ user_id: 1 });
bookingSchema.index({ library_id: 1, bookingDate: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function () {
  if (this.isNew) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.bookingId = `BK-${dateStr}-${randomNum}`;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);