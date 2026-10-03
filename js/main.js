const API = 'https://fixmate-backend-jhlp.onrender.com/api';

// ===== Open/Close Modal =====
function openModal(tab) {
    document.getElementById('authModal').classList.add('active');
    switchTab(tab);
    const msg = document.getElementById('modalMessage');
    msg.className = 'message-box';
    msg.textContent = '';
}

function closeModal() {
    document.getElementById('authModal').classList.remove('active');
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

    const msg = document.getElementById('modalMessage');
    msg.className = 'message-box';
    msg.textContent = '';
}

function showMessage(text, type) {
    const box = document.getElementById('modalMessage');
    box.textContent = text;
    box.className = 'message-box ' + type;
}

// ===== Sign In =====
async function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            showMessage('✅ Login successful! Welcome ' + data.user.name, 'success');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => closeModal(), 1500);
        } else {
            showMessage('❌ ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('❌ Server error. Make sure backend is running.', 'error');
    }
}

// ===== Sign Up =====
async function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (data.success) {
            showMessage('✅ Registration successful! Please check your email to verify.', 'success');
            setTimeout(() => {
                switchTab('signin');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else {
            showMessage('❌ ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('❌ Server error. Make sure backend is running.', 'error');
    }
}