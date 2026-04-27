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
      answers: ['Milk Dragon', 'Black Dragon', 'Big Dragon', 'Dragon'],
      correct: 0
    },
    {
      type: 'Open-ended',
      text: 'What is the capital of Thailand?',
      image: 'https://images.unsplash.com/photo-1504966981333-1ac340945d80?q=80&w=800&auto=format&fit=crop',
      correctAnswer: 'Bangkok'
    }
  ];
  const q = mockQuestions[currentQ] || mockQuestions[0];
  document.getElementById('q-text').textContent = q.text || 'QUESTION';
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

  // Check Answer
  const lastAnsType = sessionStorage.getItem('last_answer_type');
  const lastAns = sessionStorage.getItem('last_answer');
  const timeLeft = parseInt(sessionStorage.getItem('time_left_at_submit') || '0');
  let isCorrect = false;

  if (lastAnsType === 'open') {
    if (q.correctAnswer && lastAns) {
        isCorrect = (lastAns.trim().toLowerCase() === q.correctAnswer.toLowerCase());
    }
  } else {
    isCorrect = (parseInt(lastAns) === q.correct);
  }

  // Calculate Points
  if (isCorrect) {
    const basePoints = 1000;
    const totalTime = 30;
    const earnedPoints = Math.floor(basePoints * (timeLeft / totalTime));
    state.score = (state.score || 0) + earnedPoints;
  }

  // Update Player State
  sessionStorage.setItem('player_state', JSON.stringify(state));

  // Update Global Scoreboard Data for Host (Mocking shared storage)
  const allScores = JSON.parse(localStorage.getItem('player_scores') || '{}');
  allScores[state.name] = state.score;
  localStorage.setItem('player_scores', JSON.stringify(allScores));

  // Update Result HUD stats immediately
  const statsEl = document.getElementById('hud-stats');
  if (statsEl) {
    statsEl.textContent = `#${state.rank || 1} Score ${state.score}`;
  }

  const banner = document.getElementById('banner');
  const text = document.getElementById('result-text');

  if (isCorrect) {
    banner.classList.add('correct-banner');
    text.textContent = 'CORRECT!';
  } else {
    banner.classList.add('wrong-banner');
    text.textContent = 'INCORRECT!';
  }

  // Wait for Host to click 'Next'
  const expectedSignal = 'question_' + (currentQ + 1);

  const interval = setInterval(() => {
    const signal = localStorage.getItem('host_signal');
    
    // Update rank while waiting
    const currentScores = JSON.parse(localStorage.getItem('player_scores') || '{}');
    const sorted = Object.entries(currentScores).sort((a,b) => b[1] - a[1]);
    const myRank = sorted.findIndex(entry => entry[0] === state.name) + 1;
    if (myRank > 0) {
      state.rank = myRank;
      sessionStorage.setItem('player_state', JSON.stringify(state));
      if (statsEl) statsEl.textContent = `#${state.rank} Score ${state.score}`;
    }

    if (signal === expectedSignal) {
      clearInterval(interval);
      sessionStorage.setItem('current_question', currentQ + 1);
      window.location.href = 'player-question.html';
    } else if (signal === 'game_finished') {
      clearInterval(interval);
      window.location.href = 'player-final.html';
    }
  }, 1000);
});
