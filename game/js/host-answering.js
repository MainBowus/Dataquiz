const SOCKET_URL = 'https://backend-dataquiz.onrender.com'

const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
const questions = quizData ? quizData.questions : []
let currentQ = parseInt(sessionStorage.getItem('current_question') || '0')
let totalQ = questions.length
let timeLeft = questions[currentQ]?.timeLimit || 20
let timerInterval = null
let socket = null
const gamePin = sessionStorage.getItem('socket_pin')

document.addEventListener('DOMContentLoaded', () => {
  loadQuestionData()
  startCountdown()

  socket = io(SOCKET_URL)
  socket.on('connect', () => {
    console.log('Host answering connected')
  })

  // รับจำนวนคนตอบ
  socket.on('game:answer-count', (data) => {
    const countEl = document.getElementById('answer-count')
    if (countEl) countEl.textContent = `${data.answeredCount} / ${data.totalPlayers} answered`
  })

  // ถ้าทุกคนตอบแล้ว → หมดเวลาเลย
  socket.on('game:time-up', () => {
    clearInterval(timerInterval)
    moveToReveal()
  })
})

function loadQuestionData() {
  const q = questions[currentQ]
  if (!q) return

  const qType = q.questionType === 'multiple-choice' ? 'Multiple Choice' : 'Open-ended'
  document.getElementById('hud-type').textContent = qType
  document.getElementById('hud-progress').textContent = `${currentQ + 1} / ${totalQ}`
  document.getElementById('q-text').textContent = q.questionText

  const imgEl = document.getElementById('q-image')
  const imgWrap = document.getElementById('q-image-wrap')
  if (q.questionImage?.url) {
    imgEl.src = q.questionImage.url
    imgWrap.style.display = 'flex'
  } else {
    imgWrap.style.display = 'none'
  }

  const grid = document.getElementById('answers-grid')
  if (q.questionType === 'open-ended') {
    if (grid) grid.style.display = 'none'
  } else {
    if (grid) {
      grid.style.display = 'grid'
      q.options.forEach((opt, i) => {
        const card = document.getElementById(`ans-${i}`)
        if (card) card.textContent = opt.text
      })
    }
  }
}

function startCountdown() {
  const timerEl = document.getElementById('hud-timer')

  // บอก server ให้ส่งคำถามถัดไป
  if (socket && gamePin) {
    socket.emit('game:next-question', { pin: gamePin })
  }

  timerInterval = setInterval(() => {
    timeLeft--
    if (timerEl) timerEl.textContent = `TIME ${timeLeft}`
    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      moveToReveal()
    }
  }, 1000)
}

function moveToReveal() {
  window.location.href = 'host-reveal.html'
}