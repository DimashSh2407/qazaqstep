// QazaqStep - Single Lesson Page JavaScript
// API_BASE already defined in auth.js

let currentLesson = null;
let userAnswers = {};
let testCompleted = false;

// Load lesson on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    
    if (lessonId) {
        loadLesson(lessonId);
    } else {
        showError('No lesson ID provided');
    }

    setupEventListeners();
    updateLessonProgress();
    
    // Scroll to section if hash is present
    setTimeout(() => {
        const hash = window.location.hash;
        if (hash) {
            const section = document.querySelector(hash);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, 500);
});

// Setup event listeners
function setupEventListeners() {
    const checkAnswersBtn = document.getElementById('checkAnswersBtn');
    if (checkAnswersBtn) {
        checkAnswersBtn.addEventListener('click', checkAnswers);
    }

    const completeBtn = document.getElementById('completeLessonBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', completeLesson);
    }

    const playAudioBtn = document.getElementById('playAudioBtn');
    if (playAudioBtn) {
        playAudioBtn.addEventListener('click', playAudio);
    }
}

// Fetch and display lesson
function loadLesson(lessonId) {
    fetch(`${API_BASE}/lessons/${lessonId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache'
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(lesson => {
            currentLesson = lesson;
            displayLesson(lesson);
        })
        .catch(err => {
            console.error('Error loading lesson:', err);
            showError('Error loading lesson. Please make sure the server is running and refresh the page.');
        });
}

// Display lesson content
function displayLesson(lesson) {
    // Update header
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonLevel').textContent = lesson.level;
    document.getElementById('lessonDuration').textContent = `${lesson.duration} min`;

    // Display grammar
    document.getElementById('grammarText').textContent = lesson.grammarText;
    document.getElementById('grammarExample').textContent = lesson.example;

    // Display test
    displayTest(lesson.testQuestions);

    // Display vocabulary
    displayVocabulary(lesson.vocabularyCards || []);
}

// Display test questions
function displayTest(questions) {
    const container = document.getElementById('testContainer');
    if (!container) return;

    container.innerHTML = questions.map((q, index) => {
        return `
            <div class="test-question" data-question-index="${index}">
                <div class="question-text">${index + 1}. ${q.question}</div>
                <div class="options-list">
                    ${q.options.map((option, optIndex) => `
                        <div class="option-item" 
                             data-question="${index}" 
                             data-option="${optIndex}"
                             onclick="selectOption(${index}, ${optIndex})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    // Show check answers button
    const checkBtn = document.getElementById('checkAnswersBtn');
    if (checkBtn) {
        checkBtn.style.display = 'block';
    }
}

// Select option
function selectOption(questionIndex, optionIndex) {
    if (testCompleted) return;

    userAnswers[questionIndex] = optionIndex;

    // Update UI
    const questionEl = document.querySelector(`[data-question-index="${questionIndex}"]`);
    const options = questionEl.querySelectorAll('.option-item');
    options.forEach((opt, idx) => {
        opt.classList.remove('selected');
        if (idx === optionIndex) {
            opt.classList.add('selected');
        }
    });
}

// Check answers
function checkAnswers() {
    if (!currentLesson) return;

    testCompleted = true;
    const questions = currentLesson.testQuestions;
    let correctCount = 0;

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = q.correctAnswer;
        const questionEl = document.querySelector(`[data-question-index="${index}"]`);
        const options = questionEl.querySelectorAll('.option-item');

        options.forEach((opt, optIndex) => {
            opt.classList.remove('correct', 'incorrect');
            if (optIndex === correctAnswer) {
                opt.classList.add('correct');
            } else if (optIndex === userAnswer && userAnswer !== correctAnswer) {
                opt.classList.add('incorrect');
            }
        });

        if (userAnswer === correctAnswer) {
            correctCount++;
        }
    });

    // Show results
    const score = Math.round((correctCount / questions.length) * 100);
    const resultsEl = document.getElementById('testResults');
    if (resultsEl) {
        resultsEl.style.display = 'block';
        resultsEl.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: ${score >= 70 ? '#4CAF50' : '#F44336'}; margin-bottom: 0.5rem;">
                    Score: ${score}% (${correctCount}/${questions.length})
                </h3>
                <p style="color: #666;">
                    ${score >= 70 ? 'Great job! 🎉' : 'Keep practicing! 💪'}
                </p>
            </div>
        `;
    }

    // Update points
    const pointsEarned = correctCount * 10;
    updatePoints(pointsEarned);

    // Hide check button
    const checkBtn = document.getElementById('checkAnswersBtn');
    if (checkBtn) {
        checkBtn.style.display = 'none';
    }
}

// Display vocabulary cards
function displayVocabulary(cards) {
    const grid = document.getElementById('vocabularyGrid');
    if (!grid) return;

    if (cards.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">No vocabulary cards for this lesson.</p>';
        return;
    }

    grid.innerHTML = cards.map(card => {
        const [word, translation] = card.split(' - ');
        return `
            <div class="vocab-card">
                <div class="vocab-word">${word}</div>
                <div class="vocab-translation">${translation}</div>
            </div>
        `;
    }).join('');
}

// Play audio (simulation)
function playAudio() {
    const btn = document.getElementById('playAudioBtn');
    if (btn) {
        btn.textContent = '🔊 Playing...';
        btn.disabled = true;
        
        // Simulate audio playback
        setTimeout(() => {
            btn.textContent = '▶️ Play Audio';
            btn.disabled = false;
            alert('Audio playback simulation complete. In production, this would play the actual dialogue.');
        }, 2000);
    }
}

// Update lesson progress
function updateLessonProgress() {
    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        completedLessons: [],
        streak: 0,
        points: 0
    };

    const progressFill = document.getElementById('lessonProgressFill');
    if (progressFill) {
        // Simulate progress based on sections completed
        progressFill.style.width = '0%';
    }

    updatePoints(0);
    updateStreak();
}

// Update points display
function updatePoints(additionalPoints = 0) {
    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        points: 0
    };

    if (additionalPoints > 0) {
        progress.points = (progress.points || 0) + additionalPoints;
        localStorage.setItem('qazaqstep_progress', JSON.stringify(progress));
    }

    const pointsEl = document.getElementById('lessonPoints');
    if (pointsEl) {
        pointsEl.textContent = progress.points || 0;
    }
}

