const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const register = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body;

    if (role === 'admin') {
      return res.status(403).json({ message: 'Cannot self-register as admin' });
    }

    const userData = { name, email, password, role, bio };
    if (role === 'clubLeader') {
      userData.status = 'pending';
    }

    const user = await User.create(userData);
    const token = signToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ user: userObj, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
