/* ===========================
   js/host-reveal.js
   Host Reveal Phase Logic
   =========================== */

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

document.addEventListener('DOMContentLoaded', () => {
  loadRevealData();
});

function loadRevealData() {
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
    if (grid) {
      grid.innerHTML = `<div class="answer-card correct" style="grid-column: 1 / -1; width: 100%; text-align: center;">Correct Answer: ${q.correctAnswer}</div>`;
      grid.style.display = 'grid';
    }
  } else {
    if (grid) {
      grid.style.display = 'grid';
      q.answers.forEach((ans, i) => {
        const card = document.getElementById(`ans-${i}`);
        if (card) {
          card.textContent = ans;
          if (i === q.correct) {
            card.classList.add('correct');
          } else {
            card.classList.remove('correct');
          }
        }
      });
    }
  }
}

function goNext() {
  window.location.href = 'host-scoreboard.html';
}
