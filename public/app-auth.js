// QazaqStep - Authentication UI Management

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

function updateAuthUI() {
    const isAuth = isAuthenticated();
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const analyticsLink = document.getElementById('analyticsLink');

    if (isAuth) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';
        if (analyticsLink) analyticsLink.style.display = 'inline-block';
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (analyticsLink) analyticsLink.style.display = 'none';
    }
}

// Expose functions globally for onclick handlers
window.logout = logout;
