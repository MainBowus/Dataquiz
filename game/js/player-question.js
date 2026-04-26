document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state'));
  if (state) document.getElementById('display-name').textContent = state.name;

  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0');
  document.getElementById('display-q-number').textContent = `Question ${currentQ + 1}`;

  let count = 3;
  const countEl = document.getElementById('gr-countdown');
  const interval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(interval);
      window.location.href = 'player-question-display.html';
    } else {
      countEl.textContent = count;
    }
  }, 1000);
});
