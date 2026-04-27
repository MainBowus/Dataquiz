const quizData = JSON.parse(localStorage.getItem('current_quiz') || 'null')
const questions = quizData ? quizData.questions : []

let currentQ = parseInt(sessionStorage.getItem('current_question') || '0')
let totalQ = questions.length

document.addEventListener('DOMContentLoaded', () => {
  loadRevealData()
})

function loadRevealData() {
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
    const correctAns = q.acceptedAnswers?.join(', ') || '-'
    if (grid) {
      grid.innerHTML = `<div class="answer-card correct" style="grid-column: 1 / -1; width: 100%; text-align: center;">Correct Answer: ${correctAns}</div>`
      grid.style.display = 'grid'
    }
  } else {
    if (grid) {
      grid.style.display = 'grid'
      q.options.forEach((opt, i) => {
        const card = document.getElementById(`ans-${i}`)
        if (card) {
          card.textContent = opt.text
          if (opt.isCorrect) {
            card.classList.add('correct')
          } else {
            card.classList.remove('correct')
          }
        }
      })
    }
  }
}

function goNext() {
  window.location.href = 'host-scoreboard.html'
}