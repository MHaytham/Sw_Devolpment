const express = require('express');
const {
  getMe,
  updateMe,
  getUsers,
  updateUserStatus,
  updateUserRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/', protect, authorize('admin'), getUsers);
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
