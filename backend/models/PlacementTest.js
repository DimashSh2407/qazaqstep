const mongoose = require('mongoose');

const placementTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    questionId: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    userAnswer: Number,
    isCorrect: Boolean
  }],
  totalQuestions: Number,
  correctAnswers: Number,
  score: Number,  // percentage
  determinedLevel: {
    type: String,
    enum: ['A0','A1', 'A2', 'B1', 'B2', 'C1'],
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  retakeCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('PlacementTest', placementTestSchema);
