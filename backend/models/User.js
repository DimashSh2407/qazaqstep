const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  
  // Learning Profile
  level: {
    type: String,
    enum: ['A0','A1', 'A2', 'B1', 'B2', 'C1', null],
    default: null  // null until placement test
  },
  learningGoal: {
    type: String,
    enum: ['study', 'work', 'daily', 'travel'],
    default: 'study'
  },
  placementTestCompleted: {
    type: Boolean,
    default: false
  },
  
  // Progress Tracking
  completedLessons: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number,
    timeSpent: Number  // in seconds
  }],
  
  // Gamification
  totalPoints: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  weeklyGoal: {
    type: Number,
    default: 7  // lessons per week
  },
  weeklyProgress: [{
    week: String,  // "2026-W01"
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    pointsEarned: {
      type: Number,
      default: 0
    }
  }],
  
  // Badges & Achievements
  badges: [{
    badgeId: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Vocabulary & Spaced Repetition
  vocabularyCards: [{
    word: String,
    translation: String,
    pronunciation: String,
    nextReviewDate: {
      type: Date,
      default: Date.now
    },
    repetitionCount: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    lastReviewDate: {
      type: Date,
      default: null
    },
    interval: {
      type: Number,
      default: 1  // days before next review
    }
  }],
  
  // Weak Topics Analysis
  weakTopics: [{
    topic: String,
    errorCount: {
      type: Number,
      default: 0
    },
    lastError: Date,
    needsReview: Boolean
  }],
  
  // Statistics
  statistics: {
    totalLessonsCompleted: {
      type: Number,
      default: 0
    },
    totalPointsEarned: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0  // in minutes
    },
    lastLoginDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Preferences
  preferences: {
    darkMode: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    dailyReminder: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate current week progress
userSchema.methods.getCurrentWeekProgress = function() {
  const now = new Date();
  const weekNumber = `${now.getFullYear()}-W${String(Math.ceil((now.getDate() + new Date(now.getFullYear(), 0, 1).getDay()) / 7)).padStart(2, '0')}`;
  
  const weekProgress = this.weeklyProgress.find(w => w.week === weekNumber) || {
    week: weekNumber,
    lessonsCompleted: 0,
    pointsEarned: 0
  };
  
  return weekProgress;
};

// Update streak
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastActivity = this.lastActivityDate ? new Date(this.lastActivityDate) : null;
  
  if (!lastActivity) {
    this.currentStreak = 1;
  } else {
    const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      this.currentStreak += 1;
    } else if (daysDiff > 1) {
      this.currentStreak = 1;
    }
    
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  }
  
  this.lastActivityDate = now;
};

module.exports = mongoose.model('User', userSchema);
