const API = 'http://localhost:5000/api';

// ===== Force Clear Fields =====
function forceClearFields() {
    const fields = ['loginEmail', 'loginPassword', 'signupName', 'signupEmail', 'signupPassword'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
            if (el.type === 'password') el.type = 'password';
        }
    });
}

// ===== Open/Close Modal =====
function openModal(tab) {
    document.getElementById('authModal').classList.add('active');
    switchTab(tab);
    forceClearFields();
    setTimeout(forceClearFields, 50);
    setTimeout(forceClearFields, 150);
    setTimeout(forceClearFields, 300);
    const msg = document.getElementById('modalMessage');
    if (msg) { msg.className = 'message-box'; msg.textContent = ''; }
}

function closeModal() {
    document.getElementById('authModal').classList.remove('active');
    forceClearFields();
}

document.getElementById('authModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// ===== Switch Tab =====
function switchTab(tab) {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const tabSignIn = document.getElementById('tabSignIn');
    const tabSignUp = document.getElementById('tabSignUp');
    const subtitle = document.getElementById('modalSubtitle');

    if (tab === 'signin') {
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        subtitle.textContent = 'Sign in to your account';
    } else {
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        subtitle.textContent = 'Create your FixMate account';
    }

    forceClearFields();
    setTimeout(forceClearFields, 50);
    const msg = document.getElementById('modalMessage');
    if (msg) { msg.className = 'message-box'; msg.textContent = ''; }
}

// ===== Toast =====
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Password Toggle =====
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// ===== Sign In =====
async function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (email.toLowerCase() === 'admin@fixmate.com') {
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@fixmate.com', password: 'admin123' })
            });
            const data = await res.json();
            if (data.success && data.user.role === 'admin') {
                showToast('✅ Admin Login successful!', 'success');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setTimeout(() => { closeModal(); window.location.href = 'admin.html'; }, 1500);
            } else {
                showToast('❌ Admin login failed', 'error');
            }
        } catch (error) { showToast('❌ Server error', 'error'); }
        return;
    }

    if (!email || !password) { showToast('❌ Please fill in all fields', 'error'); return; }

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            showToast('✅ Login successful! Welcome ' + data.user.name, 'success');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => { closeModal(); updateNavbar(); updateNavLinks(); }, 1500);
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (error) { showToast('❌ Server error. Make sure backend is running.', 'error'); }
}

// ===== Sign Up =====
async function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const role = document.getElementById('signupRole')?.value || 'user';

    if (!name || !email || !password) { showToast('❌ Please fill in all fields', 'error'); return; }

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (data.success) {
            if (role === 'provider') {
                showToast('✅ Provider Registration successful! Please login and submit NID.', 'success');
            } else {
                showToast('✅ Registration successful! Please login.', 'success');
            }
            setTimeout(() => {
                switchTab('signin');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (error) { showToast('❌ Server error. Make sure backend is running.', 'error'); }
}

// ===== Navbar Auth =====
function updateNavbar() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            navAuth.innerHTML = `
                <span class="user-name">Hi, ${user.name}</span>
                <button class="btn-outline btn-logout" onclick="logout()">Log Out</button>
            `;
        } catch (e) {}
    } else {
        navAuth.innerHTML = `
            <button class="btn-outline" onclick="openModal('signin')">Log In</button>
            <button class="btn-primary" onclick="openModal('signup')">Sign Up</button>
        `;
    }
}

// ===== Navbar Links (Role অনুযায়ী) =====
function updateNavLinks() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const userStr = localStorage.getItem('user');
    let role = 'guest';

    if (userStr) {
        try { role = JSON.parse(userStr).role; } catch (e) {}
    }

    if (role === 'provider') {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="services.html">Services</a>
            <a href="profile.html">Profile</a>
            <a href="provider-dashboard.html">Dashboard</a>
            <a href="contact.html">Contact</a>
        `;
    } else if (role === 'user') {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="services.html">Services</a>
            <a href="my-bookings.html">My Bookings</a>
            <a href="profile.html">Profile</a>
            <a href="contact.html">Contact</a>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="services.html">Services</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        `;
    }
}

// ===== Logout =====
async function logout() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await fetch(`${API}/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {}
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    showToast('✅ Logged out successfully!', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

// ===== Load =====
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateNavLinks();
    setTimeout(forceClearFields, 500);
    setTimeout(forceClearFields, 1000);
});