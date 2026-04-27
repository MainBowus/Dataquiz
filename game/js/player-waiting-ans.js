document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 };
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  
  // HUD
  document.getElementById('display-name').textContent = state.name;
  
  // Mock Data
  const mockQuestions = [
    { 
      type: 'Multiple Choice',
      text: 'What is this character called?', 
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
      answers: ['Milk Dragon', 'Black Dragon', 'Big Dragon', 'Dragon']
    },
    {
      type: 'Open-ended',
      text: 'What is the capital of Thailand?',
      image: 'https://images.unsplash.com/photo-1504966981333-1ac340945d80?q=80&w=800&auto=format&fit=crop',
      correctAnswer: 'Bangkok'
    }
  ];

  const totalQ = mockQuestions.length;
  const progEl = document.getElementById('hud-progress');
  if (progEl) progEl.textContent = `${currentQ + 1} / ${totalQ}`;

  const statsEl = document.getElementById('hud-stats');
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`;

  const q = mockQuestions[currentQ] || mockQuestions[0];
  document.getElementById('q-text').textContent = q.text;

  if (q.image) {
    document.getElementById('q-image').src = q.image;
  } else {
    document.getElementById('q-image-wrap').style.display = 'none';
  }

  // Toggle UI based on type
  if (q.type === 'Open-ended') {
    document.getElementById('multiple-choice-grid').style.display = 'none';
    document.getElementById('open-ended-area').style.display = 'flex';
  } else {
    document.getElementById('multiple-choice-grid').style.display = 'grid';
    document.getElementById('open-ended-area').style.display = 'none';
  }

  // Sync logic: Wait for Host reveal signal
  const expectedSignal = 'reveal_' + currentQ;
  const interval = setInterval(() => {
    if (localStorage.getItem('host_signal') === expectedSignal) {
      clearInterval(interval);
      window.location.href = 'player-result.html';
    }
  }, 1000);
});
