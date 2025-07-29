const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Calendar Event Schema (would typically be in models folder)
const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['sowing', 'watering', 'fertilizing', 'pesticide', 'harvesting', 'pruning', 'transplanting', 'monitoring'],
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  reminderDays: {
    type: Number,
    default: 1
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  notes: String
}, {
  timestamps: true
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

// Get events for a specific month
router.get('/events', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    const farmerId = req.user._id;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await CalendarEvent.find({
      farmer: farmerId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('cropId', 'name category')
    .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar events',
      error: error.message
    });
  }
});

// Add new calendar event
router.post('/events', auth, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      farmer: req.user._id
    };

    const event = new CalendarEvent(eventData);
    await event.save();

    await event.populate('cropId', 'name category');

    res.status(201).json({
      success: true,
      message: 'Event added successfully',
      data: event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add event',
      error: error.message
    });
  }
});

// Update calendar event
router.put('/events/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user._id;

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, farmer: farmerId },
      req.body,
      { new: true, runValidators: true }
    ).populate('cropId', 'name category');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// Delete calendar event
router.delete('/events/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user._id;

    const event = await CalendarEvent.findOneAndDelete({
      _id: id,
      farmer: farmerId
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// Get upcoming reminders
router.get('/reminders', auth, async (req, res) => {
  try {
    const farmerId = req.user._id;
    const today = new Date();
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + 7); // Next 7 days

    const events = await CalendarEvent.find({
      farmer: farmerId,
      date: {
        $gte: today,
        $lte: reminderDate
      },
      isCompleted: false
    })
    .populate('cropId', 'name category')
    .sort({ date: 1 });

    const reminders = events.map(event => {
      const daysUntil = Math.ceil((event.date - today) / (1000 * 60 * 60 * 24));
      return {
        ...event.toObject(),
        daysUntil
      };
    });

    res.json({
      success: true,
      data: reminders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get reminders',
      error: error.message
    });
  }
});

// Mark event as completed
router.patch('/events/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user._id;

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, farmer: farmerId },
      { isCompleted: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event marked as completed',
      data: event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete event',
      error: error.message
    });
  }
});

module.exports = router;
