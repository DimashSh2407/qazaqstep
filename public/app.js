// QazaqStep - Home Page JavaScript
// API_BASE already defined in auth.js

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    loadTodayLesson();
    setupLearningGoal();
    updateBadges();
});

// Load user progress — fetch from server for authenticated users, fallback to localStorage
function loadProgress() {
    // First fetch total lessons count (public endpoint)
    fetch(`${API_BASE}/lessons`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
    })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to load lessons'))
        .then(lessons => {
            const totalLessons = lessons.length;

            // If user is authenticated, fetch real stats from server
            if (isAuthenticated()) {
                return apiCall('/analytics/overall-stats')
                    .then(res => res.ok ? res.json() : Promise.reject('Failed to load stats'))
                    .then(stats => {
                        const progress = {
                            completedLessons: new Array(stats.progress.totalLessonsCompleted || 0),
                            streak: stats.progress.currentStreak || 0,
                            points: stats.progress.totalPointsEarned || 0,
                            totalLessons: totalLessons
                        };
                        updateProgressDisplay(progress);
                    })
                    .catch(err => {
                        console.error('Error loading server stats:', err);
                        loadProgressFromLocalStorage(totalLessons);
                    });
            } else {
                loadProgressFromLocalStorage(totalLessons);
            }
        })
        .catch(err => {
            console.error('Error loading lessons:', err);
            loadProgressFromLocalStorage(10);
        });
}

// Fallback: load progress from localStorage
function loadProgressFromLocalStorage(totalLessons) {
    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        completedLessons: [],
        streak: 0,
        points: 0
    };
    progress.totalLessons = totalLessons;
    updateProgressDisplay(progress);
}

// Update progress display
function updateProgressDisplay(progress) {
    const completed = progress.completedLessons.length;
    const total = progress.totalLessons || 3; // Default to 3 if not loaded
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('lessonsCompleted').textContent = completed;
    document.getElementById('currentStreak').textContent = `${progress.streak} days`;
    document.getElementById('totalPoints').textContent = progress.points;

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `${percentage}% Complete`;
    }
}

// Load today's lesson
function loadTodayLesson() {
    fetch(`${API_BASE}/lessons`, {
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
        .then(lessons => {
            // Cache lessons for offline use
            localStorage.setItem('qazaqstep_cached_lessons', JSON.stringify(lessons));

            if (lessons.length > 0) {
                const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
                    completedLessons: []
                };

                // Find first incomplete lesson
                const incompleteLesson = lessons.find(lesson => {
                    const id = lesson._id || lesson.id;
                    return id && !progress.completedLessons.includes(id);
                }) || lessons[0];

                const todayLessonEl = document.getElementById('todayLesson');
                if (todayLessonEl && incompleteLesson && (incompleteLesson._id || incompleteLesson.id)) {
                    todayLessonEl.textContent = incompleteLesson.title || 'Untitled Lesson';
                    // Store lesson ID for quick access
                    const lessonId = incompleteLesson._id || incompleteLesson.id;
                    todayLessonEl.dataset.lessonId = lessonId;
                }

                // Update widget info
                updateWidgetInfo(lessons);
            }
        })
        .catch(err => {
            console.error('Error loading today lesson:', err);
            // Try to use cached data
            const cachedLessons = localStorage.getItem('qazaqstep_cached_lessons');
            if (cachedLessons) {
                try {
                    const lessons = JSON.parse(cachedLessons);
                    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
                        completedLessons: []
                    };
                    const incompleteLesson = lessons.find(lesson => {
                        const id = lesson._id || lesson.id;
                        return id && !progress.completedLessons.includes(id);
                    }) || lessons[0];
                    const todayLessonEl = document.getElementById('todayLesson');
                    if (todayLessonEl && incompleteLesson && (incompleteLesson._id || incompleteLesson.id)) {
                        todayLessonEl.textContent = incompleteLesson.title || 'Untitled Lesson';
                        const lessonId = incompleteLesson._id || incompleteLesson.id;
                        todayLessonEl.dataset.lessonId = lessonId;
                    }
                } catch (e) {
                    console.error('Error parsing cached lessons:', e);
                }
            }
        });
}

// Setup learning goal selector
function setupLearningGoal() {
    const goalSelector = document.getElementById('learningGoal');
    if (!goalSelector) return;

    // Load saved goal
    const savedGoal = localStorage.getItem('qazaqstep_goal') || 'study';
    goalSelector.value = savedGoal;

    // Update on change
    goalSelector.addEventListener('change', (e) => {
        localStorage.setItem('qazaqstep_goal', e.target.value);
        updateGoalDisplay(e.target.value);
    });

    updateGoalDisplay(savedGoal);
}

// Update display based on learning goal
function updateGoalDisplay(goal) {
    // This could customize the home page based on goal
    // For MVP, we'll just store it
    console.log('Learning goal updated to:', goal);
}

