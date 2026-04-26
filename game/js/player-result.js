document.addEventListener('DOMContentLoaded', () => {
  // Mock result logic
  const isCorrect = Math.random() > 0.3;
  const bg = document.getElementById('result-bg');
  const text = document.getElementById('result-text');
  
  if (isCorrect) {
    bg.className = 'player-main correct-bg';
    text.textContent = 'Correct!';
  } else {
    bg.className = 'player-main wrong-bg';
    text.textContent = 'Wrong';
    document.getElementById('points-text').style.display = 'none';
  }

  setTimeout(() => {
    window.location.href = 'player-answering.html'; // Loop directly to answering
  }, 4000);
});
