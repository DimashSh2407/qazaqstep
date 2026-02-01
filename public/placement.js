// QazaqStep - Placement Test JavaScript

// API_BASE already defined in auth.js
let allQuestions = [];
let currentQuestion = 0;
let userAnswers = {};

// Initialize placement test
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    loadPlacementTest();
});

// Load placement test questions
async function loadPlacementTest() {
    try {
        const response = await apiCall('/placement/questions');
        
        if (!response.ok) {
            const data = await response.json();
            if (data.error === 'Placement test already completed') {
                showResultsDirectly(data.currentLevel);
                return;
            }
            throw new Error(data.error || 'Failed to load test');
        }

        const data = await response.json();
        allQuestions = data.questions;
        
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('testContent').style.display = 'block';
        
        displayQuestion(0);
    } catch (error) {
        console.error('Error loading placement test:', error);
        showError(error.message);
    }
}

// Display current question
function displayQuestion(index) {
    if (index < 0 || index >= allQuestions.length) return;
    
    currentQuestion = index;
    const question = allQuestions[index];
    
    // Update progress
    const progressPercent = ((index + 1) / allQuestions.length) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressText').textContent = `Question ${index + 1} of ${allQuestions.length}`;
    
    // Display question
    const container = document.getElementById('questionsContainer');
    container.innerHTML = `
        <div class="test-question">
            <div class="question-text">${question.question}</div>
            <div class="options-list">
                ${question.options.map((option, idx) => `
                    <div class="option-item ${userAnswers[question.id] === idx ? 'selected' : ''}"
                         onclick="selectAnswer('${question.id}', ${idx})" 
                         data-index="${idx}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update buttons
    document.getElementById('prevBtn').style.display = index > 0 ? 'inline-block' : 'none';
    document.getElementById('nextBtn').style.display = index < allQuestions.length - 1 ? 'inline-block' : 'none';
    document.getElementById('submitBtn').style.display = index === allQuestions.length - 1 ? 'inline-block' : 'none';
    
    // Setup button listeners
    if (index > 0) {
        document.getElementById('prevBtn').onclick = () => displayQuestion(index - 1);
    }
    
    if (index < allQuestions.length - 1) {
        document.getElementById('nextBtn').onclick = () => displayQuestion(index + 1);
    }
}

// Select answer
function selectAnswer(questionId, optionIndex) {
    userAnswers[questionId] = optionIndex;

    // Update UI
    const options = document.querySelectorAll('.option-item');
    options.forEach((opt, idx) => {
        opt.classList.remove('selected');
        if (idx === optionIndex) {
            opt.classList.add('selected');
        }
    });
}

// Submit placement test
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('placementForm');
    if (form) {
        form.addEventListener('submit', submitPlacementTest);
    }
});

async function submitPlacementTest(e) {
    e.preventDefault();
    
    // Check if all questions are answered
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < allQuestions.length) {
        alert('Please answer all questions before submitting');
        return;
    }
    
    try {
        const response = await apiCall('/placement/submit', {
            method: 'POST',
            body: JSON.stringify({ answers: userAnswers })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit test');
        }
        
        // Store user level
        const user = getCurrentUser();
        user.level = data.level;
        localStorage.setItem('qazaqstep_user', JSON.stringify(user));
        
        // Show results
        showResults(data);
        
    } catch (error) {
        console.error('Error submitting test:', error);
        alert('Error submitting test: ' + error.message);
    }
}

// Show results
function showResults(data) {
    document.getElementById('testContent').style.display = 'none';
    document.getElementById('resultContent').style.display = 'block';
    
    // Populate results
    document.getElementById('levelBadge').textContent = data.level;
    document.getElementById('correctCount').textContent = `${data.correctAnswers}/${data.totalQuestions}`;
    document.getElementById('scorePercent').textContent = `${data.score}%`;
    
    // Level descriptions
    const descriptions = {
        A0: 'A0 (Beginner) — Начальный уровень. Знаете только базовые слова и приветствия.',
        A1: 'A1 (Elementary) — Элементарный. Можете строить простые фразы и отвечать на бытовые вопросы.',
        A2: 'A2 (Pre-Intermediate) — Базовый. Понимаете основную грамматику и можете объясниться в стандартных ситуациях.',
        B1: 'B1 (Intermediate) — Средний. Свободно общаетесь на знакомые темы и понимаете суть сложных текстов.',
        B2: 'B2 (Upper Intermediate) — Работайте над формальной речью и нюансами.',
        C1: 'C1 (Advanced) — Мастерство в продвинутой грамматике и профессиональном языке.'
    };
    
    document.getElementById('levelDescription').textContent = descriptions[data.level];
    document.getElementById('recommendationText').textContent = data.recommendations;
}

// Show results directly if already completed
function showResultsDirectly(currentLevel) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('resultContent').style.display = 'block';
    
    document.getElementById('levelBadge').textContent = currentLevel;
    document.getElementById('resultContent').innerHTML += `
        <p style="text-align: center; margin-top: 1rem;">
            You've already completed the placement test!<br>
            <button onclick="window.location.href='/'" class="btn-primary" style="margin-top: 1rem;">Start Learning</button>
        </p>
    `;
}

// Show error
function showError(message) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('errorContent').style.display = 'block';
    document.getElementById('errorText').textContent = message;
}

// CSS for placement test (will be added to styles.css)
const placementStyles = `
.placement-section {
    padding: 2rem 0;
}

.placement-subtitle {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.loading-spinner {
    text-align: center;
    padding: 3rem;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(0, 217, 255, 0.2);
    border-top: 4px solid var(--accent-turquoise);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.progress-indicator {
    margin-bottom: 2rem;
}

.placement-form {
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-bottom: 2rem;
}

.placement-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
}

.result-card {
    background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
    border: 1px solid rgba(0, 217, 255, 0.1);
    border-radius: var(--border-radius);
    padding: 3rem;
    text-align: center;
}

.level-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--accent-turquoise) 0%, var(--accent-purple) 100%);
    color: var(--bg-dark);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-weight: 700;
    font-size: 1.5rem;
}

.level-description {
    color: var(--text-secondary);
    margin: 1rem 0 2rem;
}

.result-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 2rem 0;
}

.recommendations {
    background: rgba(157, 78, 221, 0.05);
    border: 1px solid rgba(157, 78, 221, 0.2);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    text-align: left;
    margin: 2rem 0;
}

.recommendations h4 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.recommendations p {
    color: var(--text-secondary);
}

.error-box {
    background: rgba(244, 67, 54, 0.1);
    border: 1px solid rgba(244, 67, 54, 0.2);
    border-radius: var(--border-radius);
    padding: 2rem;
    text-align: center;
    color: #F44336;
}

.btn-secondary {
    background: rgba(0, 217, 255, 0.1);
    color: var(--accent-turquoise);
    border: 1px solid var(--accent-turquoise);
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.btn-secondary:hover {
    background: rgba(0, 217, 255, 0.2);
}

.btn-block {
    width: 100%;
}
`;
