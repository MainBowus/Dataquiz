const API_URL = 'https://backend-dataquiz.onrender.com/api'
const GAME_PIN = generatePin()

let quizData = null

document.addEventListener('DOMContentLoaded', async () => {
  localStorage.setItem('lobby_players', '[]')
  localStorage.setItem('player_scores', '{}')
  localStorage.setItem('game_active_status', 'false')
  localStorage.setItem('current_game_pin', GAME_PIN)

  document.getElementById('game-pin').textContent = GAME_PIN

  // ดึง quizId จาก URL
  const params = new URLSearchParams(window.location.search)
  const quizId = params.get('quizId')

  if (quizId) {
    await loadQuiz(quizId)
  } else {
    // fallback ใช้ชื่อจาก sessionStorage
    const savedTitle = sessionStorage.getItem('setup_quiz_name') || 'NAME QUIZ'
    document.getElementById('display-quiz-title').textContent = savedTitle.toUpperCase()
  }

  generateFunctionalQR()
  listenForPlayers()
})

async function loadQuiz(quizId) {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })

    if (!res.ok) throw new Error('Quiz not found')

    quizData = await res.json()

    // เก็บ quiz ไว้ใน localStorage ให้ทุกหน้าใช้ได้
    localStorage.setItem('current_quiz', JSON.stringify(quizData))
    sessionStorage.setItem('setup_quiz_name', quizData.title)

    document.getElementById('display-quiz-title').textContent = quizData.title.toUpperCase()

  } catch (err) {
    console.error(err)
    document.getElementById('display-quiz-title').textContent = 'QUIZ'
  }
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function generateFunctionalQR() {
  const qrContainer = document.getElementById('qrcode')
  if (!qrContainer) return
  qrContainer.innerHTML = ''

  const currentUrl = window.location.href
  const baseUrl = currentUrl.split('/game/host/')[0]
  const joinUrl = `${baseUrl}/dashboard/join.html?pin=${GAME_PIN}`

  new QRCode(qrContainer, {
    text: joinUrl,
    width: 140,
    height: 140,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  })
}

function listenForPlayers() {
  const grid = document.getElementById('players-grid')
  const waiting = document.getElementById('waiting-section')

  function updatePlayerList() {
    const players = JSON.parse(localStorage.getItem('lobby_players') || '[]')
    if (players.length > 0) {
      waiting.style.display = 'none'
      grid.style.display = 'grid'
      grid.innerHTML = ''
      players.forEach(name => {
        const card = document.createElement('div')
        card.className = 'player-card'
        card.textContent = name
        grid.appendChild(card)
      })
    } else {
      waiting.style.display = 'block'
      grid.style.display = 'none'
    }
  }
  setInterval(updatePlayerList, 1000)
}

function startGame() {
  const players = JSON.parse(localStorage.getItem('lobby_players') || '[]')
  if (players.length === 0) {
    alert('Please wait for at least one player to join!')
    return
  }

  const btn = document.getElementById('start-btn')
  btn.disabled = true
  btn.textContent = 'Starting...'

  sessionStorage.setItem('game_pin', GAME_PIN)
  sessionStorage.setItem('current_question', '0')

  localStorage.setItem('game_active_status', 'true')
  localStorage.setItem('host_signal', 'question_0')

  setTimeout(() => { window.location.href = 'host-question.html' }, 800)
}