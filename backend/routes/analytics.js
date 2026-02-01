const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// Get weak topics
router.get('/weak-topics', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get topics with more than 2 errors
    const weakTopics = user.weakTopics
      .filter(t => t.errorCount >= 2)
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 5);
    
    res.json({
      weakTopics,
      recommendedReview: weakTopics.map(t => ({
        topic: t.topic,
        errorCount: t.errorCount,
        priority: t.errorCount >= 5 ? 'high' : t.errorCount >= 3 ? 'medium' : 'low'
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record error/mistake for a topic
router.post('/record-error', verifyToken, async (req, res) => {
  try {
    const { topic, lessonId } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic required' });
    }
    
    const user = await User.findById(req.userId);
    
    // Find or create topic entry
    let topicEntry = user.weakTopics.find(t => t.topic === topic);
    
    if (!topicEntry) {
      user.weakTopics.push({
        topic,
        errorCount: 1,
        lastError: new Date(),
        needsReview: true
      });
    } else {
      topicEntry.errorCount += 1;
      topicEntry.lastError = new Date();
      topicEntry.needsReview = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Error recorded',
      topic: topic,
      errorCount: topicEntry?.errorCount || 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly statistics
router.get('/weekly-stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const weekProgress = user.getCurrentWeekProgress();
    const weeklyGoal = user.weeklyGoal;
    const progress = Math.round((weekProgress.lessonsCompleted / weeklyGoal) * 100);
    
    res.json({
      currentWeek: weekProgress.week,
      lessonsCompleted: weekProgress.lessonsCompleted,
      weeklyGoal,
      pointsEarned: weekProgress.pointsEarned,
      progress,
      goalMet: weekProgress.lessonsCompleted >= weeklyGoal,
      streak: user.currentStreak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly statistics
router.get('/monthly-stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Get all weeks in current month
    const monthlyWeeks = user.weeklyProgress.filter(w => w.week.startsWith(currentMonth.substring(0, 7)));
    
    const totalLessons = monthlyWeeks.reduce((sum, w) => sum + w.lessonsCompleted, 0);
    const totalPoints = monthlyWeeks.reduce((sum, w) => sum + w.pointsEarned, 0);
    const averageLessonsPerWeek = monthlyWeeks.length > 0 ? Math.round(totalLessons / monthlyWeeks.length) : 0;
    
    res.json({
      month: currentMonth,
      totalLessonsCompleted: totalLessons,
      totalPointsEarned: totalPoints,
      averageLessonsPerWeek,
      weeksActive: monthlyWeeks.length,
      overallStatistics: {
        totalLessonsAllTime: user.statistics.totalLessonsCompleted,
        totalPointsAllTime: user.statistics.totalPointsEarned,
        averageScore: user.statistics.averageScore,
        totalTimeSpent: user.statistics.totalTimeSpent
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get overall statistics
router.get('/overall-stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const stats = {
      profile: {
        username: user.username,
        email: user.email,
        level: user.level,
        learningGoal: user.learningGoal
      },
      progress: {
        totalLessonsCompleted: user.statistics.totalLessonsCompleted,
        totalPointsEarned: user.statistics.totalPointsEarned,
        averageScore: user.statistics.averageScore,
        totalTimeSpent: user.statistics.totalTimeSpent,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      learning: {
        totalVocabularyCards: user.vocabularyCards.length,
        hardVocabularyCards: user.vocabularyCards.filter(c => c.difficulty === 'hard').length,
        topicsToReview: user.weakTopics.filter(t => t.needsReview).length,
        completedAt: user.statistics.createdAt
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lessons that need improvement (weak topics)
router.get('/lessons-to-review', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get weak topics
    const weakTopics = user.weakTopics
      .filter(t => t.needsReview)
      .sort((a, b) => b.errorCount - a.errorCount);
    
    if (weakTopics.length === 0) {
      return res.json({
        message: 'No weak topics to review',
        lessonsToReview: []
      });
    }
    
    // Map topics to lessons
    const topicKeywords = weakTopics.map(t => t.topic);
    
    const lessonsToReview = await Lesson.find({
      $or: [
        { title: { $regex: topicKeywords.join('|'), $options: 'i' } },
        { skills: { $in: topicKeywords } }
      ]
    }).limit(5);
    
    res.json({
      weakTopics: weakTopics.map(t => ({
        topic: t.topic,
        errorCount: t.errorCount,
        lastError: t.lastError
      })),
      lessonsToReview: lessonsToReview.map(l => ({
        _id: l._id,
        title: l.title,
        level: l.level,
        duration: l.duration
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
