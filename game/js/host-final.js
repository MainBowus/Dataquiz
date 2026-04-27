const GAME_PIN = sessionStorage.getItem('game_pin') || '000000'

document.addEventListener('DOMContentLoaded', () => {
  const footerPin = document.getElementById('footer-pin')
  if (footerPin) footerPin.textContent = GAME_PIN
  fillResults()
  launchConfetti()
})

function fillResults() {
  const scoresData = JSON.parse(localStorage.getItem('player_scores') || '{}')
  const sorted = Object.entries(scoresData)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)

  if (sorted[0]) {
    document.getElementById('winner-sub').textContent = `${sorted[0].name} has won the game!`
  }

  const slots = [
    { rank: 1, infoId: 'info-1' },
    { rank: 2, infoId: 'info-2' },
    { rank: 3, infoId: 'info-3' },
  ]

  slots.forEach(slot => {
    const player = sorted[slot.rank - 1]
    const infoEl = document.getElementById(slot.infoId)
    if (player && infoEl) {
      infoEl.textContent = `${player.name} (${player.score} pts)`
    }
  })
}

function endGame() {
  localStorage.removeItem('current_quiz')
  localStorage.removeItem('lobby_players')
  localStorage.removeItem('player_scores')
  localStorage.removeItem('game_active_status')
  localStorage.removeItem('host_signal')
  localStorage.removeItem('current_game_pin')
  sessionStorage.clear()
  window.location.href = '../../dashboard/explore.html'
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const pieces = []
  const COLORS = ['#ccff00', '#00d2ff', '#ff3b5c', '#ffffff', '#ffd600', '#ff8c00']

  for (let i = 0; i < 250; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 12 + 8,
      h: Math.random() * 10 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * 360,
      speed: Math.random() * 4 + 3,
      rSpeed: Math.random() * 6 - 3,
      drift: Math.random() * 2 - 1
    })
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pieces.forEach(p => {
      p.y += p.speed
      p.x += p.drift
      p.rot += p.rSpeed
      if (p.y > canvas.height) {
        p.y = -20
        p.x = Math.random() * canvas.width
      }
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot * Math.PI / 180)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    })
    requestAnimationFrame(update)
  }
  update()
}