document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state'));
  if (!state) { window.location.href = '../../dashboard/join.html'; return; }

  // Load User Info
  document.getElementById('display-name').textContent = state.name;
  
  // Load Quiz Name (from host or setup)
  const quizName = sessionStorage.getItem('setup_quiz_name') || 'NAME QUIZ';
  document.getElementById('display-quiz-name').textContent = quizName;

  // Temporary: Automatic redirect after 3 seconds for testing
  setTimeout(() => {
    window.location.href = 'player-question.html';
  }, 3000);
});
