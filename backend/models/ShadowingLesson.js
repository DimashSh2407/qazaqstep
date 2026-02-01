const mongoose = require('mongoose');

const shadowingLessonSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  transcription: {
    type: String,
    required: true
  },
  targetPronunciation: {
    type: String,
    required: true
  },
  // User's recordings
  recordings: [{
    recordingUrl: String,
    recordedAt: {
      type: Date,
      default: Date.now
    },
    duration: Number,  // in seconds
    accuracy: Number,  // 0-100, detected by speech recognition
    isGood: Boolean
  }],
  
  practiceCount: {
    type: Number,
    default: 0
  },
  bestAccuracy: {
    type: Number,
    default: 0
  },
  completedAt: Date,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, { timestamps: true });

module.exports = mongoose.model('ShadowingLesson', shadowingLessonSchema);
