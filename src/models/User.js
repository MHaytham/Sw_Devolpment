const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
