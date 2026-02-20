/* ===========================
   js/host-lobby.js
   Host Lobby Logic
   =========================== */

// ===== CONFIG =====
const GAME_PIN = generatePin();
let totalQuestions = 10;
let currentQuestion = 1;

// Mock players joining (demo — แทนด้วย websocket จริงๆ ได้)
const mockPlayers = [
  'Username','Username','Username','Username',
  'Username','Username','Username','Username',
  'Username','Username','Username','Username',
  'Username','Username','Username','Username',
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('game-pin').textContent   = GAME_PIN;
  document.getElementById('footer-pin').textContent = GAME_PIN;
  updateQuestionInfo();
  drawQR();
  simulatePlayers();
});

// ===== PIN GENERATOR =====
function generatePin() {
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

// ===== QUESTION INFO =====
function updateQuestionInfo() {
  document.getElementById('q-badge').textContent       = `${currentQuestion} of ${totalQuestions}`;
  document.getElementById('footer-q-info').textContent = `Question ${currentQuestion} / ${totalQuestions}`;
}

// ===== DRAW SIMPLE QR PLACEHOLDER =====
function drawQR() {
  const canvas = document.getElementById('qr-canvas');
  const ctx = canvas.getContext('2d');
  const size = 72;
  const cells = 9;
  const cell = size / cells;

  const pattern = [
    [1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,1],
    [0,0,0,1,0,0,0,1,0],
    [1,0,1,0,1,1,1,0,1],
  ];

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  pattern.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        ctx.fillStyle = '#1a0040';
        ctx.fillRect(c * cell, r * cell, cell - 0.5, cell - 0.5);
      }
    });
  });
}

// ===== SIMULATE PLAYERS JOINING =====
function simulatePlayers() {
  const grid = document.getElementById('players-grid');
  grid.innerHTML = '<div class="waiting-text">Waiting for players to join...</div>';

  let i = 0;
  function addNext() {
    if (i === 0) grid.innerHTML = '';
    if (i < mockPlayers.length) {
      const pill = document.createElement('div');
      pill.className = 'player-pill';
      pill.textContent = mockPlayers[i];
      pill.style.animationDelay = `${i * 0.05}s`;
      grid.appendChild(pill);
      i++;
      setTimeout(addNext, 400);
    }
  }
  setTimeout(addNext, 1000);
}

// ===== ADD PLAYER (ใช้กับ websocket จริง) =====
function addPlayer(username) {
  const grid = document.getElementById('players-grid');
  const waiting = grid.querySelector('.waiting-text');
  if (waiting) waiting.remove();

  const pill = document.createElement('div');
  pill.className = 'player-pill';
  pill.textContent = username;
  grid.appendChild(pill);
}

// ===== START GAME =====
function startGame() {
  const btn  = document.getElementById('start-btn');
  const pills = document.querySelectorAll('.player-pill');

  if (pills.length === 0) {
    btn.textContent = '⚠ No players yet!';
    setTimeout(() => { btn.textContent = '▶ Start Game'; }, 2000);
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Starting...';

  // บันทึก PIN และ reset คำถาม
  sessionStorage.setItem('game_pin', GAME_PIN);
  sessionStorage.setItem('current_question', '0');

  setTimeout(() => {
    window.location.href = 'host-question-display.html';
  }, 800);
}