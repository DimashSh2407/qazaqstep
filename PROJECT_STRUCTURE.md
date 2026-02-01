# 📁 QazaqStep Project Structure

## 🎯 Project Overview
**QazaqStep** — это современная платформа для изучения казахского языка, которая объединяет качественную грамматику, разговорную практику, аудио-диалоги, карточки для запоминания и элементы геймификации.

---

## 📂 Root Directory Structure

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

### 📝 Backend Models в деталях

#### `User.js`
- **Поля**: email, password, username, level, learningGoal
- **Геймификация**: totalPoints, currentStreak, longestStreak
- **Прогресс**: completedLessons[], weeklyProgress[], vocabularyCards[]
- **Бейджи**: badges[], weakTopics[]
- **Методы**: updateStreak(), password хеширование

#### `Lesson.js`
- **Поля**: title, level (A0-C1), duration, grammarText, example
- **Контент**: audioUrl, testQuestions[], vocabularyCards[], skills[]
- **Уровни**: A0, A1, A2, B1, B2, C1

#### `Badge.js`
- **Поля**: badgeId, name, description, icon, category
- **Категории**: streak, points, lessons, accuracy, vocabulary, special
- **Свойства**: requirement, color, rarity (common, rare, epic, legendary)

#### `PlacementTest.js`
- **Результаты**: questions[], totalQuestions, correctAnswers, score
- **Уровень**: determinedLevel (A0-B1)
- **Отслеживание**: userId, completedAt, retakeCount

#### `ShadowingLesson.js`
- **Контент**: audioUrl, transcription, targetPronunciation
- **Записи пользователя**: recordings[], accuracy, bestAccuracy
- **Отслеживание**: practiceCount, difficulty, completedAt

### 🛣️ Backend Routes (API)

| Метод | Путь | Описание |
|-------|------|---------|
| POST | `/api/auth/login` | Вход пользователя |
| POST | `/api/auth/register` | Регистрация пользователя |
| GET | `/api/lessons` | Получить все уроки |
| GET | `/api/lessons/:id` | Получить урок по ID |
| POST | `/api/lessons/:id/complete` | Отметить урок готовым |
| GET | `/api/lessons/:id/progress` | Прогресс по уроку |
| GET | `/api/placement/questions` | Вопросы placement теста |
| POST | `/api/placement/submit` | Отправить результаты теста |
| POST | `/api/placement/retake` | Переделать тест |
| GET | `/api/vocabulary/due` | Слова для повторения |
| GET | `/api/vocabulary/review` | Слова на проверку |
| POST | `/api/vocabulary/add` | Добавить карточку |
| GET | `/api/vocabulary/stats` | Статистика словаря |
| GET | `/api/badges` | Все бейджи |
| GET | `/api/badges/my` | Мои бейджи |
| GET | `/api/analytics/overall-stats` | Общая статистика |
| GET | `/api/analytics/weekly-stats` | Статистика за неделю |
| GET | `/api/analytics/monthly-stats` | Статистика за месяц |
| GET | `/api/analytics/weak-topics` | Слабые темы |

---

## 🎨 Frontend Structure (`/public`)

```
public/
├── index.html                  # Главная страница
├── lessons.html                # Список уроков
├── lesson.html                 # Отдельный урок
├── placement.html              # Placement тест
├── analytics.html              # Аналитика и прогресс
├── login.html                  # Страница входа
├── register.html               # Страница регистрации
├── about.html                  # О проекте
│
├── js-файлы (логика):
│   ├── auth.js                 # Аутентификация (login, register, token)
│   ├── app-auth.js             # Управление UI для auth (показ/скрытие)
│   ├── app.js                  # Главная страница (Quick Access, Progress)
│   ├── lessons.js              # Список уроков + фильтрация по уровню
│   ├── lesson.js               # Отдельный урок (grammar, test, audio, vocab)
│   ├── placement.js            # Placement тест (вопросы, отправка, результаты)
│   └── analytics.js            # Аналитика (stats, charts, weak topics)
│
├── styles.css                  # Стили (темная тема + градиенты)
└── .env                        # Переменные окружения (API_BASE и т.д.)
```

