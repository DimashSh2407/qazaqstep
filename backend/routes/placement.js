const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const User = require('../models/User');
const PlacementTest = require('../models/PlacementTest');

// Placement test questions (new 15-question set)
const PLACEMENT_QUESTIONS = [
  { id: 'q1', question: 'Сәлем! Хал жағдайың ...?', options: ['кім', 'қалай', 'қайда', 'неше'], correct: 1, level: 'A0' },
  { id: 'q2', question: 'Менің атым ...', options: ['Асқарды', 'Асқардың', 'Асқар', 'Асқарға'], correct: 2, level: 'A0' },
  { id: 'q3', question: 'Қазір сағат ...?', options: ['неше', 'қанша', 'кімде', 'қайда'], correct: 0, level: 'A0' },
  { id: 'q4', question: 'Сен қайда ...?', options: ['тұрасың', 'барады', 'келді', 'оқимын'], correct: 0, level: 'A0' },
  { id: 'q5', question: 'Біз ертең киноға ...', options: ['барды', 'барамыз', 'барасың', ' барған'], correct: 1, level: 'A0' },
  { id: 'q6', question: 'Кітап ... үстелдің үстінде жатыр.', options: ['терезе', 'есік', 'үстел', 'аспан'], correct: 2, level: 'A0' },
  { id: 'q7', question: 'Дұрыс жалғауды тап: "Сенің дос..."', options: ['-ың', '-ыңыз', '-ым', '-ы'], correct: 0, level: 'A1' },
  { id: 'q8', question: '"Apple" сөзінің қазақша аудармасы:', options: ['Өрік', 'Алма', 'Шие', 'Алмұрт'], correct: 1, level: 'A1' },
  { id: 'q9', question: 'Мен ... оқимын.', options: ['мектепте', 'мектепті', 'мектептен', 'мектепке'], correct: 0, level: 'A1' },
  { id: 'q10', question: 'Аптаның үшінші күні:', options: ['Дүйсенбі', 'Сәрсенбі', 'Жұма', 'Жексенбі'], correct: 1, level: 'A1' },
  { id: 'q11', question: '"Үлкен" сөзіне антоним:', options: ['Жақсы', 'Кіші', 'Биік', 'Жаңа'], correct: 1, level: 'A2' },
  { id: 'q12', question: 'Ол жұмысқа ... кетті.', options: ['жаяу', 'жасыл', 'жарық', 'жақын'], correct: 0, level: 'A2' },
  { id: 'q13', question: '"Қонақжай" сөзінің мағынасы:', options: ['Ашулы', 'Жалқау', 'Мейірімді', 'Қонақты жақсы көретін'], correct: 3, level: 'A2' },
  { id: 'q14', question: 'Көпше түрдегі сөзді тап:', options: ['Бала', 'Қала', 'Адамдар', 'Көше'], correct: 2, level: 'A2' },
  { id: 'q15', question: 'Бүгін ауа райы ...', options: ['ашық', 'ұзын', 'ащы', 'қатты'], correct: 0, level: 'A2' }
];

// Get placement test questions
router.get('/questions', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.placementTestCompleted && user.level) {
      return res.status(400).json({
        error: 'Placement test already completed',
        currentLevel: user.level
      });
    }
    
    // Return questions without correct answers
    const questions = PLACEMENT_QUESTIONS.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit placement test
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body; // { q1: 0, q2: 1, q3: 1, ... }
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers format' });
    }
    
    let correctCount = 0;
    const submittedQuestions = [];

    // Tally correct answers and per-level stats
    const perLevelTotals = {};
    const perLevelCorrect = {};
    for (const q of PLACEMENT_QUESTIONS) {
      perLevelTotals[q.level] = (perLevelTotals[q.level] || 0) + 1;
      perLevelCorrect[q.level] = perLevelCorrect[q.level] || 0;
    }

    // Validate answers
    for (const question of PLACEMENT_QUESTIONS) {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct;

      if (isCorrect) {
        correctCount++;
        perLevelCorrect[question.level] = (perLevelCorrect[question.level] || 0) + 1;
      }

      submittedQuestions.push({
        questionId: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        userAnswer: userAnswer,
        isCorrect: isCorrect
      });
    }

    // Calculate overall score
    const totalQuestions = PLACEMENT_QUESTIONS.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Determine level based on total correct answers (user-specified thresholds)
    // 0–4: A0, 5–8: A1, 9–12: A2, 13–15: B1
    let determinedLevel = 'A0';
    if (correctCount <= 4) determinedLevel = 'A0';
    else if (correctCount <= 8) determinedLevel = 'A1';
    else if (correctCount <= 12) determinedLevel = 'A2';
    else if (correctCount <= 15) determinedLevel = 'B1';
    
    // Create placement test record
    const placementTest = new PlacementTest({
      userId: req.userId,
      questions: submittedQuestions,
      totalQuestions,
      correctAnswers: correctCount,
      score,
      determinedLevel
    });
    
    await placementTest.save();
    
    // Update user
    const user = await User.findById(req.userId);
    user.level = determinedLevel;
    user.placementTestCompleted = true;
    await user.save();
    
    res.json({
      message: 'Placement test completed',
      score,
      level: determinedLevel,
      correctAnswers: correctCount,
      totalQuestions,
      recommendations: {
        A0: 'A0 (Beginner) — Focus on basic words, greetings and simple Q&A',
        A1: 'A1 (Elementary) — Start with basic greetings and simple conversations',
        A2: 'A2 (Pre-Intermediate) — Focus on everyday vocabulary and present tense',
        B1: 'B1 (Intermediate) — Practice complex sentences and past tense',
        B2: 'B2 (Upper Intermediate) — Work on formal language and nuanced expressions',
        C1: 'C1 (Advanced) — Master advanced grammar and professional language'
      }[determinedLevel]
    });
  } catch (error) {
    console.error('Placement test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Retake placement test
router.post('/retake', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Allow retake
    user.placementTestCompleted = false;
    user.level = null;
    await user.save();
    
    // Delete previous test
    await PlacementTest.deleteMany({ userId: req.userId });
    
    res.json({ message: 'Placement test reset. You can retake it now.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
