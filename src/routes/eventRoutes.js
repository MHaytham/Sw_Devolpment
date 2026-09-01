const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('clubLeader'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', protect, authorize('clubLeader'), updateEvent);
router.delete('/:id', protect, authorize('clubLeader', 'admin'), deleteEvent);

module.exports = router;