### 📄 Frontend Pages в деталях

#### `index.html` (Главная)
- Hero секция
- Progress Card (Lessons, Streak, Points, Progress Bar)
- Quick Access widgets:
  - Today's Lesson
  - Mini Test
  - Audio Dialogue
  - Vocabulary Cards
  - Badges

#### `lessons.html` (Список уроков)
- Фильтрация по уровню пользователя
- Карточки уроков (title, level, duration, skills)
- Статус завершения (✓ Completed или Start Lesson)
- Кеширование данных

#### `lesson.html` (Отдельный урок)
- **Grammar Section**: grammarText + example
- **Mini Test Section**: 5-8 вопросов с проверкой ответов
- **Audio Dialogue Section**: shadowing практика
- **Vocabulary Cards Section**: карточки со словами
- Progress bar + Points + Streak
- Complete Lesson кнопка

#### `placement.html` (Placement тест)
- 15 вопросов (A0-B1 уровни)
- Навигация (Prev/Next/Submit)
- Progress indicator
- Результаты с рекомендациями
- Определение уровня

#### `analytics.html` (Аналитика)
- Overall Stats (Lessons, Points, Streak, Avg Score)
- Weekly Progress (lessons, points, goal %)
- Weak Topics (с приоритизацией)
- Vocabulary Stats (due, reviewed)
- Monthly Stats (графики)

#### `login.html` / `register.html`
- Формы для входа/регистрации
- Валидация
- Обработка ошибок
- Редирект после успеха

---

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

## 📊 Seed Data

### `seedData.js` содержит:
- **A1 уроки** (7 шт): Greetings, Numbers, Family, Food, Colors, Present Tense, Verbs
- **A2 уроки** (7 шт): Past Tense, Future Tense, Adjectives, Possessive Forms
- **B1 уроки** (3 шт): Extended Past, Conditional Mood, Professional Language
- **B2 уроки** (3 шт): Complex Narratives, Formal Business, Literary Analysis

**Всего**: 20 уроков, каждый с:
- Grammar объяснением
- 5-8 тестовыми вопросами
- Примерами
- Словарными карточками
- Audio URL (placeholder)

---

## 🚀 Deployment & Configuration

### `.env` файл
```
MONGODB_URI=mongodb://localhost:27017/qazaqstep
PORT=3000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### `package.json` скрипты
```json
{
  "scripts": {
    "start": "node backend/server.js",
    "seed": "node backend/seed/seedData.js"
  }
}
```

### Запуск проекта
```bash
# 1. Установка зависимостей
npm install

# 2. Инициализация БД
npm run seed

# 3. Запуск сервера
npm start

# 4. Открыть браузер
http://localhost:3000
```

---

## 🎯 Key Features Summary

| Функция | Статус | Файл(ы) |
|---------|--------|---------|
| ✅ Регистрация & Вход | Готово | auth.js, register.html, login.html |
| ✅ Placement тест | Готово | placement.html, placement.js, backend/routes/placement.js |
| ✅ Уроки с фильтрацией по уровню | Готово | lessons.html, lessons.js, backend/routes/lessons.js |
| ✅ Mini tests | Готово | lesson.html, lesson.js |
| ✅ Audio & Shadowing | Подготовлено | lesson.html, ShadowingLesson.js |
| ✅ Vocabulary Cards (spaced rep.) | Подготовлено | backend/routes/vocabulary.js, User.js |
| ✅ Gamification (points, streaks) | Готово | app.js, User.js, index.html |
| ✅ Badges & Achievements | Готово | badges.js, Badge.js, index.html |
| ✅ Analytics & Progress | Готово | analytics.html, analytics.js, backend/routes/analytics.js |
| ⚠️ Real Audio Playback | Заглушка | lesson.html |
| ⚠️ Speech Recognition | Подготовлено | ShadowingLesson.js |

---

## 📞 Contact & Support

- **Project**: QazaqStep
- **Version**: 1.0.0
- **Language**: Kazakh, Russian, English
- **Status**: Beta (Ready for testing)

---

**Last Updated**: February 1, 2026
