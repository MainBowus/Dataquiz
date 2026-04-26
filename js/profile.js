document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('mock_user'));
  if (!user) { window.location.href = '../auth.html'; return; }

  // Fill info
  document.getElementById('p-name').textContent = user.name;
  document.getElementById('p-email-top').textContent = user.email;
  document.getElementById('p-email').textContent = user.email;
  document.getElementById('p-ava').textContent = user.name[0].toUpperCase();

  // Navbar
  const navRight = document.getElementById('nav-right');
  if (navRight) {
    navRight.innerHTML = `
      <div class="user-pill" onclick="toggleDropdown(event)">
        <div class="ava">${user.name[0].toUpperCase()}</div>
        ${user.name} <span style="font-size:10px; margin-left:5px;">▼</span>
        <div class="user-dropdown" id="user-dropdown" style="position:absolute; top:100%; right:0; background:#1c2c43; border:1px solid rgba(255,255,255,0.2); border-radius:15px; display:none; flex-direction:column; min-width:150px; margin-top:10px; overflow:hidden;">
          <div class="dropdown-item" onclick="location.reload()" style="padding:12px 20px; cursor:pointer;">👤 Profile</div>
          <div class="dropdown-item" onclick="showLogoutModal()" style="padding:12px 20px; cursor:pointer; color:#ff4757;">🚪 Log Out</div>
        </div>
      </div>`;
  }

  // Load Quizzes
  const grid = document.getElementById('my-quizzes-grid');
  if (grid) {
    const myQuizzes = JSON.parse(localStorage.getItem('my_quizzes') || '[]');
    if (myQuizzes.length === 0) {
      grid.innerHTML = '<p style="opacity:0.5; grid-column: span 4; text-align:center; padding:40px;">You haven\'t created any quizzes yet.</p>';
    } else {
      myQuizzes.forEach(q => {
        const div = document.createElement('div');
        div.className = 'rec-card';
        if (q.image) div.style.backgroundImage = `url('${q.image}')`;
        div.innerHTML = `<span>${q.title}</span>`;
        grid.appendChild(div);
      });
    }
  }
});

function toggleDropdown(e) {
  e.stopPropagation();
  const d = document.getElementById('user-dropdown');
  if (d) {
    d.style.display = d.style.display === 'flex' ? 'none' : 'flex';
  }
}
window.onclick = () => {
    const d = document.getElementById('user-dropdown');
    if (d) d.style.display = 'none';
};

function showLogoutModal() {
  if (!document.getElementById('logout-modal')) {
    const modal = document.createElement('div');
    modal.id = 'logout-modal';
    modal.style = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px);opacity:0;transition:opacity 0.2s;";
    modal.innerHTML = `
      <div style="background:white;border-radius:24px;padding:40px;width:320px;text-align:center;transform:scale(0.9);transition:transform 0.2s;">
        <h3 style="font-family:'Archivo Black';font-size:22px;margin-bottom:15px;color:#333;">Log out?</h3>
        <p style="font-family:'Nunito';font-weight:600;color:#666;margin-bottom:30px;">Are you sure you want to log out?</p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button onclick="closeLogoutModal()" style="padding:10px 20px;border-radius:50px;border:none;background:#eee;color:#333;font-family:'Archivo Black';cursor:pointer;">Cancel</button>
          <button onclick="confirmLogout()" style="padding:10px 20px;border-radius:50px;border:none;background:#ff3b5c;color:#fff;font-family:'Archivo Black';cursor:pointer;">Log out</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const modal = document.getElementById('logout-modal');
  modal.style.display = 'flex';
  setTimeout(() => { modal.style.opacity = '1'; modal.firstElementChild.style.transform = 'scale(1)'; }, 10);
  document.body.style.overflow = 'hidden';
}

function closeLogoutModal() {
  const modal = document.getElementById('logout-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.firstElementChild.style.transform = 'scale(0.9)';
    setTimeout(() => { modal.style.display = 'none'; document.body.style.overflow = ''; }, 200);
  }
}
function confirmLogout() { localStorage.removeItem('mock_user'); window.location.href = '../index.html'; }
