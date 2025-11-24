const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  library_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  slotName: {
    type: String,
    required: [true, 'Slot name is required'],
    trim: true
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least 1']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Max capacity is required'],
    min: [1, 'Max capacity must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
timeSlotSchema.index({ library_id: 1, isActive: 1 });

// Calculate duration before saving
timeSlotSchema.pre('save', function () {
  if (this.isModified('startTime') || this.isModified('endTime')) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    this.duration = (endMinutes - startMinutes) / 60;
  }
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);