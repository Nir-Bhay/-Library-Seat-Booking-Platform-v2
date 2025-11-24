const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  library_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingAmount: {
    type: Number,
    required: true
  },
  platformCommission: {
    type: Number,
    required: true
  },
  librarianPayout: {
    type: Number,
    required: true
  },
  commissionPercentage: {
    type: Number,
    default: 10
  },
  settlementStatus: {
    type: String,
    enum: ['pending', 'processing', 'settled', 'failed'],
    default: 'pending'
  },
  settlementDate: {
    type: Date
  },
  settlementId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ library_id: 1, settlementStatus: 1 });
transactionSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
