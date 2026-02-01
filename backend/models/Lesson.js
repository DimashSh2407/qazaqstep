const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']
  },
  duration: {
    type: Number,
    required: true
  },
  grammarText: {
    type: String,
    required: true
  },
  example: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    default: ''
  },
  testQuestions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  vocabularyCards: [String],
  skills: [String] // e.g., ['grammar', 'speaking', 'listening']
});

module.exports = mongoose.model('Lesson', lessonSchema);

