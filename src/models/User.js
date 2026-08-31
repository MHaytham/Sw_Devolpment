const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  role: {
    type: String,
    enum: ['student', 'clubLeader', 'admin'],
    required: true,
    default: 'student'
  },
  // Only meaningful when role is 'clubLeader'
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected']
  },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
