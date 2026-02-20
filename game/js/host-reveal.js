/* ===========================
   js/host-reveal.js
   Answer Reveal Logic
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  const q      = getQ();
  const counts = getMockCounts(q);

  setBadges();
  setFooter();

  document.getElementById('q-text-bar').textContent = q.text;

  buildRevealList(q, counts);
});

// ===== MOCK COUNTS =====
function getMockCounts(q) {
  return q.answers.map((_, i) => {
    if (i === q.correct) return Math.floor(Math.random() * 6) + 3;
    return Math.floor(Math.random() * 3);
  });
}

// ===== BUILD REVEAL LIST =====
const ICONS   = ['▲', '◆', '●', '■'];
const CLASSES = ['ans-cyan', 'ans-red', 'ans-purple', 'ans-yellow'];

function buildRevealList(q, counts) {
  const list     = document.getElementById('reveal-list');
  const total    = counts.reduce((a, b) => a + b, 0) || 1;

  const order = q.answers
    .map((text, i) => ({ text, i, count: counts[i] }))
    .sort((a, b) => {
      if (a.i === q.correct) return -1;
      if (b.i === q.correct) return 1;
      return b.count - a.count;
    });

  list.innerHTML = '';

  order.forEach(({ text, i, count }) => {
    const isCorrect = i === q.correct;
    const pct       = Math.round((count / total) * 100);

    const row = document.createElement('div');
    row.className = `reveal-row ${CLASSES[i]} ${isCorrect ? 'correct' : 'wrong'}`;
    row.innerHTML = `
      <div class="reveal-main" style="position:relative;">
        <div class="reveal-bar-fill" style="width:${pct}%"></div>
        <span class="reveal-icon">${ICONS[i]}</span>
        <span class="reveal-text">${text}</span>
        ${isCorrect ? '<span class="reveal-crown">👑</span>' : ''}
      </div>
      <div class="reveal-count">${count}</div>
    `;
    list.appendChild(row);
  });
}

// ===== NEXT → ไป Scoreboard =====
function goNext() {
  window.location.href = 'host-scoreboard.html';
}