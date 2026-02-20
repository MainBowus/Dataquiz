// =====================
// js/index.js
// Landing page logic
// =====================

/* ---- Restore navbar based on login state ---- */
(function () {
  try {
    const user = JSON.parse(localStorage.getItem('mock_user'));
    if (!user) return;

    // ถ้า login แล้ว ให้เปลี่ยนส่วนขวาเป็น user pill
    document.getElementById('nav-right').innerHTML = `
      <div class="user-pill" onclick="logout()">
        <div class="ava">${user.name[0].toUpperCase()}</div>
        ${user.name}
      </div>`;
  } catch (e) {}
})();

/* ---- Logout ---- */
function logout() {
  localStorage.removeItem('mock_user');
  location.reload();
}

/* ---- Join game ---- */
function doJoin() {
  const input = document.getElementById('pin-input');
  const pin   = input.value.trim();

  if (pin.length < 4) {
    showToast('Please enter a valid PIN 🎮');
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 450);
    return;
  }

  window.location.href = 'dashboard/join.html?pin=' + pin;
}

/* ---- Toast ---- */
function showToast(msg, duration = 2600) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}