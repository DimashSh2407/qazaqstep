// QazaqStep - Lessons List Page JavaScript

const API_BASE = 'http://localhost:3000/api';

// Load lessons on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLessons();
});

// Fetch and display all lessons
function loadLessons() {
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
            displayLessons(lessons);
        })
        .catch(err => {
            console.error('Error loading lessons:', err);
            // Try to use cached data
            const cachedLessons = localStorage.getItem('qazaqstep_cached_lessons');
            if (cachedLessons) {
                try {
                    const lessons = JSON.parse(cachedLessons);
                    displayLessons(lessons);
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

function showError() {
    const grid = document.getElementById('lessonsGrid');
    if (grid) {
        grid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Error loading lessons. Please make sure the server is running and refresh the page.</p>';
    }
}

// Display lessons in grid
function displayLessons(lessons) {
    const grid = document.getElementById('lessonsGrid');
    if (!grid) return;

    if (lessons.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">No lessons available.</p>';
        return;
    }

    const progress = JSON.parse(localStorage.getItem('qazaqstep_progress')) || {
        completedLessons: []
    };

    grid.innerHTML = lessons.map(lesson => {
        const isCompleted = progress.completedLessons.includes(lesson._id);
        const skillsHTML = lesson.skills ? lesson.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('') : '';

        return `
            <div class="lesson-card">
                <div class="lesson-card-header">
                    <h3 class="lesson-card-title">${lesson.title}</h3>
                    <div class="lesson-card-meta">
                        <span class="lesson-badge badge-level">${lesson.level}</span>
                        <span class="lesson-badge badge-duration">${lesson.duration} min</span>
                        ${isCompleted ? '<span class="lesson-badge" style="background-color: #4CAF50; color: white;">✓ Completed</span>' : ''}
                    </div>
                </div>
                <div class="lesson-skills">
                    ${skillsHTML}
                </div>
                <div class="lesson-card-footer">
                    <button class="btn-primary" onclick="startLesson('${lesson._id}')">
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

