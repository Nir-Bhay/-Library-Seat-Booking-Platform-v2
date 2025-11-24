const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Amenity name is required'],
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['basic', 'comfort', 'safety', 'food', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Amenity', amenitySchema);
