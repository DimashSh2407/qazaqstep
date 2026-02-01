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
app.use(express.static('public'));

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
app.use('/api/lessons', lessonsRoutes);

// Progress route (mock implementation)
app.post('/api/progress', (req, res) => {
  // Mock implementation - in real app, would save to database
  res.json({ success: true, message: 'Progress saved' });
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

