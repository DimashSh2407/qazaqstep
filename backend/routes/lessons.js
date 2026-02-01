const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// GET all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ _id: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

