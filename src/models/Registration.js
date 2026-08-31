const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  note: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    required: true,
    default: 'pending'
  },
  registeredAt: { type: Date, required: true, default: Date.now }
});

// A student cannot register for the same event twice
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
