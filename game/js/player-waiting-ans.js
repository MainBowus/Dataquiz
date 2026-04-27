document.addEventListener('DOMContentLoaded', () => {
  const state = JSON.parse(sessionStorage.getItem('player_state')) || { name: 'Username', score: 0, rank: 1 }
  const currentQ = parseInt(sessionStorage.getItem('current_question') || '0')

  document.getElementById('display-name').textContent = state.name

  const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
  const questions = quizData ? quizData.questions : []
  const totalQ = questions.length

  const progEl = document.getElementById('hud-progress')
  if (progEl) progEl.textContent = `${currentQ + 1} / ${totalQ}`

  const statsEl = document.getElementById('hud-stats')
  if (statsEl) statsEl.textContent = `#${state.rank || 1} Score ${state.score || 0}`

  const q = questions[currentQ]
  if (q) {
    document.getElementById('q-text').textContent = q.questionText
    const imgWrap = document.getElementById('q-image-wrap')
    if (q.questionImage?.url) {
      document.getElementById('q-image').src = q.questionImage.url
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

  // รอ host signal reveal
  const expectedSignal = 'reveal_' + currentQ
  const interval = setInterval(() => {
    if (localStorage.getItem('host_signal') === expectedSignal) {
      clearInterval(interval)
      window.location.href = 'player-result.html'
    }
  }, 1000)
})