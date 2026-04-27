/* ===========================
   js/host-scoreboard.js
   Scoreboard Logic - Live Tracking
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // Set progress (mock)
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  const progEl = document.getElementById('hud-progress');
  if (progEl) progEl.textContent = `${currentQ + 1} / 10`;

  buildScoreboard();
  
  // Refresh live (optional, if players finish at different times)
  setInterval(buildScoreboard, 2000);
});

function buildScoreboard() {
  const container = document.getElementById('sb-list');
  if (!container) return;

  // Read live scores from localStorage
  const scoresData = JSON.parse(localStorage.getItem('player_scores') || '{}');
  
  // Convert to array and sort
  const sorted = Object.entries(scoresData)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

  // Take only top 4
  const top4 = sorted.slice(0, 4);

  container.innerHTML = '';

  top4.forEach((player, index) => {
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

  if (top4.length === 0) {
    container.innerHTML = '<div style="text-align:center; font-size:24px; margin-top:50px;">Waiting for players to finish...</div>';
  }
}

function goNext() {
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  const totalQ = 2; // Match the mock questions length
  const nextQ = currentQ + 1;
  
  if (nextQ >= totalQ) {
    localStorage.setItem('host_signal', 'game_finished');
    window.location.href = 'host-final.html';
  } else {
    sessionStorage.setItem('current_question', nextQ);
    localStorage.setItem('host_signal', 'question_' + nextQ);
    window.location.href = 'host-question.html';
  }
}
