const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  librarian_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  libraryName: {
    type: String,
    required: [true, 'Library name is required'],
    minlength: [3, 'Library name must be at least 3 characters long'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  address: {
    street: {
      type: String,
      default: ''
    },
    area: {
      type: String,
      required: [true, 'Area is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Pincode must be exactly 6 digits']
    },
    landmark: {
      type: String,
      default: ''
    }
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\d{10}$/, 'Contact number must be exactly 10 digits']
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  images: [{
    type: String
  }],
  coverImage: {
    type: String,
    default: ''
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Total seats must be at least 1']
  },
  availableSeats: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [1, 'Price per hour must be at least 1']
  },
  pricePerDay: {
    type: Number,
    default: 0
  },
  openTime: {
    type: String,
    default: '08:00'
  },
  closeTime: {
    type: String,
    default: '22:00'
  },
  daysOpen: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
librarySchema.index({ librarian_id: 1 });
librarySchema.index({ 'address.city': 1, 'address.area': 1 });
librarySchema.index({ 'address.pincode': 1 });
librarySchema.index({ isApproved: 1, isActive: 1 });

// Calculate available seats before saving
librarySchema.pre('save', function () {
  if (this.isNew || this.isModified('totalSeats')) {
    this.availableSeats = this.totalSeats;
  }
});

module.exports = mongoose.model('Library', librarySchema);