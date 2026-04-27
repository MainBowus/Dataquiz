const SOCKET_URL = 'https://backend-dataquiz.onrender.com'

let socket = null
let time = 20
let timerInterval = null
let answered = false
const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 }
const currentQ = parseInt(sessionStorage.getItem('current_question') || '0')

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('display-name').textContent = state.name

  socket = io(SOCKET_URL)

  socket.on('connect', () => {
    console.log('Player answering connected')
  })

  // รับคำถามจาก server
  socket.on('game:question', (data) => {
    if (data.questionIndex !== currentQ) return

    time = data.timeLimit || 20
    const totalQ = sessionStorage.getItem('total_questions') || '?'

    const progEl = document.getElementById('hud-progress')
    if (progEl) progEl.textContent = `${currentQ + 1} / ${totalQ}`

    const statsEl = document.getElementById('hud-stats')
    if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`

    document.getElementById('q-text').textContent = data.questionText

    // รูปภาพ
    const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
    const q = quizData?.questions[currentQ]
    const imgWrap = document.getElementById('q-image-wrap')
    if (q?.questionImage?.url) {
      document.getElementById('q-image').src = q.questionImage.url
      if (imgWrap) imgWrap.style.display = 'flex'
    } else {
      if (imgWrap) imgWrap.style.display = 'none'
    }

    if (data.questionType === 'open-ended') {
      document.getElementById('multiple-choice-grid').style.display = 'none'
      document.getElementById('open-ended-area').style.display = 'flex'
    } else {
      document.getElementById('multiple-choice-grid').style.display = 'grid'
      document.getElementById('open-ended-area').style.display = 'none'
      data.options.forEach((opt, i) => {
        const btn = document.getElementById(`ans-${i}`)
        if (btn) btn.textContent = opt.text
      })
    }

    startTimer()
  })

  // หมดเวลา
  socket.on('game:time-up', () => {
    clearInterval(timerInterval)
    if (!answered) {
      sessionStorage.setItem('last_answer_result', 'false')
      sessionStorage.setItem('earned_points', '0')
    }
    window.location.href = 'player-result.html'
  })

  // ผลลัพธ์การตอบ
  socket.on('game:answer-result', (data) => {
    clearInterval(timerInterval)
    sessionStorage.setItem('last_answer_result', data.isCorrect)
    sessionStorage.setItem('earned_points', data.earnedPoints)
    state.score = data.totalScore
    state.streak = data.streak
    sessionStorage.setItem('player_state', JSON.stringify(state))
    window.location.href = 'player-result.html'
  })
})

function startTimer() {
  const timerEl = document.getElementById('hud-timer')
  timerInterval = setInterval(() => {
    time--
    if (timerEl) timerEl.textContent = `TIME ${time}`
    if (time <= 0) clearInterval(timerInterval)
  }, 1000)
}

function submitAnswer(index) {
  if (answered) return
  answered = true
  const pin = JSON.parse(sessionStorage.getItem('player_state'))?.pin
  if (socket && pin) {
    socket.emit('game:answer', { pin, answerIndex: index })
  }
}

function submitOpenEnded() {
  if (answered) return
  answered = true
  const val = document.getElementById('open-ended-input').value.trim()
  // open-ended ส่ง index 0 ไปก่อน (backend จะตรวจ acceptedAnswers เอง)
  // เก็บค่าไว้ใช้แสดงผล
  sessionStorage.setItem('open_answer', val)
  const pin = JSON.parse(sessionStorage.getItem('player_state'))?.pin
  if (socket && pin) {
    socket.emit('game:answer', { pin, answerIndex: 0, openAnswer: val })
  }
}