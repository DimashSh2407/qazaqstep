const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const User = require('../models/User');

// Spaced repetition algorithm (SM-2)
class SpacedRepetitionAlgorithm {
  // SM-2 algorithm parameters
  static calculateNextReview(currentInterval, ease, quality) {
    // quality: 0-5 (5 = perfect recall, 0 = complete blackout)
    
    if (quality < 3) {
      // Wrong answer, reset
      return {
        interval: 1,
        ease: Math.max(1.3, ease - 0.2),
        nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day
      };
    }
    
    let newInterval, newEase;
    
    if (currentInterval === 0) {
      newInterval = 1;
    } else if (currentInterval === 1) {
      newInterval = 3;
    } else {
      newInterval = Math.round(currentInterval * ease);
    }
    
    newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEase = Math.max(1.3, newEase);
    
    return {
      interval: newInterval,
      ease: newEase,
      nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
    };
  }
}

// Get vocabulary cards due for review
router.get('/due', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const now = new Date();
    const dueCards = user.vocabularyCards.filter(card => 
      new Date(card.nextReviewDate) <= now
    );
    
    // Return cards without showing if answer is correct
    const dueCardsForReview = dueCards.map(card => ({
      _id: card._id,
      word: card.word,
      pronunciation: card.pronunciation,
      difficulty: card.difficulty
    })).slice(0, 10); // Max 10 cards per session
    
    res.json({
      count: dueCards.length,
      cards: dueCardsForReview
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit vocabulary card review
router.post('/review', verifyToken, async (req, res) => {
  try {
    const { cardId, quality, responseTime } = req.body;
    // quality: 0-5 (5 = perfect recall, 0 = no idea)
    
    if (quality === undefined || quality < 0 || quality > 5) {
      return res.status(400).json({ error: 'Quality must be between 0 and 5' });
    }
    
    const user = await User.findById(req.userId);
    const card = user.vocabularyCards.id(cardId);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const isCorrect = quality >= 3;
    const currentEase = card.ease || 2.5;
    
    // Calculate next review
    const { interval, ease, nextReviewDate } = SpacedRepetitionAlgorithm.calculateNextReview(
      card.interval,
      currentEase,
      quality
    );
    
    // Update card
    card.interval = interval;
    card.ease = ease;
    card.nextReviewDate = nextReviewDate;
    card.lastReviewDate = new Date();
    card.repetitionCount += 1;
    
    // Update difficulty based on performance
    if (quality === 5) {
      card.difficulty = 'easy';
    } else if (quality <= 2) {
      card.difficulty = 'hard';
    } else {
      card.difficulty = 'medium';
    }
    
    // Award points
    if (isCorrect) {
      user.totalPoints += 5;
      user.statistics.totalPointsEarned += 5;
    }
    
    await user.save();
    
    res.json({
      message: 'Card reviewed',
      isCorrect,
      pointsEarned: isCorrect ? 5 : 0,
      nextReviewDate,
      card: {
        _id: card._id,
        word: card.word,
        translation: card.translation,
        interval: card.interval,
        ease: card.ease,
        difficulty: card.difficulty
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all vocabulary cards
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    res.json({
      totalCards: user.vocabularyCards.length,
      cards: user.vocabularyCards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add vocabulary card (when lesson is completed)
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { word, translation, pronunciation, difficulty = 'medium' } = req.body;
    
    if (!word || !translation) {
      return res.status(400).json({ error: 'Word and translation required' });
    }
    
    const user = await User.findById(req.userId);
    
    // Check if card already exists
    const exists = user.vocabularyCards.find(c => c.word === word);
    if (exists) {
      return res.status(400).json({ error: 'Card already exists' });
    }
    
    user.vocabularyCards.push({
      word,
      translation,
      pronunciation,
      difficulty,
      nextReviewDate: new Date(),
      interval: 1,
      ease: 2.5
    });
    
    await user.save();
    
    res.json({
      message: 'Vocabulary card added',
      card: user.vocabularyCards[user.vocabularyCards.length - 1]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vocabulary card
router.delete('/:cardId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const card = user.vocabularyCards.id(req.params.cardId);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    card.remove();
    await user.save();
    
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vocabulary statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const stats = {
      totalCards: user.vocabularyCards.length,
      easyCards: user.vocabularyCards.filter(c => c.difficulty === 'easy').length,
      mediumCards: user.vocabularyCards.filter(c => c.difficulty === 'medium').length,
      hardCards: user.vocabularyCards.filter(c => c.difficulty === 'hard').length,
      averageInterval: user.vocabularyCards.length > 0
        ? Math.round(user.vocabularyCards.reduce((sum, c) => sum + c.interval, 0) / user.vocabularyCards.length)
        : 0,
      totalReviews: user.vocabularyCards.reduce((sum, c) => sum + c.repetitionCount, 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
