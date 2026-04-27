/* ===========================
   js/host-lobby.js
   Host Lobby Logic - Real-time Joining
   =========================== */

const GAME_PIN = generatePin();

document.addEventListener('DOMContentLoaded', () => {
  // Reset lobby data for a fresh start
  localStorage.setItem('lobby_players', '[]');
  localStorage.setItem('player_scores', '{}');
  localStorage.setItem('game_active_status', 'false');
  localStorage.setItem('current_game_pin', GAME_PIN);

  document.getElementById('game-pin').textContent = GAME_PIN;
  
  const savedTitle = sessionStorage.getItem('setup_quiz_name') || 'NAME QUIZ';
  document.getElementById('display-quiz-title').textContent = savedTitle.toUpperCase();

  generateFunctionalQR();
  listenForPlayers();
});

function generatePin() {
  // Generate a random 6-digit PIN
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateFunctionalQR() {
  const qrContainer = document.getElementById('qrcode');
  if (!qrContainer) return;
  qrContainer.innerHTML = '';
  
  // Use the current window location to build the join URL
  // This ensures the QR code works on whichever environment the app is running
  const currentUrl = window.location.href; // e.g., .../game/host/host-lobby.html
  const baseUrl = currentUrl.split('/game/host/')[0];
  const joinUrl = `${baseUrl}/dashboard/join.html?pin=${GAME_PIN}`;
  
  console.log("Generating QR for:", joinUrl);

  new QRCode(qrContainer, {
    text: joinUrl,
    width: 140, // Slightly larger for better scanning
    height: 140,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
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
  // Check for new players every second
  setInterval(updatePlayerList, 1000);
}

function startGame() {
  const players = JSON.parse(localStorage.getItem('lobby_players') || '[]');
  if (players.length === 0) {
    alert("Please wait for at least one player to join!");
    return;
  }

  const btn = document.getElementById('start-btn');
  btn.disabled = true;
  btn.textContent = 'Starting...';
  
  sessionStorage.setItem('game_pin', GAME_PIN);
  sessionStorage.setItem('current_question', '0');
  
  // Signal players that game started
  localStorage.setItem('game_active_status', 'true');
  localStorage.setItem('host_signal', 'question_0');
  
  setTimeout(() => { window.location.href = 'host-question.html'; }, 800);
}
