// QazaqStep - Lessons List Page JavaScript
// API_BASE already defined in auth.js

// Load lessons on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLessons();
});

// Fetch and display all lessons
function loadLessons() {
    // Get current user's level
    const user = getCurrentUser();
    const userLevel = user ? user.level : null;
    
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
            
            // Filter lessons by user level
            const filteredLessons = filterLessonsByLevel(lessons, userLevel);
            displayLessons(filteredLessons, userLevel);
        })
        .catch(err => {
            console.error('Error loading lessons:', err);
            // Try to use cached data
            const cachedLessons = localStorage.getItem('qazaqstep_cached_lessons');
            if (cachedLessons) {
                try {
                    const lessons = JSON.parse(cachedLessons);
                    const user = getCurrentUser();
                    const userLevel = user ? user.level : null;
                    const filteredLessons = filterLessonsByLevel(lessons, userLevel);
                    displayLessons(filteredLessons, userLevel);
                    const grid = document.getElementById('lessonsGrid');
                    if (grid) {
                        const warning = document.createElement('div');
                        warning.style.cssText = 'text-align: center; padding: 1rem; background: #fff3cd; color: #856404; border-radius: 8px; margin-bottom: 1rem;';
                        warning.textContent = '⚠️ Showing cached data. Server connection lost.';
                        grid.parentNode.insertBefore(warning, grid);
                    }
                } catch (e) {
                    showError();
                }
            } else {
                showError();
            }
        });
}

// Filter lessons based on user's level
function filterLessonsByLevel(lessons, userLevel) {
    if (!userLevel) {
        // If no level, show all lessons (shouldn't happen after placement)
        return lessons;
    }
    
    // Level hierarchy for filtering
    const levelHierarchy = {
        'A0': ['A0', 'A1'],
        'A1': ['A1', 'A2'],
        'A2': ['A2', 'B1'],
        'B1': ['B1', 'B2'],
        'B2': ['B2']
    };
    
    const availableLevels = levelHierarchy[userLevel] || [userLevel];
    
    return lessons.filter(lesson => 
        availableLevels.includes(lesson.level)
    );
}

function showError() {
    const grid = document.getElementById('lessonsGrid');
    if (grid) {
        grid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Error loading lessons. Please make sure the server is running and refresh the page.</p>';
    }
}

// Display lessons in grid
function displayLessons(lessons, userLevel) {
    const grid = document.getElementById('lessonsGrid');
    const header = document.querySelector('.page-title') || document.querySelector('h2');
    
    if (!grid) return;

    // Update header to show user level
    if (header && userLevel) {
        header.textContent = `Lessons for Level ${userLevel}`;
    }

    if (lessons.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">No lessons available for your level. Complete more lessons to unlock higher levels!</p>';
        return;
    }

    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        completedLessons: []
    };

    grid.innerHTML = lessons.map(lesson => {
        const lessonId = lesson._id || lesson.id || '';
        const isCompleted = lessonId && progress.completedLessons ? progress.completedLessons.includes(lessonId) : false;
        const skillsHTML = lesson.skills && lesson.skills.length > 0 ? lesson.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('') : '';

        return `
            <div class="lesson-card">
                <div class="lesson-card-header">
                    <h3 class="lesson-card-title">${lesson.title || 'Untitled'}</h3>
                    <div class="lesson-card-meta">
                        <span class="lesson-badge badge-level">${lesson.level || 'A1'}</span>
                        <span class="lesson-badge badge-duration">${lesson.duration || 15} min</span>
                        ${isCompleted ? '<span class="lesson-badge" style="background-color: #4CAF50; color: white;">✓ Completed</span>' : ''}
                    </div>
                </div>
                <div class="lesson-skills">
                    ${skillsHTML}
                </div>
                <div class="lesson-card-footer">
                    <button class="btn-primary" onclick="startLesson('${lessonId}')">
                        ${isCompleted ? 'Review Lesson' : 'Start Lesson'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Navigate to lesson page
function startLesson(lessonId) {
    window.location.href = `lesson.html?id=${lessonId}`;
}