// Update badges display
function updateBadges() {
    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        completedLessons: [],
        points: 0
    };

    let badgeCount = 0;

    // Calculate badges based on achievements
    if (progress.completedLessons.length >= 1) badgeCount++;
    if (progress.completedLessons.length >= 3) badgeCount++;
    if (progress.streak >= 3) badgeCount++;
    if (progress.streak >= 7) badgeCount++;
    if (progress.points >= 100) badgeCount++;
    if (progress.points >= 500) badgeCount++;

    const badgesEl = document.getElementById('badgesCount');
    if (badgesEl) {
        badgesEl.textContent = `${badgeCount} badges earned`;
    }
}

// Quick Access Functions
function openTodayLesson() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    const todayLessonEl = document.getElementById('todayLesson');
    const lessonId = todayLessonEl?.dataset.lessonId;

    if (lessonId) {
        window.location.href = `lesson.html?id=${lessonId}`;
    } else {
        // Load lessons and find first incomplete
        fetch(`${API_BASE}/lessons`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache'
        })
            .then(res => res.json())
            .then(lessons => {
                const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || { completedLessons: [] };
                const incompleteLesson = lessons.find(lesson => !progress.completedLessons.includes(lesson._id)) || lessons[0];
                if (incompleteLesson) {
                    window.location.href = `lesson.html?id=${incompleteLesson._id}`;
                } else {
                    window.location.href = 'lessons.html';
                }
            })
            .catch(() => {
                window.location.href = 'lessons.html';
            });
    }
}

function openMiniTest() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    // Find a lesson with test questions
    fetch(`${API_BASE}/lessons`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
    })
        .then(res => res.json())
        .then(lessons => {
            const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || { completedLessons: [] };
            const lessonWithTest = lessons.find(lesson => {
                const id = lesson._id || lesson.id;
                return lesson.testQuestions && lesson.testQuestions.length > 0 && id && !progress.completedLessons.includes(id);
            }) || lessons.find(lesson => lesson.testQuestions && lesson.testQuestions.length > 0) || lessons[0];

            if (lessonWithTest && (lessonWithTest._id || lessonWithTest.id)) {
                const lessonId = lessonWithTest._id || lessonWithTest.id;
                window.location.href = `lesson.html?id=${lessonId}#test`;
            } else {
                window.location.href = 'lessons.html';
            }
        })
        .catch(() => {
            window.location.href = 'lessons.html';
        });
}

function openAudioDialogue() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    // Find a lesson with audio
    fetch(`${API_BASE}/lessons`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
    })
        .then(res => res.json())
        .then(lessons => {
            const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || { completedLessons: [] };
            const lessonWithAudio = lessons.find(lesson => {
                const id = lesson._id || lesson.id;
                return lesson.audioUrl && id && !progress.completedLessons.includes(id);
            }) || lessons.find(lesson => lesson.audioUrl) || lessons[0];

            if (lessonWithAudio && (lessonWithAudio._id || lessonWithAudio.id)) {
                const lessonId = lessonWithAudio._id || lessonWithAudio.id;
                window.location.href = `lesson.html?id=${lessonId}#audio`;
            } else {
                window.location.href = 'lessons.html';
            }
        })
        .catch(() => {
            window.location.href = 'lessons.html';
        });
}

function openVocabulary() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    // Find a lesson with vocabulary cards
    fetch(`${API_BASE}/lessons`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
    })
        .then(res => res.json())
        .then(lessons => {
            const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || { completedLessons: [] };
            const lessonWithVocab = lessons.find(lesson => {
                const id = lesson._id || lesson.id;
                return lesson.vocabularyCards && lesson.vocabularyCards.length > 0 && id && !progress.completedLessons.includes(id);
            }) || lessons.find(lesson => lesson.vocabularyCards && lesson.vocabularyCards.length > 0) || lessons[0];

            if (lessonWithVocab && (lessonWithVocab._id || lessonWithVocab.id)) {
                const lessonId = lessonWithVocab._id || lessonWithVocab.id;
                window.location.href = `lesson.html?id=${lessonId}#vocabulary`;
            } else {
                window.location.href = 'lessons.html';
            }
        })
        .catch(() => {
            window.location.href = 'lessons.html';
        });
}

// Update widget information
function updateWidgetInfo(lessons) {
    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || { completedLessons: [] };

    // Update mini test info
    const testLesson = lessons.find(lesson => lesson.testQuestions && lesson.testQuestions.length > 0);
    const miniTestInfo = document.getElementById('miniTestInfo');
    if (miniTestInfo && testLesson) {
        miniTestInfo.textContent = `${testLesson.testQuestions.length} questions available`;
    }

    // Update audio info
    const audioLesson = lessons.find(lesson => lesson.audioUrl);
    const audioInfo = document.getElementById('audioInfo');
    if (audioInfo && audioLesson) {
        audioInfo.textContent = 'Listen and practice';
    }

    // Update vocab info
    const vocabLesson = lessons.find(lesson => lesson.vocabularyCards && lesson.vocabularyCards.length > 0);
    const vocabInfo = document.getElementById('vocabInfo');
    if (vocabInfo && vocabLesson) {
        vocabInfo.textContent = `${vocabLesson.vocabularyCards.length} words to review`;
    }
}

