/* ===========================
   js/host-lobby.js
   Host Lobby Logic - Restored V1
   =========================== */

const GAME_PIN = generatePin();

document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('lobby_players', '[]');
  localStorage.setItem('current_game_pin', GAME_PIN);

  document.getElementById('game-pin').textContent = GAME_PIN;
  
  const savedTitle = sessionStorage.getItem('setup_quiz_name') || 'NAME QUIZ';
  document.getElementById('display-quiz-title').textContent = savedTitle.toUpperCase();

  generateFunctionalQR();
  listenForPlayers();
  simulatePlayers(); // Keep simulation for now as requested earlier
});

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateFunctionalQR() {
  const qrContainer = document.getElementById('qrcode');
  if (!qrContainer) return;
  qrContainer.innerHTML = '';
  
  const baseUrl = window.location.origin;
  const joinUrl = `${baseUrl}/dashboard/join.html?pin=${GAME_PIN}`;
  
  new QRCode(qrContainer, {
    text: joinUrl,
    width: 100,
    height: 100,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
}

function simulatePlayers() {
  const mockNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'];
  let i = 0;
  function addNext() {
    if (i < mockNames.length) {
      const players = JSON.parse(localStorage.getItem('lobby_players') || '[]');
      if (!players.includes(mockNames[i])) {
        players.push(mockNames[i]);
        localStorage.setItem('lobby_players', JSON.stringify(players));
      }
      i++;
      setTimeout(addNext, 1500);
    }
  }
  setTimeout(addNext, 2000);
}

function listenForPlayers() {
  const grid = document.getElementById('players-grid');
  const waiting = document.getElementById('waiting-section');

  function updatePlayerList() {
    const players = JSON.parse(localStorage.getItem('lobby_players') || '[]');
    if (players.length > 0) {
      waiting.style.display = 'none';
      grid.style.display = 'grid';
      grid.innerHTML = '';
      players.forEach(name => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.textContent = name;
        grid.appendChild(card);
      });
    } else {
      waiting.style.display = 'block';
      grid.style.display = 'none';
    }
  }
  setInterval(updatePlayerList, 1000);
}

function startGame() {
  const btn = document.getElementById('start-btn');
  btn.disabled = true;
  btn.textContent = 'Starting...';
  sessionStorage.setItem('game_pin', GAME_PIN);
  sessionStorage.setItem('current_question', '0');
  setTimeout(() => { window.location.href = 'host-question.html'; }, 800);
}
