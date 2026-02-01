const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['streak', 'points', 'lessons', 'accuracy', 'vocabulary', 'special']
  },
  requirement: {
    type: String,
    // e.g., "streak_7" means 7 day streak, "points_100" means 100 points
    required: true
  },
  color: String,
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

module.exports = mongoose.model('Badge', badgeSchema);
