document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 };
  
  // HUD
  document.getElementById('display-name').textContent = state.name;
  
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  const progEl = document.getElementById('hud-progress');
  if (progEl) progEl.textContent = `${currentQ + 1} / 10`;

  const statsEl = document.getElementById('hud-stats');
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`;

  // Mock Data
  const mockQuestions = [
    { 
      text: 'What is this character called?', 
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
      answers: ['Milk Dragon', 'Black Dragon', 'Big Dragon', 'Dragon']
    }
  ];
  const q = mockQuestions[currentQ] || mockQuestions[0];

  document.getElementById('q-text').textContent = q.text;
  if (q.image) {
    document.getElementById('q-image').src = q.image;
  } else {
    document.getElementById('q-image-wrap').style.display = 'none';
  }

  // Populate answer buttons
  q.answers.forEach((ans, i) => {
    const btn = document.getElementById(`ans-${i}`);
    if (btn) btn.textContent = ans;
  });

  // Countdown timer simulation
  let time = 30;
  const timerEl = document.getElementById('hud-timer');
  const interval = setInterval(() => {
    time--;
    if (timerEl) timerEl.textContent = `TIME ${time}`;
    if (time <= 0) {
      clearInterval(interval);
      window.location.href = 'player-waiting-ans.html';
    }
  }, 1000);
});

function submitAnswer(index) {
  sessionStorage.setItem('last_answer', index);
  window.location.href = 'player-waiting-ans.html';
}
