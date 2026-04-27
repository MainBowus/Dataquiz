let time = 30; // Global for access in submit functions

document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 };
  
  // HUD
  document.getElementById('display-name').textContent = state.name;
  
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  
  // Mock Data with both types
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
    // Populate answer buttons
    q.answers.forEach((ans, i) => {
      const btn = document.getElementById(`ans-${i}`);
      if (btn) btn.textContent = ans;
    });
  }

  // Countdown timer simulation
  const timerEl = document.getElementById('hud-timer');
  const interval = setInterval(() => {
    time--;
    if (timerEl) timerEl.textContent = `TIME ${time}`;
    if (time <= 0) {
      clearInterval(interval);
      sessionStorage.setItem('time_left_at_submit', '0');
      window.location.href = 'player-waiting-ans.html';
    }
  }, 1000);
});

function submitAnswer(index) {
  sessionStorage.setItem('last_answer_type', 'multiple');
  sessionStorage.setItem('last_answer', index);
  sessionStorage.setItem('time_left_at_submit', time);
  window.location.href = 'player-waiting-ans.html';
}

function submitOpenEnded() {
  const val = document.getElementById('open-ended-input').value;
  sessionStorage.setItem('last_answer_type', 'open');
  sessionStorage.setItem('last_answer', val);
  sessionStorage.setItem('time_left_at_submit', time);
  window.location.href = 'player-waiting-ans.html';
}
