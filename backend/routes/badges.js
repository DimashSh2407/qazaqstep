const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const User = require('../models/User');
const Badge = require('../models/Badge');

// Initialize badges on startup
const BADGES_CONFIG = [
  { badgeId: 'streak_7', name: '7-Day Streak', description: '7 days of continuous learning', category: 'streak', requirement: 'streak_7', rarity: 'rare' },
  { badgeId: 'streak_30', name: 'Month Master', description: '30 days of continuous learning', category: 'streak', requirement: 'streak_30', rarity: 'epic' },
  { badgeId: 'points_100', name: 'Beginner', description: 'Earn 100 points', category: 'points', requirement: 'points_100', rarity: 'common' },
  { badgeId: 'points_500', name: 'Scholar', description: 'Earn 500 points', category: 'points', requirement: 'points_500', rarity: 'rare' },
  { badgeId: 'lessons_10', name: 'Learner', description: 'Complete 10 lessons', category: 'lessons', requirement: 'lessons_10', rarity: 'common' },
  { badgeId: 'lessons_50', name: 'Teacher', description: 'Complete 50 lessons', category: 'lessons', requirement: 'lessons_50', rarity: 'epic' },
  { badgeId: 'accuracy_90', name: 'Precision', description: 'Achieve 90% accuracy', category: 'accuracy', requirement: 'accuracy_90', rarity: 'rare' },
  { badgeId: 'vocabulary_100', name: 'Vocabulary Master', description: 'Learn 100 vocabulary words', category: 'vocabulary', requirement: 'vocabulary_100', rarity: 'epic' },
  { badgeId: 'special_first', name: 'First Step', description: 'Complete your first lesson', category: 'special', requirement: 'special_first', rarity: 'common' }
];

// Initialize badges in database
async function initializeBadges() {
  try {
    const count = await Badge.countDocuments();
    if (count === 0) {
      await Badge.insertMany(BADGES_CONFIG);
      console.log('Badges initialized');
    }
  } catch (error) {
    console.error('Error initializing badges:', error);
  }
}

// Call on app startup
initializeBadges();

// Get all available badges
router.get('/', verifyToken, async (req, res) => {
  try {
    const allBadges = await Badge.find();
    const user = await User.findById(req.userId);
    
    const userBadgeIds = user.badges.map(b => b.badgeId);
    
    const badges = allBadges.map(badge => ({
      ...badge.toObject(),
      earned: userBadgeIds.includes(badge.badgeId),
      earnedAt: user.badges.find(b => b.badgeId === badge.badgeId)?.earnedAt
    }));
    
    res.json({
      totalBadges: allBadges.length,
      earnedBadges: userBadgeIds.length,
      badges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and award badges
async function checkAndAwardBadges(user) {
  const allBadges = await Badge.find();
  const newBadges = [];
  
  for (const badgeConfig of allBadges) {
    // Check if already has badge
    if (user.badges.find(b => b.badgeId === badgeConfig.badgeId)) {
      continue;
    }
    
    const [badgeType, badgeValue] = badgeConfig.requirement.split('_');
    const value = parseInt(badgeValue);
    let shouldAward = false;
    
    switch (badgeType) {
      case 'streak':
        shouldAward = user.currentStreak >= value;
        break;
      case 'points':
        shouldAward = user.totalPoints >= value;
        break;
      case 'lessons':
        shouldAward = user.statistics.totalLessonsCompleted >= value;
        break;
      case 'accuracy':
        shouldAward = user.statistics.averageScore >= value;
        break;
      case 'vocabulary':
        shouldAward = user.vocabularyCards.length >= value;
        break;
      case 'special':
        if (badgeValue === 'first') {
          shouldAward = user.statistics.totalLessonsCompleted >= 1;
        }
        break;
    }
    
    if (shouldAward) {
      user.badges.push({
        badgeId: badgeConfig.badgeId,
        earnedAt: new Date()
      });
      newBadges.push(badgeConfig);
    }
  }
  
  if (newBadges.length > 0) {
    await user.save();
  }
  
  return newBadges;
}

// Get user badges
router.get('/my', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check and award new badges
    const newBadges = await checkAndAwardBadges(user);
    
    const userBadges = await Promise.all(
      user.badges.map(async (ub) => {
        const badge = await Badge.findOne({ badgeId: ub.badgeId });
        return {
          ...badge.toObject(),
          earnedAt: ub.earnedAt
        };
      })
    );
    
    res.json({
      totalEarned: user.badges.length,
      badges: userBadges,
      newBadges: newBadges.map(b => b.name)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award badge manually (for testing)
router.post('/award-badge', verifyToken, async (req, res) => {
  try {
    const { badgeId } = req.body;
    
    const user = await User.findById(req.userId);
    const badge = await Badge.findOne({ badgeId });
    
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }
    
    // Check if already has badge
    if (user.badges.find(b => b.badgeId === badgeId)) {
      return res.status(400).json({ error: 'Badge already earned' });
    }
    
    user.badges.push({ badgeId, earnedAt: new Date() });
    await user.save();
    
    res.json({
      message: 'Badge awarded',
      badge: badge.name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, checkAndAwardBadges };
