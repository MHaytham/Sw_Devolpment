const express = require('express');
const {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  deleteRegistration
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('student'), createRegistration);
router.get('/me', protect, authorize('student'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize('clubLeader', 'admin'), getEventRegistrations);
router.patch('/:id', protect, updateRegistrationStatus);
router.delete('/:id', protect, deleteRegistration);

module.exports = router;
