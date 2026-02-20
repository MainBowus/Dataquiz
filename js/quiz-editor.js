/* ===========================
   js/quiz-editor.js
   Quiz Editor Logic
   =========================== */

// ===== STATE =====
let questions = [
  { text: '', image: null, answers: ['', '', '', ''], correct: null }
];
let currentQ = 0;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Set quiz title from sessionStorage (ถ้ามาจากหน้า create)
  const savedTitle = sessionStorage.getItem('new_quiz_title');
  if (savedTitle) {
    document.getElementById('quiz-title-input').value = savedTitle;
  }

  renderTabs();
  loadQuestion(0);
});

// ===== TABS =====
function renderTabs() {
  const container = document.getElementById('question-tabs');
  container.innerHTML = '';

  questions.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-tab' + (i === currentQ ? ' active' : '');
    btn.textContent = i + 1;
    btn.onclick = () => switchQuestion(i);
    container.appendChild(btn);
  });

  // Add button
  const addBtn = document.createElement('button');
  addBtn.className = 'q-tab-add';
  addBtn.textContent = '+';
  addBtn.title = 'Add question';
  addBtn.onclick = addQuestion;
  container.appendChild(addBtn);
}

function switchQuestion(index) {
  saveCurrentQuestion();
  currentQ = index;
  renderTabs();
  loadQuestion(index);
}

function addQuestion() {
  saveCurrentQuestion();
  questions.push({ text: '', image: null, answers: ['', '', '', ''], correct: null });
  currentQ = questions.length - 1;
  renderTabs();
  loadQuestion(currentQ);
  showToast('Question ' + (currentQ + 1) + ' added', 'success');
}

// ===== LOAD / SAVE QUESTION =====
function loadQuestion(index) {
  const q = questions[index];

  // Question text
  document.getElementById('question-text').value = q.text;

  // Answer inputs
  const inputs = document.querySelectorAll('.answer-input');
  const correctBtns = document.querySelectorAll('.answer-correct-btn');
  inputs.forEach((inp, i) => {
    inp.value = q.answers[i] || '';
  });
  correctBtns.forEach((btn, i) => {
    btn.classList.toggle('correct', q.correct === i);
  });

  // Image preview
  const previewArea = document.getElementById('media-preview');
  if (q.image) {
    previewArea.innerHTML = `<img src="${q.image}" alt="Question image" />`;
  } else {
    previewArea.innerHTML = `
      <div class="upload-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <span class="upload-hint">Click to upload image</span>
    `;
  }
}

function saveCurrentQuestion() {
  const q = questions[currentQ];
  q.text = document.getElementById('question-text').value.trim();
  const inputs = document.querySelectorAll('.answer-input');
  inputs.forEach((inp, i) => { q.answers[i] = inp.value.trim(); });
}

// ===== CORRECT ANSWER =====
function toggleCorrect(btn) {
  const correctBtns = document.querySelectorAll('.answer-correct-btn');
  const index = Array.from(correctBtns).indexOf(btn);

  // Toggle off if already selected
  if (questions[currentQ].correct === index) {
    questions[currentQ].correct = null;
    btn.classList.remove('correct');
  } else {
    questions[currentQ].correct = index;
    correctBtns.forEach(b => b.classList.remove('correct'));
    btn.classList.add('correct');
  }
}

// ===== IMAGE UPLOAD =====
function triggerUpload() {
  document.getElementById('media-file-input').click();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    questions[currentQ].image = e.target.result;
    const previewArea = document.getElementById('media-preview');
    previewArea.innerHTML = `<img src="${e.target.result}" alt="Question image" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" />`;
  };
  reader.readAsDataURL(file);
}

// ===== SAVE =====
function saveQuiz() {
  saveCurrentQuestion();

  const title = document.getElementById('quiz-title-input').value.trim();
  if (!title) {
    showToast('Please enter a quiz title', 'error');
    document.getElementById('quiz-title-input').focus();
    return;
  }

  // Validate at least 1 question has text + correct answer
  const hasValidQ = questions.some(q => q.text && q.correct !== null);
  if (!hasValidQ) {
    showToast('Add at least one question with a correct answer', 'error');
    return;
  }

  const quizData = {
    id: 'quiz_' + Date.now(),
    title,
    questions,
    createdAt: new Date().toISOString()
  };

  // Save to localStorage
  const existing = JSON.parse(localStorage.getItem('my_quizzes') || '[]');
  existing.push(quizData);
  localStorage.setItem('my_quizzes', JSON.stringify(existing));
  sessionStorage.removeItem('new_quiz_title');
  sessionStorage.removeItem('new_quiz_emoji');

  showToast('Quiz saved!', 'success');

  // Navigate after short delay
  setTimeout(() => {
    window.location.href = '../dashboard/explore.html';
  }, 1200);
}

// ===== EXIT =====
function confirmExit() {
  if (confirm('Are you sure you want to exit? Unsaved changes will be lost.')) {
    window.location.href = '../index.html';
  }
}

// ===== TOAST =====
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}