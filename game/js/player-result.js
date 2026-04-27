const SOCKET_URL = 'https://backend-dataquiz.onrender.com'

document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 }
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0')

  document.getElementById('display-name').textContent = state.name

  const isCorrect = sessionStorage.getItem('last_answer_result') === 'true'
  const earnedPoints = parseInt(sessionStorage.getItem('earned_points') || '0')

  const statsEl = document.getElementById('hud-stats')
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`

  const banner = document.getElementById('banner')
  const text = document.getElementById('result-text')

  if (isCorrect) {
    banner.classList.add('correct-banner')
    text.textContent = 'CORRECT!'
  } else {
    banner.classList.add('wrong-banner')
    text.textContent = 'INCORRECT!'
  }

  // รอ host กด next
  const socket = io(SOCKET_URL)

  socket.on('game:question', (data) => {
    // host ส่งคำถามถัดไปแล้ว
    sessionStorage.setItem('current_question', data.questionIndex)
    window.location.href = 'player-question.html'
  })

  socket.on('game:final-results', (data) => {
    // จบเกมแล้ว
    const sorted = data.results
    const myRank = sorted.findIndex(r => r.name === state.name) + 1
    state.rank = myRank || state.rank
    sessionStorage.setItem('player_state', JSON.stringify(state))
    window.location.href = 'player-final.html'
  })

  socket.on('game:host-disconnected', () => {
    alert('Host has disconnected. Game ended.')
    window.location.href = '../../dashboard/join.html'
  })
})