# QazaqStep - Kazakh Language Learning Platform MVP

A research-driven Kazakh language learning platform that combines grammar explanations, speaking practice, and gamification to address key challenges in existing language learning solutions.

## 🎯 Features

- **Grammar Lessons**: Clear, structured grammar explanations with examples
- **Speaking Practice**: Audio dialogues and shadowing exercises
- **Interactive Tests**: 5-8 question mini-tests with instant feedback
- **Vocabulary Cards**: Spaced repetition system for word retention
- **Gamification**: Points, badges, streaks, and progress tracking
- **Personalized Learning**: Learning goal selection (Study/Work/Daily life)
- **Modern Design**: Clean, professional EdTech interface

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript (no frameworks)
- **Backend**: Node.js + Express
- **Database**: MongoDB (local or Atlas)
- **Design**: Modern EdTech minimalism with responsive layout

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
# On Windows (if installed as service, it should start automatically)
# Or start manually:
mongod

# On macOS (using Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

**MongoDB Atlas:**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update the `MONGODB_URI` in `.env` file

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/qazaqstep
PORT=3000
```

**Note**: If you don't create a `.env` file, the app will use the default values shown above.

### 4. Seed the Database

Populate MongoDB with sample lessons:

```bash
npm run seed
```

This will create 3 demo lessons:
- Greetings and Introductions (A1)
- Numbers and Counting (A1)
- Present Tense Verbs (A2)

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 📁 Project Structure

```
PROJECT_KAZ_LANG/
├── backend/
│   ├── server.js          # Express server setup
│   ├── models/
│   │   └── Lesson.js       # MongoDB lesson schema
│   ├── routes/
│   │   └── lessons.js      # API routes for lessons
│   └── seed/
│       └── seedData.js     # Database seeding script
├── public/
│   ├── index.html          # Home page
│   ├── lessons.html        # Lessons list page
│   ├── lesson.html         # Single lesson page
│   ├── about.html          # About/Research page
│   ├── styles.css          # Main stylesheet
│   ├── app.js              # Home page JavaScript
│   ├── lessons.js          # Lessons list JavaScript
│   └── lesson.js           # Single lesson JavaScript
├── package.json
├── .env                    # Environment variables
└── README.md
```

## 🎨 Design System

### Colors
- **Indigo (#1A237E)**: Navigation bars, headers
- **Neon Turquoise (#00BCD4)**: Primary buttons, accents
- **Anthracite (#2E2E2E)**: Main text
- **Light Gray (#F5F5F5)**: Background

### Typography
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first (320px → 768px → 1024px)

## 📡 API Endpoints

### GET `/api/lessons`
Returns all lessons

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Greetings and Introductions",
    "level": "A1",
    "duration": 15,
    "grammarText": "...",
    "example": "...",
    "testQuestions": [...],
    "vocabularyCards": [...],
    "skills": ["grammar", "speaking", "listening"]
  }
]
```

### GET `/api/lessons/:id`
Returns a single lesson by ID

### POST `/api/progress`
Saves user progress (mock implementation)

## 💾 Local Storage

The app uses browser localStorage to track:
- Completed lessons
- Current streak
- Total points
- Learning goal preference

**Storage Key**: `qazaqstep_progress`

## 🎮 Gamification Features

- **Points**: Earned by completing tests and lessons
- **Streaks**: Daily practice tracking
- **Badges**: Unlocked based on achievements
- **Progress Bar**: Visual representation of completion

## 🔧 Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection error":
1. Ensure MongoDB is running: `mongod` or check service status
2. Verify connection string in `.env`
3. Check MongoDB port (default: 27017)

### Port Already in Use

If port 3000 is busy:
1. Change `PORT` in `.env` file
2. Or kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill
   ```

### Lessons Not Loading

1. Ensure database is seeded: `npm run seed`
2. Check MongoDB connection
3. Verify API endpoints in browser console

## 🚧 Future Enhancements

- User authentication
- Server-side progress tracking
- Real audio files
- Advanced spaced repetition algorithm
- Social features
- Mobile app

## 📝 License

MIT

## 👥 Credits

Built as a research-driven MVP addressing key challenges in Kazakh language learning platforms.

---

**Note**: This is an MVP prototype. For production use, implement proper authentication, server-side progress tracking, and real audio files.

