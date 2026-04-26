/* ===========================
   js/host-scoreboard.js
   Scoreboard Logic - Redesign
   =========================== */

const mockScores = [
  { name: 'Username', score: 980 },
  { name: 'Username', score: 850 },
  { name: 'Username', score: 720 },
  { name: 'Username', score: 610 },
];

document.addEventListener('DOMContentLoaded', () => {
  // Set progress (mock)
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  const progEl = document.getElementById('hud-progress');
  if (progEl) progEl.textContent = `${currentQ + 1} / 10`;

  buildScoreboard();
});

function buildScoreboard() {
  const container = document.getElementById('sb-list');
  if (!container) return;

  const sorted = [...mockScores].sort((a, b) => b.score - a.score);
  container.innerHTML = '';

  sorted.forEach((player, index) => {
    const rank = index + 1;
    const isFirst = (rank === 1);
    
    const card = document.createElement('div');
    card.className = `sb-card ${isFirst ? 'first' : ''}`;
    
    card.innerHTML = `
      <div class="sb-rank-num">${rank}</div>
      <div class="sb-username">${player.name}</div>
      <div class="sb-score-group">
        <span class="sb-score-label">Score</span>
        <div class="sb-score-val">${player.score}</div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function goNext() {
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  sessionStorage.setItem('current_question', currentQ + 1);
  
  // Back to countdown for next question
  window.location.href = 'host-question.html';
}
