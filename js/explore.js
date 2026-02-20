// ===== EXPLORE PAGE JS =====

// ===== CAROUSEL =====
const quizzes = [
  { label: "🔥 Hot",   title: "Science & Nature",  desc: "Test your knowledge!" },
  { label: "🌟 New",   title: "World History",      desc: "How well do you know?" },
  { label: "🎯 Top",   title: "Pop Culture 2024",   desc: "Are you up to date?" },
  { label: "💡 Daily", title: "General Knowledge",  desc: "Brain workout time!" },
];

let current = 0;

const labelEl = document.querySelector('.quiz-label');
const titleEl = document.querySelector('.quiz-card-inner h3');
const descEl  = document.querySelector('.quiz-card-inner p');
const card    = document.querySelector('.quiz-card-featured');

card.style.transition = 'opacity 0.18s, transform 0.18s';

function updateCard(index) {
  card.style.opacity = '0';
  card.style.transform = 'scale(0.97)';
  setTimeout(() => {
    const q = quizzes[index];
    labelEl.textContent = q.label;
    titleEl.textContent = q.title;
    descEl.textContent  = q.desc;
    card.style.opacity   = '1';
    card.style.transform = 'translateY(-4px)';
  }, 180);
}

document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
  current = (current - 1 + quizzes.length) % quizzes.length;
  updateCard(current);
});
document.querySelector('.carousel-btn.next').addEventListener('click', () => {
  current = (current + 1) % quizzes.length;
  updateCard(current);
});

setInterval(() => {
  current = (current + 1) % quizzes.length;
  updateCard(current);
}, 4000);

// ===== QUIZ MODAL =====
function openQuizModal(quiz) {
  document.getElementById('modal-emoji').textContent = quiz.emoji || '📝';
  document.getElementById('modal-title').textContent = quiz.title || 'Quiz';
  document.getElementById('modal-q-num').textContent =
    String(quiz.questionCount || 0).padStart(2, '0');

  document.getElementById('quiz-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
  document.getElementById('quiz-modal').classList.remove('active');
  document.body.style.overflow = '';
}

// คลิก overlay ด้านนอก modal-box → ปิด
document.getElementById('quiz-modal').addEventListener('click', function(e) {
  if (e.target === this) closeQuizModal();
});

// Escape → ปิด
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuizModal();
});

function hostGame() {
  // TODO: navigate to host page พร้อม quiz id
  window.location.href = '../game/host/host-lobby.html';
}ห