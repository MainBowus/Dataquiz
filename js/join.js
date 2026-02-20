// =====================
// js/join.js
// Join page logic
// =====================

/* ---- Navbar auth state ---- */
(function () {
  try {
    const user = JSON.parse(localStorage.getItem('mock_user'));
    if (!user) return;
    document.getElementById('nav-right').innerHTML = `
      <div class="user-pill" onclick="logout()">
        <div class="ava">${user.name[0].toUpperCase()}</div>
        ${user.name}
      </div>`;
  } catch (e) {}
})();

function logout() {
  localStorage.removeItem('mock_user');
  location.reload();
}

/* ---- Auto-fill PIN from URL ---- */
const urlPin = new URLSearchParams(window.location.search).get('pin');
if (urlPin) {
  document.getElementById('pin-input').value = urlPin;
}

/* ---- Step 1: Check PIN ---- */
function checkPin() {
  const input = document.getElementById('pin-input');
  const pin   = input.value.trim();

  if (pin.length < 4) {
    showToast('Please enter a valid PIN');
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 450);
    return;
  }

  // Mock: PIN ไหนก็ได้ที่ 4-6 หลัก
  sessionStorage.setItem('join_pin', pin);

  // Switch to step 2
  document.getElementById('step-pin').style.display  = 'none';
  document.getElementById('step-name').style.display = 'block';

  // Re-trigger animation
  const card = document.getElementById('step-name');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';

  setTimeout(() => document.getElementById('name-input').focus(), 100);
}

/* ---- Step 2: Join game ---- */
function joinGame() {
  const input = document.getElementById('name-input');
  const name  = input.value.trim();

  if (!name) {
    showToast('Please enter a nickname');
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 450);
    return;
  }

  const pin = sessionStorage.getItem('join_pin') || '';
  sessionStorage.setItem('player_state', JSON.stringify({ name, pin }));
  window.location.href = '../game/player/player.html';
}

/* ---- Back to PIN ---- */
function goBack() {
  document.getElementById('step-name').style.display = 'none';
  document.getElementById('step-pin').style.display  = 'block';

  const card = document.getElementById('step-pin');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';
}

/* ---- Toast ---- */
function showToast(msg, duration = 2400) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}