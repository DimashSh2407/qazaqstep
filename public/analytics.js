// QazaqStep - Analytics JavaScript

// API_BASE already defined in auth.js

// Load analytics on page load
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    loadAnalytics();
});

async function loadAnalytics() {
    try {
        // Get overall stats
        const statsResponse = await apiCall('/analytics/overall-stats');
        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
            displayOverallStats(statsData);
        }

        // Get weekly stats
        const weeklyResponse = await apiCall('/analytics/weekly-stats');
        const weeklyData = await weeklyResponse.json();
        
        if (weeklyResponse.ok) {
            displayWeeklyStats(weeklyData);
        }

        // Get weak topics
        const weakTopicsResponse = await apiCall('/analytics/weak-topics');
        const weakTopicsData = await weakTopicsResponse.json();
        
        if (weakTopicsResponse.ok) {
            displayWeakTopics(weakTopicsData);
        }

        // Get vocabulary stats
        const vocabResponse = await apiCall('/vocabulary/stats');
        const vocabData = await vocabResponse.json();
        
        if (vocabResponse.ok) {
            displayVocabularyStats(vocabData);
        }

        // Get monthly stats
        const monthlyResponse = await apiCall('/analytics/monthly-stats');
        const monthlyData = await monthlyResponse.json();
        
        if (monthlyResponse.ok) {
            displayMonthlyStats(monthlyData);
        }

    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function displayOverallStats(data) {
    if (!data.progress) return;

    document.getElementById('lessonsCompleted').textContent = data.progress.totalLessonsCompleted;
    document.getElementById('totalPoints').textContent = data.progress.totalPointsEarned;
    document.getElementById('currentStreak').textContent = `${data.progress.currentStreak} days`;
    document.getElementById('averageScore').textContent = `${data.progress.averageScore}%`;
}

function displayWeeklyStats(data) {
    document.getElementById('weeklyLessons').textContent = `${data.lessonsCompleted}/${data.weeklyGoal}`;
    document.getElementById('weeklyPoints').textContent = data.pointsEarned;
    document.getElementById('weeklyProgress').textContent = `${data.progress}%`;
    
    const progressFill = document.getElementById('weeklyProgressFill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(data.progress, 100)}%`;
    }
}

function displayWeakTopics(data) {
    const container = document.getElementById('weakTopicsContainer');
    
    if (!data.weakTopics || data.weakTopics.length === 0) {
        container.innerHTML = '<p class="empty-state">No weak topics. Keep it up! 🎉</p>';
        return;
    }

    const html = data.weakTopics.map(topic => `
        <div class="topic-item">
            <div class="topic-info">
                <span class="topic-name">${topic.topic}</span>
                <span class="topic-errors">${topic.errorCount} errors</span>
            </div>
            <div class="topic-priority priority-${topic.priority}">
                ${topic.priority.toUpperCase()}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function displayVocabularyStats(data) {
    document.getElementById('totalCards').textContent = data.totalCards;
    document.getElementById('easyCards').textContent = data.easyCards;
    document.getElementById('mediumCards').textContent = data.mediumCards;
    document.getElementById('hardCards').textContent = data.hardCards;
}

function displayMonthlyStats(data) {
    document.getElementById('monthlyLessons').textContent = data.totalLessonsCompleted;
    document.getElementById('monthlyPoints').textContent = data.totalPointsEarned;
    document.getElementById('avgPerWeek').textContent = data.averageLessonsPerWeek;
}
