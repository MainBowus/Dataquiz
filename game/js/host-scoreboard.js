/* ===========================
   js/host-scoreboard.js
   Scoreboard Logic
   =========================== */

// Mock scoreboard data (แทนด้วย server data จริงๆ ได้)
const mockScores = [
  { name: 'Username', score: 980, delta: +980 },
  { name: 'Username', score: 850, delta: +850 },
  { name: 'Username', score: 720, delta: +720 },
  { name: 'Username', score: 610, delta: +610 },
  { name: 'Username', score: 500, delta: +500 },
];

document.addEventListener('DOMContentLoaded', () => {
  setBadges();
  setFooter();
  buildScoreboard();
});

function buildScoreboard() {
  const list    = document.getElementById('sb-list');
  const sorted  = [...mockScores].sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 1;

  list.innerHTML = '';

  sorted.forEach((player, index) => {
    const rank    = index + 1;
    const pct     = Math.round((player.score / maxScore) * 100);
    const rankCls = rank <= 3 ? `rank-${rank}` : '';
    const medal   = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    const initial = player.name.charAt(0).toUpperCase();
    const delta   = player.delta > 0 ? `+${player.delta}` : player.delta;

    const row = document.createElement('div');
    row.className = 'sb-row';
    row.innerHTML = `
      <div class="sb-rank ${rankCls}">${medal}</div>
      <div class="sb-ava">${initial}</div>
      <div class="sb-name">${player.name}</div>
      <div class="sb-bar-wrap">
        <div class="sb-bar" data-pct="${pct}"></div>
      </div>
      <div class="sb-score">${player.score}</div>
      <div class="sb-delta">${delta}</div>
    `;
    list.appendChild(row);
  });

  // Animate bars after DOM renders
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.sb-bar').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    });
  });
}

// ===== NEXT =====
function goNext() {
  goNextQuestion();  // from host-ingame.js
}