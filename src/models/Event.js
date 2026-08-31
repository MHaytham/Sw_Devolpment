const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  club: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String] },
  location: { type: String, required: true },
  eventDate: { type: Date, required: true },
  type: {
    type: String,
    enum: ['workshop', 'social', 'competition', 'volunteering', 'other'],
    required: true
  },
  // Auto-assigned by the AI in Task 2
  category: { type: String, required: true, default: 'Other' },
  totalSlots: { type: Number },
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: true,
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