// Update streak display
function updateStreak() {
    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        streak: 0
    };

    const streakEl = document.getElementById('lessonStreak');
    if (streakEl) {
        streakEl.textContent = `${progress.streak || 0} days`;
    }
}

// Complete lesson
async function completeLesson() {
    if (!currentLesson) {
        console.error('No current lesson found');
        alert('Error: Lesson not loaded. Please refresh the page.');
        return;
    }

    // Calculate score based on completed mini-tests (simplified)
    let totalScore = 100;
    const testResults = JSON.parse(sessionStorage.getItem('testResults')) || {};
    if (Object.keys(testResults).length > 0) {
        const scores = Object.values(testResults);
        totalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    const timeSpent = Math.round((Date.now() - (window.lessonStartTime || Date.now())) / 1000);

    // Use apiCall helper (adds token) and robust ID handling
    const lessonId = currentLesson._id || currentLesson.id || currentLesson;

    try {
        const response = await apiCall(`/lessons/${lessonId}/complete`, {
            method: 'POST',
            body: JSON.stringify({ score: totalScore, timeSpent: timeSpent, errors: [] })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Server error completing lesson:', data);
            alert(data && data.error ? `Failed: ${data.error}` : 'Failed to complete lesson.');
            return;
        }

        console.log('Lesson marked as complete:', data);

        // Update local progress
        const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || { completedLessons: [], streak: 0, points: 0 };
        const idStr = String(lessonId);

        if (!progress.completedLessons.includes(idStr)) {
            progress.completedLessons.push(idStr);
            progress.streak = (progress.streak || 0) + 1;
            progress.points = (progress.points || 0) + (data.pointsEarned || 50);
            localStorage.setItem('qazaqstep_progress', JSON.stringify(progress));
        }

        // Update UI
        const progressFill = document.getElementById('lessonProgressFill');
        if (progressFill) progressFill.style.width = '100%';
        updatePoints(0);
        updateStreak();

        const completeBtn = document.getElementById('completeLessonBtn');
        if (completeBtn) {
            completeBtn.textContent = '✓ Lesson Completed!';
            completeBtn.style.backgroundColor = '#4CAF50';
            completeBtn.disabled = true;
        }

        alert('🎉 Lesson completed! You earned points!');
        setTimeout(() => { window.location.href = 'lessons.html'; }, 1500);
    } catch (err) {
        console.error('Error completing lesson:', err);
        alert('Failed to complete lesson. Please try again.');
    }
}

// Show error message
function showError(message) {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: #F44336;">Error</h2>
                <p style="color: #666;">${message}</p>
                <a href="lessons.html" class="btn-primary" style="margin-top: 1rem; display: inline-block;">Back to Lessons</a>
            </div>
        `;
    }
}

