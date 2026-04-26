let selectedType = 'multiple';
let imageData = null;

// Restore login state
(function () {
  try {
    const user = JSON.parse(localStorage.getItem('mock_user'));
    if (!user) return;
    const navRight = document.getElementById('nav-right');
    if (navRight) {
        navRight.innerHTML = `
          <div class="user-pill" onclick="showLogoutModal()" style="display:flex;align-items:center;gap:8px;padding:5px 14px 5px 5px;border-radius:50px;background:rgba(255,255,255,0.1);cursor:pointer;font-size:14px;font-weight:800;color:#fff;">
            <div class="ava" style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#00d2ff,#0072ff);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;">${user.name[0].toUpperCase()}</div>
            ${user.name}
          </div>`;
    }
  } catch (e) {}
})();

function showLogoutModal() {
  const modal = document.getElementById('logout-modal');
  modal.style.display = 'flex';
  setTimeout(() => modal.style.opacity = '1', 10);
}
function closeLogoutModal() {
  const modal = document.getElementById('logout-modal');
  modal.style.opacity = '0';
  setTimeout(() => modal.style.display = 'none', 200);
}
function confirmLogout() {
  localStorage.removeItem('mock_user');
  window.location.href = '../index.html';
}

function handleImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    imageData = event.target.result;
    document.getElementById('image-preview').src = imageData;
    document.getElementById('image-preview').style.display = 'block';
    document.getElementById('image-preview-text').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function setType(type) {
  selectedType = type;
  document.getElementById('type-multiple').classList.toggle('active', type === 'multiple');
  document.getElementById('type-open').classList.toggle('active', type === 'open');
}

function startCreating() {
  // 1. Check login
  const user = localStorage.getItem('mock_user');
  if (!user) {
    alert('Please log in first to create a quiz!');
    window.location.href = '../auth.html';
    return;
  }

  // 2. Validate inputs
  const name = document.getElementById('quiz-name').value.trim();
  if (!name) { alert('Please enter a quiz name'); return; }
  if (!imageData) { alert('Please upload a quiz image'); return; }
  if (!selectedType) { alert('Please select a quiz type'); return; }

  // Save setup data
  sessionStorage.setItem('setup_quiz_name', name);
  sessionStorage.setItem('setup_quiz_image', imageData);
  sessionStorage.setItem('setup_quiz_type', selectedType);
  
  window.location.href = 'create-question.html';
}
