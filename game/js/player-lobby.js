document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state'));
  if (!state) { window.location.href = '../../dashboard/join.html'; return; }

  // Load User Info
  document.getElementById('display-name').textContent = state.name;
  
  // Load Quiz Name (from host or setup)
  const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null');
  const quizName = quizData?.title || sessionStorage.getItem('setup_quiz_name') || 'NAME QUIZ';
  document.getElementById('display-quiz-name').textContent = quizName;

  // Clear previous game status if any (ensure clean start)
  if (localStorage.getItem('game_active_status') === 'true') {
     // If host already started before we entered, we might need to jump in
     // But usually we wait for the transition
  }

  // Initialize player score in global scores
  const allScores = JSON.parse(localStorage.getItem('player_scores') || '{}');
  allScores[state.name] = 0;
  localStorage.setItem('player_scores', JSON.stringify(allScores));

  // Listen for Host to press Start
  const checkStatusInterval = setInterval(() => {
    const isStarted = localStorage.getItem('game_active_status');
    if (isStarted === 'true') {
      clearInterval(checkStatusInterval);
      sessionStorage.setItem('current_question', '0');
      window.location.href = 'player-question.html';
    }
  }, 1000);
});
