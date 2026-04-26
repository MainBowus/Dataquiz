// ===== EXPLORE PAGE JS =====

// ===== MOCK DATABASE INITIALIZATION =====
const MOCK_QUIZZES = [
  { id: 'q1', title: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop', questions: new Array(10), plays: 1500, label: '🔥 Hot' },
  { id: 'q2', title: 'Sports', image: 'https://images.unsplash.com/photo-1461896704190-321aa1c319e4?q=80&w=800&auto=format&fit=crop', questions: new Array(12), plays: 1200, label: '🎯 Top' },
  { id: 'q3', title: 'Meme', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', questions: new Array(15), plays: 3000, label: '🌟 New' },
  { id: 'q4', title: 'Riddles', image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca13e7?q=80&w=800&auto=format&fit=crop', questions: new Array(8), plays: 800, label: '💡 Daily' }
];

function getQuizzes() {
  const userQuizzes = JSON.parse(localStorage.getItem('my_quizzes') || '[]');
  return [...MOCK_QUIZZES, ...userQuizzes];
}

// ===== CAROUSEL (POPULAR QUIZZES) =====
let popularQuizzes = [];
let current = 0;

function initCarousel() {
  const all = getQuizzes();
  popularQuizzes = all.sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 4);
  updateCard(0);
}

const labelEl = document.querySelector('.quiz-label');
const titleEl = document.querySelector('.quiz-card-inner h3');
const descEl  = document.querySelector('.quiz-card-inner p');
const card    = document.querySelector('.quiz-card-featured');

function updateCard(index) {
  if (!card || popularQuizzes.length === 0) return;
  card.style.opacity = '0';
  setTimeout(() => {
    const q = popularQuizzes[index];
    if (labelEl) labelEl.textContent = q.label || '🔥 Hot';
    if (titleEl) titleEl.textContent = q.title;
    if (descEl) descEl.textContent  = `Played ${q.plays || 0} times`;
    if (card) card.style.backgroundImage = `url('${q.image}')`;
    card.style.opacity = '1';
  }, 180);
}

// Carousel Controls
document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
  current = (current - 1 + popularQuizzes.length) % popularQuizzes.length;
  updateCard(current);
});
document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
  current = (current + 1) % popularQuizzes.length;
  updateCard(current);
});

// ===== DYNAMIC SECTIONS =====
function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function loadDynamicSections() {
  const all = getQuizzes();
  
  // 1. Explore Section (Random 4)
  const exploreGrid = document.querySelector('.categories-grid');
  if (exploreGrid) {
    const randomExplore = shuffle([...all]).slice(0, 4);
    exploreGrid.innerHTML = '';
    randomExplore.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn';
      btn.style.backgroundImage = `url('${q.image}')`;
      btn.textContent = q.title;
      btn.onclick = () => openQuizModal(q);
      exploreGrid.appendChild(btn);
    });
  }

  // 2. Quiz You Might Like (Random 4)
  const recBlocks = document.querySelectorAll('.rec-block');
  const mightLikeGrid = recBlocks[0]?.querySelector('.rec-grid');
  if (mightLikeGrid) {
    const randomLike = shuffle([...all]).slice(0, 4);
    mightLikeGrid.innerHTML = '';
    randomLike.forEach(q => {
      const div = document.createElement('div');
      div.className = 'rec-card';
      div.style.backgroundImage = `url('${q.image}')`;
      div.innerHTML = `<span>${q.title}</span>`;
      div.onclick = () => openQuizModal(q);
      mightLikeGrid.appendChild(div);
    });
  }

  // 3. Play Again (Previously Played Quizzes)
  const playAgainBlock = recBlocks[1];
  if (playAgainBlock) {
    const titleEl = playAgainBlock.querySelector('.rec-title');
    if (titleEl) titleEl.textContent = "Play Again"; // Force Title
    
    const grid = playAgainBlock.querySelector('.rec-grid');
    const playedQuizzes = JSON.parse(localStorage.getItem('played_quizzes') || '[]');
    
    if (playedQuizzes.length > 0) {
      grid.innerHTML = '';
      playedQuizzes.slice(0, 4).forEach(q => {
        const div = document.createElement('div');
        div.className = 'rec-card';
        if (q.image) div.style.backgroundImage = `url('${q.image}')`;
        div.innerHTML = `<span>${q.title}</span>`;
        div.onclick = () => openQuizModal(q);
        grid.appendChild(div);
      });
    } else {
        // Fallback: Random if nothing played yet
        const randomMore = shuffle([...all]).slice(0, 4);
        grid.innerHTML = '';
        randomMore.forEach(q => {
            const div = document.createElement('div');
            div.className = 'rec-card';
            div.style.backgroundImage = `url('${q.image}')`;
            div.innerHTML = `<span>${q.title}</span>`;
            div.onclick = () => openQuizModal(q);
            grid.appendChild(div);
        });
    }
  }
}

