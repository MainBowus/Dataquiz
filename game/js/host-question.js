/* ===========================
   js/host-question.js
   Host Question Screen Logic
   =========================== */

// ===== MOCK DATA (แทนด้วย API/WebSocket จริงๆ ได้) =====
const GAME_PIN = sessionStorage.getItem('game_pin') || '0000000';
const QUESTION_TIME = 20; // วินาที

const mockQuestions = [
  {
    type: 'Multiple Choice',
    text: 'What is the capital of France?',
    image: null,
    answers: ['Paris', 'London', 'Berlin', 'Madrid'],
    correct: 0,
  },
  {
    type: 'Multiple Choice',
    text: 'Which planet is known as the Red Planet?',
    image: null,
    answers: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    correct: 2,
  },
  {
    type: 'Multiple Choice',
    text: 'What is 7 × 8?',
    image: null,
    answers: ['54', '56', '58', '64'],
    correct: 1,
  },
];

let currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
let totalQ    = mockQuestions.length;
let timerInterval = null;
let timeLeft = QUESTION_TIME;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footer-pin').textContent = GAME_PIN;
  updateFooter();
  startGetReady();
});

// ===== GET READY COUNTDOWN =====
function startGetReady() {
  const q = mockQuestions[currentQ];

  // Update badges
  document.getElementById('badge-type').textContent     = q.type;
  document.getElementById('badge-progress').textContent = `${currentQ + 1} of ${totalQ}`;
  document.getElementById('gr-number').textContent      = currentQ + 1;

  let count = 3;
  const countEl = document.getElementById('gr-countdown');
  countEl.textContent = count;
  triggerTick(countEl);

  const interval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(interval);
      showQuestion();
    } else {
      countEl.textContent = count;
      triggerTick(countEl);
    }
  }, 1000);
}

function triggerTick(el) {
  el.classList.remove('tick');
  void el.offsetWidth; // reflow
  el.classList.add('tick');
}

// ===== SHOW QUESTION =====
function showQuestion() {
  const q = mockQuestions[currentQ];

  // Switch screens
  document.getElementById('screen-getready').classList.add('hidden');
  document.getElementById('screen-question').classList.remove('hidden');

  // Fill content
  document.getElementById('q-text').textContent = q.text;

  // Image
  if (q.image) {
    document.getElementById('q-image').src = q.image;
    document.getElementById('q-image-wrap').style.display = 'block';
  }

  // Answers
  q.answers.forEach((ans, i) => {
    document.getElementById(`ans-text-${i}`).textContent = ans;
  });

  // Start timer
  startTimer();
}

// ===== TIMER =====
function startTimer() {
  timeLeft = QUESTION_TIME;
  const bar = document.getElementById('timer-bar');
  bar.style.width = '100%';
  bar.classList.remove('warning');

  timerInterval = setInterval(() => {
    timeLeft--;
    const pct = (timeLeft / QUESTION_TIME) * 100;
    bar.style.width = pct + '%';

    if (pct <= 30) bar.classList.add('warning');

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function timeUp() {
  // แสดง correct answer
  const q = mockQuestions[currentQ];
  const cards = document.querySelectorAll('.ans-card');
  cards.forEach((card, i) => {
    if (i === q.correct) {
      card.style.outline = '4px solid #fff';
      card.style.boxShadow = '0 0 24px rgba(255,255,255,0.6)';
    } else {
      card.style.opacity = '0.4';
    }
  });

  // ไปคำถามถัดไปหลัง 2 วินาที
  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

// ===== NEXT QUESTION =====
function nextQuestion() {
  currentQ++;

  if (currentQ >= totalQ) {
    // จบเกม
    sessionStorage.removeItem('current_question');
    window.location.href = 'host-results.html';
    return;
  }

  sessionStorage.setItem('current_question', currentQ);

  // Reset UI แล้วกลับไปหน้า get ready
  document.getElementById('screen-question').classList.add('hidden');
  document.getElementById('screen-getready').classList.remove('hidden');

  // Reset answer cards
  document.querySelectorAll('.ans-card').forEach(card => {
    card.style.opacity = '1';
    card.style.outline = '';
    card.style.boxShadow = '';
  });

  document.getElementById('q-image-wrap').style.display = 'none';

  updateFooter();
  startGetReady();
}

// ===== FOOTER =====
function updateFooter() {
  document.getElementById('footer-q-info').textContent =
    `Question ${currentQ + 1} / ${totalQ}`;
}