const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qazaqstep';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const lessonsRoutes = require('./routes/lessons');
const { router: authRoutes } = require('./routes/auth');
const placementRoutes = require('./routes/placement');
const vocabularyRoutes = require('./routes/vocabulary');
const analyticsRoutes = require('./routes/analytics');
const { router: badgesRoutes } = require('./routes/badges');

app.use('/api/lessons', lessonsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/badges', badgesRoutes);

// Progress route (legacy, kept for compatibility)
app.post('/api/progress', (req, res) => {
  res.json({ success: true, message: 'Progress saved' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve specific HTML pages
app.get('/lessons.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'lessons.html'));
});

app.get('/lesson.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'lesson.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'about.html'));
});

// Serve frontend (catch-all for index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

