document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 }
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0')

  document.getElementById('display-name').textContent = state.name

  const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
  const questions = quizData ? quizData.questions : []
  const q = questions[currentQ]

  const lastAnsType = sessionStorage.getItem('last_answer_type')
  const lastAns = sessionStorage.getItem('last_answer')
  const timeLeft = parseInt(sessionStorage.getItem('time_left_at_submit') || '0')
  let isCorrect = false

  if (q) {
    if (lastAnsType === 'open') {
      const accepted = (q.acceptedAnswers || []).map(a => a.toLowerCase())
      isCorrect = accepted.includes((lastAns || '').trim().toLowerCase())
    } else {
      const answerIndex = parseInt(lastAns)
      isCorrect = q.options?.[answerIndex]?.isCorrect === true
    }
  }

  if (isCorrect) {
    const basePoints = q?.points || 1000
    const totalTime = 30
    const earnedPoints = Math.floor(basePoints * (timeLeft / totalTime))
    state.score = (state.score || 0) + earnedPoints
  }

  sessionStorage.setItem('player_state', JSON.stringify(state))

  const allScores = JSON.parse(localStorage.getItem('player_scores') || '{}')
  allScores[state.name] = state.score
  localStorage.setItem('player_scores', JSON.stringify(allScores))

  const statsEl = document.getElementById('hud-stats')
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score}`

  const banner = document.getElementById('banner')
  const text = document.getElementById('result-text')

  if (isCorrect) {
    banner.classList.add('correct-banner')
    text.textContent = 'CORRECT!'
  } else {
    banner.classList.add('wrong-banner')
    text.textContent = 'INCORRECT!'
  }

  const expectedSignal = 'question_' + (currentQ + 1)

  const interval = setInterval(() => {
    const signal = localStorage.getItem('host_signal')

    const currentScores = JSON.parse(localStorage.getItem('player_scores') || '{}')
    const sorted = Object.entries(currentScores).sort((a, b) => b[1] - a[1])
    const myRank = sorted.findIndex(entry => entry[0] === state.name) + 1
    if (myRank > 0) {
      state.rank = myRank
      sessionStorage.setItem('player_state', JSON.stringify(state))
      if (statsEl) statsEl.textContent = `#${state.rank} Score ${state.score}`
    }

    if (signal === expectedSignal) {
      clearInterval(interval)
      sessionStorage.setItem('current_question', currentQ + 1)
      window.location.href = 'player-question.html'
    } else if (signal === 'game_finished') {
      clearInterval(interval)
      window.location.href = 'player-final.html'
    }
  }, 1000)
})