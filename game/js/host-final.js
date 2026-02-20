/* ===========================
   js/host-final.js
   Final Results + Confetti
   =========================== */

// ===== MOCK DATA =====
const GAME_PIN    = sessionStorage.getItem('game_pin') || '0000000';
const totalPlayers = 16;

const mockFinal = [
  { name: 'Username', score: 980 },
  { name: 'Username', score: 850 },
  { name: 'Username', score: 720 },
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footer-pin').textContent     = GAME_PIN;
  document.getElementById('footer-players').textContent = String(totalPlayers).padStart(3, '0');

  fillPodium();
  launchConfetti();
});

// ===== FILL PODIUM =====
function fillPodium() {
  const top3 = mockFinal.slice(0, 3);

  // Winner banner
  const winner = top3[0];
  if (winner) {
    document.getElementById('winner-sub').textContent =
      `${winner.name} has won the game!`;
  }

  // Slot order: 2nd (left), 1st (center), 3rd (right)
  const slots = [
    { id: 1, infoId: 'info-1', avaClass: 'ava-gold' },
    { id: 2, infoId: 'info-2', avaClass: 'ava-silver' },
    { id: 3, infoId: 'info-3', avaClass: 'ava-bronze' },
  ];

  slots.forEach(({ id, infoId }) => {
    const player = top3[id - 1];
    const infoEl = document.getElementById(infoId);
    if (player && infoEl) {
      const pts = String(player.score).padStart(3, '0');
      infoEl.textContent = `${player.name} with ${pts} points!`;
      // Update avatar initial
      const slot = document.getElementById(`slot-${id}`);
      const ava  = slot?.querySelector('.podium-avatar');
      if (ava) ava.textContent = player.name.charAt(0).toUpperCase();
    }
  });
}

// ===== CONFETTI =====
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const COLORS = ['#FF3B78','#FFD600','#00E5FF','#C84BFF','#00D17A','#FF8C00','#fff'];
  const pieces = [];
  const COUNT  = 120;

  for (let i = 0; i < COUNT; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height - canvas.height,
      w:     Math.random() * 10 + 5,
      h:     Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:   Math.random() * Math.PI * 2,
      vx:    (Math.random() - 0.5) * 2,
      vy:    Math.random() * 3 + 1.5,
      vr:    (Math.random() - 0.5) * 0.15,
      alpha: 1,
    });
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vr;

      // Fade out slowly after frame 200
      if (frame > 200) p.alpha -= 0.004;

      // Reset if off screen or faded
      if (p.y > canvas.height + 20 || p.alpha <= 0) {
        if (frame < 300) {
          p.y     = -20;
          p.x     = Math.random() * canvas.width;
          p.alpha = 1;
        }
      }
    });

    frame++;
    if (frame < 400) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(draw);
}

// ===== END GAME =====
function endGame() {
  sessionStorage.clear();
  window.location.href = '../../dashboard/explore.html';
}