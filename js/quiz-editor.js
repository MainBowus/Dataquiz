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
  // Set quiz title from sessionStorage
  const savedTitle = sessionStorage.getItem('setup_quiz_name');
  if (savedTitle) {
    const titleInput = document.getElementById('quiz-title-input');
    if (titleInput) titleInput.value = savedTitle;
  }

  renderTabs();
  loadQuestion(0);
});

// ===== TABS =====
function renderTabs() {
  const container = document.getElementById('question-tabs');
  if (!container) return;
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
  if (!q) return;

  // Question text
  const qInput = document.getElementById('question-text');
  if (qInput) qInput.value = q.text || '';

  // Answer inputs
  const inputs = document.querySelectorAll('.answer-input');
  inputs.forEach((inp, i) => {
    inp.value = (q.answers && q.answers[i]) || '';
  });

  // Answer Options UI State
  const options = document.querySelectorAll('.answer-option');
  options.forEach((opt, i) => {
    opt.classList.toggle('correct', q.correct === i);
  });

  // Image preview
  const previewArea = document.getElementById('media-preview');
  if (!previewArea) return;

  if (q.image) {
    previewArea.innerHTML = `<img src="${q.image}" alt="Question image" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" />`;
  } else {
    previewArea.innerHTML = `
      <div class="upload-icon">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
    `;
  }
}

function saveCurrentQuestion() {
  const q = questions[currentQ];
  if (!q) return;

  const qInput = document.getElementById('question-text');
  if (qInput) q.text = qInput.value.trim();

  const inputs = document.querySelectorAll('.answer-input');
  if (!q.answers) q.answers = ['', '', '', ''];
  inputs.forEach((inp, i) => { 
    q.answers[i] = inp.value.trim(); 
  });
}
// ===== CORRECT ANSWER =====
function toggleCorrect(el) {
  const options = document.querySelectorAll('.answer-option');
  const index = Array.from(options).indexOf(el);

  if (questions[currentQ].correct === index) {
    questions[currentQ].correct = null;
    el.classList.remove('correct');
  } else {
    questions[currentQ].correct = index;
    options.forEach(opt => opt.classList.remove('correct'));
    el.classList.add('correct');
  }
}

// ===== IMAGE UPLOAD =====
function triggerUpload() {
  const fileInput = document.getElementById('media-file-input');
  if (fileInput) fileInput.click();
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
    if (previewArea) {
      previewArea.innerHTML = `<img src="${e.target.result}" alt="Question image" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" />`;
    }
  };
  reader.readAsDataURL(file);
}

// ===== SAVE =====
function saveQuiz() {
  try {
    saveCurrentQuestion();

    const titleInput = document.getElementById('quiz-title-input');
    const title = titleInput ? titleInput.value.trim() : '';
    
    if (!title) {
      showToast('Please enter a quiz title', 'error');
      return;
    }

    // Validation: Check if at least ONE question is valid
    const hasValidQ = questions.some(q => q.text.length > 0 && q.correct !== null);
    if (!hasValidQ) {
      showToast('Add at least one question with text and a correct answer', 'error');
      return;
    }

    const quizData = {
      id: 'quiz_' + Date.now(),
      title: title,
      image: sessionStorage.getItem('setup_quiz_image') || null,
      type: sessionStorage.getItem('setup_quiz_type') || 'multiple',
      questions: questions,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('my_quizzes') || '[]');
    existing.push(quizData);
    localStorage.setItem('my_quizzes', JSON.stringify(existing));
    
    // Cleanup
    sessionStorage.removeItem('setup_quiz_name');
    sessionStorage.removeItem('setup_quiz_image');
    sessionStorage.removeItem('setup_quiz_type');

    showToast('Quiz saved successfully!', 'success');

    // Redirect to Explore
    setTimeout(() => {
      window.location.href = 'explore.html';
    }, 1200);
  } catch (err) {
    console.error('Save error:', err);
    alert('An error occurred while saving. Check console.');
  }
}

// ===== EXIT / BACK =====
function confirmExit() {
  if (confirm('Are you sure you want to exit? Unsaved changes will be lost.')) {
    window.location.href = '../index.html';
  }
}

function goBack() {
  window.location.href = 'create-quiz.html';
}

// ===== TOAST =====
function showToast(msg, type = '') {
  console.log('Toast:', msg, type);
  const toast = document.getElementById('toast');
  if (!toast) {
    alert(msg); // Fallback if toast element missing
    return;
  }
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
