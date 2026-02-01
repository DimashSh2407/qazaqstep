const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const { checkAndAwardBadges } = require('./badges');

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

// Complete lesson and record progress
router.post('/:id/complete', verifyToken, async (req, res) => {
  try {
    const { score, timeSpent, errors } = req.body;
    
    if (score === undefined) {
      return res.status(400).json({ error: 'Score required' });
    }
    
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    const user = await User.findById(req.userId);
    
    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alreadyCompleted = user.completedLessons.some(cl => {
      const completedDate = new Date(cl.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return cl.lessonId.equals(lesson._id) && completedDate.getTime() === today.getTime();
    });
    
    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Lesson already completed today' });
    }
    
    // Record completion
    user.completedLessons.push({
      lessonId: lesson._id,
      completedAt: new Date(),
      score: Math.round(score),
      timeSpent: timeSpent || 0
    });
    
    // Calculate points (based on score)
    const pointsEarned = Math.round((score / 100) * 20); // Max 20 points per lesson
    user.totalPoints += pointsEarned;
    
    // Update statistics
    user.statistics.totalLessonsCompleted += 1;
    user.statistics.totalPointsEarned += pointsEarned;
    user.statistics.totalTimeSpent += (timeSpent || 0) / 60; // Convert to minutes
    
    // Update average score
    const totalScore = user.completedLessons.reduce((sum, cl) => sum + (cl.score || 0), 0);
    user.statistics.averageScore = Math.round(totalScore / user.completedLessons.length);
    
    // Update streak
    user.updateStreak();
    
    // Update weekly progress
    const now = new Date();
    const weekNumber = `${now.getFullYear()}-W${String(Math.ceil((now.getDate() + new Date(now.getFullYear(), 0, 1).getDay()) / 7)).padStart(2, '0')}`;
    
    let weekProgress = user.weeklyProgress.find(w => w.week === weekNumber);
    if (!weekProgress) {
      user.weeklyProgress.push({
        week: weekNumber,
        lessonsCompleted: 1,
        pointsEarned: pointsEarned
      });
    } else {
      weekProgress.lessonsCompleted += 1;
      weekProgress.pointsEarned += pointsEarned;
    }
    
    // Record errors/weak topics
    if (errors && Array.isArray(errors)) {
      for (const error of errors) {
        const topicEntry = user.weakTopics.find(t => t.topic === error.topic);
        if (!topicEntry) {
          user.weakTopics.push({
            topic: error.topic,
            errorCount: 1,
            lastError: new Date(),
            needsReview: true
          });
        } else {
          topicEntry.errorCount += 1;
          topicEntry.lastError = new Date();
        }
      }
    }
    
    await user.save();
    
    // Check and award badges
    const newBadges = await checkAndAwardBadges(user);
    
    // Add vocabulary cards from lesson
    if (lesson.vocabularyCards && lesson.vocabularyCards.length > 0) {
      for (const vocabCard of lesson.vocabularyCards) {
        const exists = user.vocabularyCards.find(c => c.word === vocabCard);
        if (!exists) {
          user.vocabularyCards.push({
            word: vocabCard,
            translation: vocabCard,
            nextReviewDate: new Date(),
            interval: 1,
            ease: 2.5
          });
        }
      }
      await user.save();
    }
    
    res.json({
      message: 'Lesson completed successfully',
      pointsEarned,
      score: Math.round(score),
      newBadges: newBadges.map(b => b.name),
      progress: {
        totalLessonsCompleted: user.statistics.totalLessonsCompleted,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        averageScore: user.statistics.averageScore
      }
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's lesson progress
router.get('/:id/progress', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const lessonId = req.params.id;
    
    const completions = user.completedLessons.filter(cl => cl.lessonId.toString() === lessonId);
    
    res.json({
      timesCompleted: completions.length,
      bestScore: completions.length > 0 ? Math.max(...completions.map(c => c.score || 0)) : 0,
      lastCompletedAt: completions.length > 0 ? completions[completions.length - 1].completedAt : null,
      averageScore: completions.length > 0
        ? Math.round(completions.reduce((sum, c) => sum + (c.score || 0), 0) / completions.length)
        : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

