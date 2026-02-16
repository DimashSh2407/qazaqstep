# 📁 QazaqStep Project Structure
```
PROJECT_KAZ_LANG/
├── backend/                      # Node.js/Express backend
├── public/                       # Frontend (HTML, CSS, JS)
├── node_modules/               # Зависимости npm
├── .git/                        # Git репозиторий
├── .gitignore                   # Git ignore rules
├── package.json                 # npm конфигурация
├── package-lock.json           # Lock file для зависимостей
└── README.md                    # Основная документация
```

---

## 🔧 Backend Structure (`/backend`)

```
backend/
├── models/                      # Mongoose модели базы данных
│   ├── User.js                 # Модель пользователя
│   ├── Lesson.js               # Модель урока
│   ├── Badge.js                # Модель бейджей/достижений
│   ├── PlacementTest.js        # Модель результатов placement теста
│   └── ShadowingLesson.js      # Модель shadowing уроков
│
├── routes/                      # API маршруты
│   ├── auth.js                 # Аутентификация (login, register)
│   ├── lessons.js              # CRUD уроков + завершение урока
│   ├── placement.js            # Placement тест (questions, submit, retake)
│   ├── vocabulary.js           # Карточки (spaced repetition)
│   ├── badges.js               # Бейджи и достижения
│   └── analytics.js            # Аналитика и статистика
│
├── seed/                        # Инициализация БД
│   └── seedData.js             # Тестовые данные для уроков
│
└── server.js                    # Главный Express сервер
```


## 🗄️ Database Schema

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  username: String (unique),
  level: String (A0-C1 or null),
  placementTestCompleted: Boolean,
  completedLessons: [{lessonId, completedAt, score, timeSpent}],
  totalPoints: Number,
  currentStreak: Number,
  longestStreak: Number,
  lastActivityDate: Date,
  weeklyGoal: Number,
  weeklyProgress: [{week, lessonsCompleted, pointsEarned}],
  vocabularyCards: [{word, translation, nextReviewDate, interval, ease}],
  badges: [{badgeId, earnedAt}],
  weakTopics: [{topic, errorCount, lastError, needsReview}],
  statistics: {
    totalLessonsCompleted,
    totalPointsEarned,
    totalTimeSpent,
    averageScore
  }
}
```

### Lesson Collection
```javascript
{
  title: String,
  level: String (A0, A1, A2, B1, B2, C1),
  duration: Number,
  grammarText: String,
  example: String,
  audioUrl: String,
  testQuestions: [{question, options[], correctAnswer}],
  vocabularyCards: [String],
  skills: [String]
}
```

### PlacementTest Collection
```javascript
{
  userId: ObjectId,
  questions: [{questionId, question, options[], correctAnswer, userAnswer, isCorrect}],
  totalQuestions: Number,
  correctAnswers: Number,
  score: Number (percentage),
  determinedLevel: String (A0-B1),
  completedAt: Date,
  retakeCount: Number
}
```

### Badge Collection
```javascript
{
  badgeId: String,
  name: String,
  description: String,
  icon: String,
  category: String (streak, points, lessons, accuracy, vocabulary, special),
  requirement: String,
  color: String,
  rarity: String (common, rare, epic, legendary)
}
```

---

## 🔄 User Flow & Features

### 1. **Registration & Placement**
```
User registers → Email/Password/Username → Placement Test (15 questions) → Level determined (A0-B1) → Redirect to Home
```

### 2. **Home Page Experience**
```
Login → Home with Quick Access widgets → Progress stats visible → Can access:
- Today's Lesson
- Mini Test
- Audio Practice
- Vocabulary Cards
- Badges/Achievements
```

### 3. **Lesson Flow**
```
Select Lesson → Read Grammar → Take Mini Test → Listen to Audio (Shadowing) → Review Vocabulary → Complete Lesson → Points earned + Progress updated
```

### 4. **Level Progression**
```
A0 → See A0 + A1 lessons → Complete lessons → Unlock A2 content (if achieved B1 score)
A1 → See A1 + A2 lessons
A2 → See A2 + B1 lessons
B1 → See B1 + B2 lessons (B2 placeholder)
```

### 5. **Gamification**
```
- Points: +20 per lesson completion
- Streaks: +1 day for daily activity
- Badges: Unlocked based on milestones (7-day streak, 100 points, etc.)
- Analytics: Track progress, weak topics, recommendations
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken), bcryptjs
- **Middleware**: CORS, express.json

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Dark theme, gradients, flexbox/grid
- **JavaScript (Vanilla)**: No frameworks (lightweight)
- **Storage**: localStorage для progress & cache
- **API Communication**: Fetch API

### Development
- **Package Manager**: npm
- **Version Control**: Git
- **Environment**: .env файл

---

