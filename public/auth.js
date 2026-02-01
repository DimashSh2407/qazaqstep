// QazaqStep - Authentication JavaScript

const API_BASE = '/api';
// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    checkAuthentication();
});

// Check if user is already authenticated
function checkAuthentication() {
    const token = localStorage.getItem('qazaqstep_token');
    const currentPage = window.location.pathname;

    if (token && (currentPage.includes('login') || currentPage.includes('register'))) {
        // Redirect to home if already logged in
        window.location.href = '/';
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    // Clear messages
    errorDiv.textContent = '';
    successDiv.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.error || 'Login failed';
            return;
        }

        // Store token
        localStorage.setItem('qazaqstep_token', data.token);
        localStorage.setItem('qazaqstep_user', JSON.stringify(data.user));

        successDiv.textContent = 'Login successful! Redirecting...';
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Connection error. Please try again.';
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    // Clear messages
    errorDiv.textContent = '';
    successDiv.textContent = '';

    // Client-side validation
    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password, passwordConfirm })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.error || 'Registration failed';
            return;
        }

        // Store token
        localStorage.setItem('qazaqstep_token', data.token);
        localStorage.setItem('qazaqstep_user', JSON.stringify(data.user));

        successDiv.textContent = 'Account created! Redirecting to placement test...';
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = '/placement.html';
        }, 1000);

    } catch (error) {
        console.error('Registration error:', error);
        errorDiv.textContent = 'Connection error. Please try again.';
    }
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('qazaqstep_token');
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('qazaqstep_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Logout
function logout() {
    localStorage.removeItem('qazaqstep_token');
    localStorage.removeItem('qazaqstep_user');
    localStorage.removeItem('qazaqstep_progress');
    localStorage.removeItem('qazaqstep_cached_lessons');
    window.location.href = '/';
}

// Make authenticated API call
async function apiCall(endpoint, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        window.location.href = '/login.html';
        throw new Error('Not authenticated');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error('Session expired');
    }

    return response;
}

// Require authentication
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}
