const QUESTIONS = [
  {q: "What is the capital of France?", choices:["Madrid","Berlin","Paris","Rome"], answer:2},
  {q: "Which planet is known as the Red Planet?", choices:["Venus","Mars","Jupiter","Saturn"], answer:1},
  {q: "HTML stands for?", choices:["Hyper Text Markup Language","Home Tool Markup Language","Hyperlinks Text Markup Language","None"], answer:0},
  {q: "Which gas do plants primarily absorb?", choices:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], answer:2},
  {q: "Who wrote 'Romeo and Juliet'?", choices:["Charles Dickens","William Shakespeare","Leo Tolstoy","Mark Twain"], answer:1}
];

let currentIndex = 0;
let score = 0;
let selected = null;

const qEl = document.getElementById('question');
const optsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const revealBtn = document.getElementById('revealBtn');
const scoreEl = document.getElementById('score');
const qIndexEl = document.getElementById('qIndex');
const qTotalEl = document.getElementById('qTotal');
const progressFill = document.getElementById('progressFill');
const highScoreEl = document.getElementById('highScore');

function init() {
  const high = localStorage.getItem('quiz_highscore') || 0;
  highScoreEl.textContent = high;

  currentIndex = 0; score = 0;
  qTotalEl.textContent = QUESTIONS.length;
  updateScore();
  showQuestion();
}

function showQuestion() {
  const item = QUESTIONS[currentIndex];
  qEl.textContent = item.q;
  optsEl.innerHTML = '';
  selected = null;
  nextBtn.disabled = true;
  qIndexEl.textContent = currentIndex+1;
  progressFill.style.width = Math.round((currentIndex/QUESTIONS.length)*100) + '%';

  item.choices.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = c;
    btn.dataset.idx = idx;
    btn.addEventListener('click', onSelect);
    optsEl.appendChild(btn);
  });
}

function onSelect(e) {
  if (selected !== null) return;
  selected = Number(e.currentTarget.dataset.idx);
  nextBtn.disabled = false;
}

function revealAnswer() {
  const item = QUESTIONS[currentIndex];
  [...optsEl.children].forEach((el) => {
    const idx = Number(el.dataset.idx);
    if(idx === item.answer) el.classList.add('correct');
    if(selected !== null && idx === selected && idx !== item.answer) el.classList.add('wrong');
  });
}

function nextQuestion() {
  const item = QUESTIONS[currentIndex];
  if(selected === item.answer) score += 10;
  updateScore();
  currentIndex++;
  if(currentIndex >= QUESTIONS.length) {
    endQuiz();
  } else {
    showQuestion();
  }
}

function updateScore() {
  scoreEl.textContent = score;
}

function endQuiz() {
  optsEl.innerHTML = `<div>Quiz finished — your score: <strong>${score}</strong></div>`;
  qEl.textContent = 'Well done!';
  progressFill.style.width = '100%';
  nextBtn.disabled = true; revealBtn.disabled = true;

  const prev = Number(localStorage.getItem('quiz_highscore') || 0);
  if(score > prev) {
    localStorage.setItem('quiz_highscore', score);
    highScoreEl.textContent = score;
  }
}

nextBtn.addEventListener('click', () => { revealAnswer(); setTimeout(nextQuestion, 700); });
revealBtn.addEventListener('click', revealAnswer);
restartBtn.addEventListener('click', () => { init(); revealBtn.disabled = false; nextBtn.disabled = true; });

init();
