// =====================
// js/auth.js
// Auth page logic
// =====================

/* ---- Switch Tabs ---- */
function switchTab(tab) {
  // Update buttons
  document.getElementById('tab-signup').classList.remove('active');
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-' + tab).classList.add('active');

  // Update forms
  if (tab === 'signup') {
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('form-signup').style.display = 'block';
  } else {
    document.getElementById('form-signup').style.display = 'none';
    document.getElementById('form-login').style.display = 'block';
  }
}

/* ---- Toggle Password Visibility ---- */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<s>👁</s>'; // Simple crossed eye or similar text
  } else {
    input.type = 'password';
    btn.innerHTML = '👁';
  }
}

/* ---- Handle Login ---- */
function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();

  if (!email || !pass) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Determine where to redirect
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect') || 'dashboard/explore.html';

  // Mock successful login
  localStorage.setItem('mock_user', JSON.stringify({ name: email.split('@')[0], email: email }));
  showToast('Login successful! Redirecting...', 'success');
  
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 1000);
}

/* ---- Handle Signup ---- */
function handleSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value.trim();

  if (!name || !email || !pass) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Determine where to redirect
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect') || 'dashboard/explore.html';

  // Mock successful signup
  localStorage.setItem('mock_user', JSON.stringify({ name: name, email: email }));
  showToast('Account created successfully!', 'success');
  
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 1000);
}

/* ---- Handle Google Auth (Realistic Simulation) ---- */
function handleGoogle() {
  // ... popup logic ...
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect') || 'dashboard/explore.html';
  // ... rest of code (I will use replace more precisely)
  // Create a overlay for the "Google Popup"
  const overlay = document.createElement('div');
  overlay.style = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif;";
  
  const popup = document.createElement('div');
  popup.style = "background:white;width:360px;padding:30px;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.3);text-align:center;animation:cardIn 0.3s ease-out;";
  
  popup.innerHTML = `
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="40" style="margin-bottom:15px;">
    <h2 style="font-size:20px;margin-bottom:5px;color:#333;">Sign in with Google</h2>
    <p style="font-size:14px;color:#666;margin-bottom:20px;">to continue to QuizDATA</p>
    
    <div style="text-align:left;border:1px solid #ddd;border-radius:4px;overflow:hidden;margin-bottom:20px;">
      <div id="mock-acc" style="padding:12px;display:flex;align-items:center;gap:12px;cursor:pointer;background:#fff;transition:background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">
        <div style="width:32px;height:32px;background:#4285F4;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;">G</div>
        <div>
          <div style="font-size:14px;font-weight:bold;color:#333;">Google User</div>
          <div style="font-size:12px;color:#666;">user@gmail.com</div>
        </div>
      </div>
      <div style="padding:12px;border-top:1px solid #ddd;font-size:14px;color:#4285F4;cursor:pointer;font-weight:600;">Use another account</div>
    </div>
    
    <p style="font-size:12px;color:#888;line-height:1.4;">To continue, Google will share your name, email address, language preference, and profile picture with QuizDATA.</p>
  `;
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // When clicking the mock account
  document.getElementById('mock-acc').onclick = () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(overlay);
      localStorage.setItem('mock_user', JSON.stringify({ name: 'Google User', email: 'user@gmail.com' }));
      showToast('Successfully signed in with Google!', 'success');
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 800);
    }, 200);
  };

  // Close popup if clicking overlay
  overlay.onclick = (e) => {
    if (e.target === overlay) document.body.removeChild(overlay);
  };
}

/* ---- Toast Notification ---- */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast ' + type; // Reset and apply type
  
  // Force reflow
  void toast.offsetWidth;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initial initialization if user is already logged in
window.onload = function() {
  const user = JSON.parse(localStorage.getItem('mock_user'));
  if (user) {
    window.location.href = 'dashboard/explore.html';
  }
};