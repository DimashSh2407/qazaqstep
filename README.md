# QazaqStep - Kazakh Language Learning Platform

Available on: https://qazaqstep.onrender.com

My little pet-project

A production-ready Kazakh language learning platform combining grammar explanations, speaking practice, and gamification. Built with modern tech stack and ready for scale.


```

**Comprehensive Documentation:**
- IMPLEMENTATION_GUIDE.md - What was built
- TESTING_GUIDE.md - How to test
- ARCHITECTURE.md - Technical design

## Implemented Features

### Authentication
- User registration with email validation
- Secure login with JWT tokens (7-day expiry)
- Password hashing with bcryptjs
- Protected API routes

### Learning Modules
- **Grammar Lessons**: Structured lessons with examples
- **Interactive Tests**: 5-8 questions per lesson with instant feedback
- **Vocabulary Cards**: SM-2 Spaced Repetition Algorithm
- **Placement Test**: 6-question diagnostic test (determines A1-C1 level)

### Gamification
- **Badges System**: 9 types of achievements
  - Streak badges (7-day, 30-day)
  - Points badges (100, 500)
  - Lessons badges (10, 50)
  - Accuracy badge (90%)
  - Vocabulary badge (100 words)
- **Streak Tracking**: Maintains daily learning streaks
- **Points System**: Earn points for each lesson (up to 20 points)

### Advanced Analytics
- **Weak Topics Detection**: Identifies problem areas automatically
- **Weekly Stats**: Tracks progress vs. weekly goal
- **Monthly Stats**: Aggregates monthly learning data
- **Vocabulary Stats**: Shows card distribution by difficulty
- **Overall Statistics**: Complete user profile and metrics

### User Experience
- **Dark Theme**: Modern dark interface with turquoise/purple accents
- **Responsive Design**: Works on mobile, tablet, desktop
- **Progress Indicators**: Visual feedback on all operations
- **Error Handling**: Clear, user-friendly error messages

### Security & Performance
- JWT authentication with token expiry
- Bcrypt password hashing (10 rounds)
- Input validation on all endpoints
- CORS configured
- Efficient database indexing
- localStorage caching for performance

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript (no frameworks)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Design**: Modern EdTech minimalism with responsive layout


## Future Enhancements

- User authentication
- Server-side progress tracking
- Real audio files
- Advanced spaced repetition algorithm
- Social features
- Mobile app

## License

MIT

## Credits

Built as a research-driven MVP addressing key challenges in Kazakh language learning platforms.

---

**Note**: This is an MVP prototype. For production use, implement proper authentication, server-side progress tracking, and real audio files.