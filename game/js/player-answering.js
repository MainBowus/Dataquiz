let time = 30

document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 }
  document.getElementById('display-name').textContent = state.name

  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0')

  // ดึง quiz จาก localStorage ที่ host โหลดไว้
  const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
  const questions = quizData ? quizData.questions : []
  const totalQ = questions.length

  const progEl = document.getElementById('hud-progress')
  if (progEl) progEl.textContent = `${currentQ + 1} / ${totalQ}`

  const statsEl = document.getElementById('hud-stats')
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`

  const q = questions[currentQ]
  if (!q) return

  document.getElementById('q-text').textContent = q.questionText

  const imgEl = document.getElementById('q-image')
  const imgWrap = document.getElementById('q-image-wrap')
  if (q.questionImage?.url) {
    imgEl.src = q.questionImage.url
    imgWrap.style.display = 'flex'
  } else {
    if (imgWrap) imgWrap.style.display = 'none'
  }

  if (q.questionType === 'open-ended') {
    document.getElementById('multiple-choice-grid').style.display = 'none'
    document.getElementById('open-ended-area').style.display = 'flex'
  } else {
    document.getElementById('multiple-choice-grid').style.display = 'grid'
    document.getElementById('open-ended-area').style.display = 'none'
    q.options.forEach((opt, i) => {
      const btn = document.getElementById(`ans-${i}`)
      if (btn) btn.textContent = opt.text
    })
  }

  const timerEl = document.getElementById('hud-timer')
  const interval = setInterval(() => {
    time--
    if (timerEl) timerEl.textContent = `TIME ${time}`
    if (time <= 0) {
      clearInterval(interval)
      sessionStorage.setItem('time_left_at_submit', '0')
      window.location.href = 'player-waiting-ans.html'
    }
  }, 1000)
})

function submitAnswer(index) {
  sessionStorage.setItem('last_answer_type', 'multiple')
  sessionStorage.setItem('last_answer', index)
  sessionStorage.setItem('time_left_at_submit', time)
  window.location.href = 'player-waiting-ans.html'
}

function submitOpenEnded() {
  const val = document.getElementById('open-ended-input').value
  sessionStorage.setItem('last_answer_type', 'open')
  sessionStorage.setItem('last_answer', val)
  sessionStorage.setItem('time_left_at_submit', time)
  window.location.href = 'player-waiting-ans.html'
}