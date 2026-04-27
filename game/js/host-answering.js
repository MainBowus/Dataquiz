const TOTAL_TIME = 10

// ดึง quiz จาก localStorage ที่ host-lobby โหลดไว้
const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
const questions = quizData ? quizData.questions : []

let currentQ = parseInt(sessionStorage.getItem('current_question') || '0')
let totalQ = questions.length
let timeLeft = TOTAL_TIME
let timerInterval = null

document.addEventListener('DOMContentLoaded', () => {
  loadQuestionData()
  startCountdown()
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
  localStorage.setItem('host_signal', 'reveal_' + currentQ)
  window.location.href = 'host-reveal.html'
}