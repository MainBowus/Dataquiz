document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 };
  
  // Update Player HUD
  document.getElementById('display-name').textContent = state.name;
  
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  const progEl = document.getElementById('hud-progress');
  if (progEl) progEl.textContent = `${currentQ + 1} / 10`;

  const statsEl = document.getElementById('hud-stats');
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`;

  // Mock Question Data
  const mockQuestions = [
    { text: 'What is this character called?', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' }
  ];
  const q = mockQuestions[currentQ] || mockQuestions[0];

  document.getElementById('q-text').textContent = q.text;
  const imgEl = document.getElementById('q-image');
  const imgWrap = document.getElementById('q-image-wrap');
  
  if (q.image) {
    imgEl.src = q.image;
    imgWrap.style.display = 'flex';
  } else {
    imgWrap.style.display = 'none';
  }

  // 3 second delay before answering
  setTimeout(() => {
    window.location.href = 'player-answering.html';
  }, 3000);
});
