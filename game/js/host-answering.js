/* ===========================
   js/host-answering.js
   Host Answering Phase Logic
   =========================== */

// ===== CONFIG =====
const TOTAL_TIME = 30;

const mockQuestions = [
  {
    type: 'Multiple Choice',
    text: 'What is this character called?',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    answers: ['Milk Dragon', 'Black Dragon', 'Big Dragon', 'Dragon'],
    correct: 0,
  },
  {
    type: 'Open-ended',
    text: 'What is the capital of Thailand?',
    image: 'https://images.unsplash.com/photo-1504966981333-1ac340945d80?q=80&w=800&auto=format&fit=crop',
    correctAnswer: 'Bangkok'
  }
];

let currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
let totalQ    = mockQuestions.length;
let timeLeft  = TOTAL_TIME;
let timerInterval = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadQuestionData();
  startCountdown();
});

function loadQuestionData() {
  const q = mockQuestions[currentQ];
  if (!q) return;

  // Header
  document.getElementById('hud-type').textContent = q.type;
  document.getElementById('hud-progress').textContent = `${currentQ + 1} / ${totalQ}`;
  
  // Content
  document.getElementById('q-text').textContent = q.text;
  
  const imgEl = document.getElementById('q-image');
  const imgWrap = document.getElementById('q-image-wrap');
  if (q.image) {
    imgEl.src = q.image;
    imgWrap.style.display = 'flex';
  } else {
    imgWrap.style.display = 'none';
  }

  // Answers UI
  const grid = document.getElementById('answers-grid');
  if (q.type === 'Open-ended') {
    if (grid) grid.style.display = 'none';
    // Optionally add a "Waiting for responses..." text
  } else {
    if (grid) {
      grid.style.display = 'grid';
      q.answers.forEach((ans, i) => {
        const card = document.getElementById(`ans-${i}`);
        if (card) card.textContent = ans;
      });
    }
  }
}

function startCountdown() {
  const timerEl = document.getElementById('hud-timer');
  
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `TIME ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      moveToReveal();
    }
  }, 1000);
}

function moveToReveal() {
  localStorage.setItem('host_signal', 'reveal_' + currentQ);
  window.location.href = 'host-reveal.html';
}
