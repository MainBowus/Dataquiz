const SOCKET_URL = 'https://backend-dataquiz.onrender.com'

const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 }
const currentQ = parseInt(sessionStorage.getItem('current_question') || '0')
const gamePin = state.pin

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('display-name').textContent = state.name

  const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
  const questions = quizData ? quizData.questions : []
  const totalQ = parseInt(sessionStorage.getItem('total_questions') || '0') || questions.length

  const progEl = document.getElementById('hud-progress')
  if (progEl) progEl.textContent = (currentQ + 1) + ' / ' + totalQ

  const statsEl = document.getElementById('hud-stats')
  if (statsEl) statsEl.textContent = '#' + (state.rank || 1) + ' Score ' + (state.score || 0)

  const q = questions[currentQ]
  if (q) {
    document.getElementById('q-text').textContent = q.questionText
    const imgWrap = document.getElementById('q-image-wrap')
    const imgEl = document.getElementById('q-image')
    if (q.questionImage && q.questionImage.url) {
      if (imgEl) imgEl.src = q.questionImage.url
      if (imgWrap) imgWrap.style.display = 'flex'
    } else {
      if (imgWrap) imgWrap.style.display = 'none'
    }
    const mcGrid = document.getElementById('multiple-choice-grid')
    const oeArea = document.getElementById('open-ended-area')
    if (q.questionType === 'open-ended') {
      if (mcGrid) mcGrid.style.display = 'none'
      if (oeArea) oeArea.style.display = 'flex'
    } else {
      if (mcGrid) mcGrid.style.display = 'grid'
      if (oeArea) oeArea.style.display = 'none'
    }
  }

  const isCorrect = sessionStorage.getItem('last_answer_result') === 'true'
  const banner = document.getElementById('banner')
  const resultText = document.getElementById('result-text')
  if (resultText) resultText.textContent = isCorrect ? 'CORRECT!' : 'INCORRECT!'
  if (banner) {
    banner.classList.add(isCorrect ? 'correct-banner' : 'wrong-banner')
  }

  const socket = io(SOCKET_URL)

  socket.on('connect', () => {
    if (gamePin) socket.emit('game:join', { pin: gamePin, name: state.name })
  })

  socket.on('game:question', (data) => {
    sessionStorage.setItem('current_question', data.questionIndex)
    window.location.href = 'player-question.html'
  })

  socket.on('game:final-results', () => {
    window.location.href = 'player-final.html'
  })

  socket.on('game:error', (data) => {
    console.error('Game error:', data.message)
  })
})
