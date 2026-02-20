/* ===========================
   js/host-ingame.js
   Shared logic for host in-game screens
   =========================== */

// ===== MOCK DATA =====
const GAME_PIN = sessionStorage.getItem('game_pin') || '0000000';
const QUESTION_TIME = 20;

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
  {
    type: 'Multiple Choice',
    text: 'Who painted the Mona Lisa?',
    image: null,
    answers: ['Van Gogh', 'Da Vinci', 'Picasso', 'Rembrandt'],
    correct: 1,
  },
  {
    type: 'Multiple Choice',
    text: 'What is the largest ocean on Earth?',
    image: null,
    answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct: 3,
  },
];

let currentQ   = parseInt(sessionStorage.getItem('current_question') || '0');
let totalQ     = mockQuestions.length;
let timerInt   = null;
let timeLeft   = QUESTION_TIME;
let answered   = false;

// ===== HELPERS =====
function getQ() { return mockQuestions[currentQ]; }

function setFooter() {
  const el = document.getElementById('footer-q-info');
  const pin = document.getElementById('footer-pin');
  if (el)  el.textContent  = `Question ${currentQ + 1} / ${totalQ}`;
  if (pin) pin.textContent = GAME_PIN;
}

function setBadges() {
  const q = getQ();
  const type = document.getElementById('badge-type');
  const prog = document.getElementById('badge-progress');
  if (type) type.textContent = q.type;
  if (prog) prog.textContent = `${currentQ + 1} of ${totalQ}`;
}

// ===== SKIP =====
function skipQuestion() {
  clearInterval(timerInt);
  goNextQuestion();
}

function goNextQuestion() {
  currentQ++;
  if (currentQ >= totalQ) {
    sessionStorage.removeItem('current_question');
    window.location.href = 'host-final.html';
    return;
  }
  sessionStorage.setItem('current_question', currentQ);
  // Go back to question display phase
  window.location.href = 'host-question-display.html';
}

// ===== QUESTION DISPLAY PAGE =====
function initQuestionDisplay() {
  const q = getQ();
  setFooter();
  setBadges();

  const bubble = document.getElementById('q-bubble');
  const bar    = document.getElementById('q-text-bar');
  if (bubble) bubble.textContent = `Question ${currentQ + 1}!`;
  if (bar)    bar.textContent    = q.text;

  // Auto advance to answering after 3s
  setTimeout(() => {
    window.location.href = 'host-answering.html';
  }, 3000);
}

// ===== ANSWERING PAGE =====
function initAnswering() {
  const q = getQ();
  setFooter();
  setBadges();
  answered = false;

  // Question text
  const bar = document.getElementById('q-text-bar');
  if (bar) bar.textContent = q.text;

  // Image
  const imgArea = document.getElementById('ans-image-area');
  if (imgArea) {
    if (q.image) {
      imgArea.innerHTML = `<img src="${q.image}" alt="question image"/>`;
    } else {
      imgArea.classList.add('empty');
    }
  }

  // Answer texts
  q.answers.forEach((ans, i) => {
    const el = document.getElementById(`ans-text-${i}`);
    if (el) el.textContent = ans;
  });

  startTimer();
}

function startTimer() {
  timeLeft = QUESTION_TIME;
  const circle = document.getElementById('timer-circle');
  if (circle) circle.textContent = timeLeft;

  timerInt = setInterval(() => {
    timeLeft--;
    if (circle) {
      circle.textContent = timeLeft;
      if (timeLeft <= 5) circle.classList.add('warning');
    }
    if (timeLeft <= 0) {
      clearInterval(timerInt);
      revealAnswer();
    }
  }, 1000);
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timerInt);

  const q = getQ();
  const cards = document.querySelectorAll('.ans-choice');
  cards.forEach((card, i) => {
    if (i === q.correct) {
      card.classList.add('correct');
    } else {
      card.classList.add('wrong');
    }
  });

  // Highlight selected
  if (cards[index]) cards[index].classList.add('selected');

  setTimeout(() => { window.location.href = 'host-reveal.html'; }, 2000);
}

function revealAnswer() {
  if (answered) return;
  answered = true;

  const q = getQ();
  const cards = document.querySelectorAll('.ans-choice');
  cards.forEach((card, i) => {
    if (i === q.correct) card.classList.add('correct');
    else card.classList.add('wrong');
  });

  setTimeout(() => { window.location.href = 'host-reveal.html'; }, 2500);
}