// ===== QUIZ MODAL =====
function openQuizModal(quiz) {
  // DISABLE POPUP ON MOBILE
  if (window.innerWidth <= 600) {
    console.log('Mobile view: skipping pop-up');
    return;
  }

  const modal = document.getElementById('quiz-modal');
  if (!modal) return;
  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = quiz.title || 'Quiz';
  const previewEl = document.querySelector('.modal-preview');
  if (previewEl) previewEl.style.backgroundImage = `url('${quiz.image}')`;
  const qNumEl = document.getElementById('modal-q-num');
  
  // Use length if it's an array, otherwise default to 10
  const count = (quiz.questions && Array.isArray(quiz.questions)) ? quiz.questions.length : 10;
  if (qNumEl) qNumEl.textContent = String(count);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
  const modal = document.getElementById('quiz-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  loadDynamicSections();
});

// Navbar logic
(function () {
  const user = JSON.parse(localStorage.getItem('mock_user'));
  if (!user) return;
  const navRight = document.getElementById('nav-right');
  if (navRight) {
    navRight.innerHTML = `
      <div class="user-pill" id="user-pill" onclick="toggleDropdown(event)">
        <div class="ava">${user.name[0].toUpperCase()}</div>
        ${user.name}
        <span class="dropdown-arrow">▼</span>
        <div class="user-dropdown" id="user-dropdown">
          <div class="dropdown-item" onclick="goToProfile()">👤 Profile</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout" onclick="showLogoutModal()">🚪 Log Out</div>
        </div>
      </div>`;
  }
})();

function toggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('user-dropdown')?.classList.toggle('show');
}
window.addEventListener('click', () => document.getElementById('user-dropdown')?.classList.remove('show'));

function goToProfile() { window.location.href = 'profile.html'; }

function showLogoutModal() {
  if (!document.getElementById('logout-modal')) {
    const modal = document.createElement('div');
    modal.id = 'logout-modal';
    modal.style = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px);opacity:0;transition:opacity 0.2s;";
    modal.innerHTML = `
      <div style="background:white;border-radius:24px;padding:40px;width:320px;text-align:center;transform:scale(0.9);transition:transform 0.2s;">
        <h3 style="font-family:'Archivo Black';font-size:22px;margin-bottom:15px;color:#333;">Log out?</h3>
        <p style="font-family:'Nunito';font-weight:600;color:#666;margin-bottom:30px;">Are you sure you want to log out of DataQuiz?</p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button onclick="closeLogoutModal()" style="padding:10px 20px;border-radius:50px;border:none;background:#eee;color:#333;font-family:'Archivo Black';cursor:pointer;">Cancel</button>
          <button onclick="confirmLogout()" style="padding:10px 20px;border-radius:50px;border:none;background:#ff3b5c;color:#fff;font-family:'Archivo Black';cursor:pointer;box-shadow:0 4px 12px rgba(255,59,92,0.3);">Log out</button>
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
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 200);
  }
}
function confirmLogout() { localStorage.removeItem('mock_user'); window.location.href = '../index.html'; }

function toggleHostDropdown() {
  document.getElementById('host-menu').classList.toggle('show');
  document.querySelector('.modal-host-btn').classList.toggle('active');
}
function hostGame(mode) { window.location.href = '../game/host/host-lobby.html?mode=' + mode; }

document.getElementById('quiz-modal')?.addEventListener('click', function(e) { if (e.target === this) closeQuizModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuizModal(); });
