/* ===========================
   js/host-question-display.js
   Host Question Display Logic
   =========================== */

// ===== CONFIG =====
const mockQuestions = [
  {
    type: 'Multiple Choice',
    text: 'What is this character called?',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', // Simulated database image
    answers: ['Paris', 'London', 'Berlin', 'Madrid'],
    correct: 0,
  }
];

let currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
let totalQ    = mockQuestions.length;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadQuestionInfo();
  
  // Start 3 second timer then move to answering page
  setTimeout(() => {
    window.location.href = 'host-answering.html';
  }, 3000);
});

function loadQuestionInfo() {
  const q = mockQuestions[currentQ];
  if (!q) return;

  // Header Info
  const typeEl = document.getElementById('hud-type');
  if (typeEl) typeEl.textContent = q.type;

  const progressEl = document.getElementById('hud-progress');
  if (progressEl) progressEl.textContent = `${currentQ + 1} / ${totalQ}`;

  // Center Content
  const textEl = document.getElementById('q-text');
  if (textEl) textEl.textContent = q.text;

  const imgEl = document.getElementById('q-image');
  const imgWrap = document.getElementById('q-image-wrap');
  
  if (q.image) {
    imgEl.src = q.image;
    imgWrap.style.display = 'flex';
  } else {
    imgWrap.style.display = 'none';
  }
}
