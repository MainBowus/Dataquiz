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
  if (q) {
    document.getElementById('q-text').textContent = q.questionText

    const imgEl = document.getElementById('q-image')
    const imgWrap = document.getElementById('q-image-wrap')
    if (q.questionImage?.url) {
      imgEl.src = q.questionImage.url
      imgWrap.style.display = 'flex'
    } else {
      if (imgWrap) imgWrap.style.display = 'none'
    }
  }

  setTimeout(() => {
    window.location.href = 'player-answering.html'
  }, 3000)
})