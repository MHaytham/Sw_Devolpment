const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const createRegistration = async (req, res) => {
  try {
    const { eventId, note } = req.body;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'closed') {
      return res.status(400).json({ message: 'Event registration is closed' });
    }

    if (event.totalSlots) {
      const count = await Registration.countDocuments({
        event: event._id,
        status: { $ne: 'cancelled' }
      });
      if (count >= event.totalSlots) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: event._id,
      note
    });

    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Already registered for this event' });
    }
    res.status(500).json({ message: err.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .sort({ registeredAt: -1 })
      .populate('event');

    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isOwner = event.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }

    const registrations = await Registration.find({ event: eventId }).populate(
      'user',
      'name email'
    );

    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRegistrationStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid registration id' });
    }

    const { status } = req.body;
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const isOwner = registration.user.toString() === req.user._id.toString();

    if (isOwner) {
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Students may only cancel their registration' });
      }
    } else {
      const event = await Event.findById(registration.event);
      const isEventOwner =
        event && event.createdBy.toString() === req.user._id.toString();

      if (!isEventOwner) {
        return res.status(403).json({ message: 'Not authorized to update this registration' });
      }
      if (!['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
    }

    registration.status = status;
    await registration.save();

    res.status(200).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid registration id' });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const isOwner = registration.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this registration' });
    }

    await registration.deleteOne();

    res.status(200).json({ message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  deleteRegistration
};
