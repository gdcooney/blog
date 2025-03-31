
const quizMap = {
  '/quiz1': '/quiz/quiz1.json',
  '/quiz2': '/quiz/quiz2.json',
  '/quiz3': '/quiz/quiz3.json',
};

let quizData = [];

const path = window.location.pathname;
const container = document.getElementById('quiz-container');
const results = document.getElementById('quiz-results');
const scoreElem = document.getElementById('score');
const feedbackElem = document.getElementById('feedback');

let currentIndex = 0;
const userAnswers = [];

async function loadQuestions() {
  const res = await fetch(quizMap[path]);
  quizData = await res.json();
  renderQuestion(currentIndex);
}

function renderQuestion(index) {
  const q = quizData[index];
  container.innerHTML = '';

  const form = document.createElement('form');
  form.id = 'quiz-form';

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.className = 'text-xl font-semibold mb-4';
  legend.innerText = `Question ${index + 1} of ${quizData.length}: ${q.question}`;
  fieldset.appendChild(legend);

  q.options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'block mb-2';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = q.id;
    input.value = opt.value;
    input.required = true;
    label.appendChild(input);
    label.append(` ${opt.label}`);
    fieldset.appendChild(label);
  });

  form.appendChild(fieldset);

  const nextBtn = document.createElement('button');
  nextBtn.type = 'submit';
  nextBtn.innerText = index === quizData.length - 1 ? 'Submit' : 'Next';
  nextBtn.className = 'mt-4 bg-blue-600 text-white px-4 py-2 rounded';
  form.appendChild(nextBtn);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const selected = formData.get(q.id);
    userAnswers.push({ id: q.id, answer: selected });
    currentIndex++;
    if (currentIndex < quizData.length) {
      renderQuestion(currentIndex);
    } else {
      showResults();
    }
  });

  container.appendChild(form);
}

function showResults() {
  let score = 0;
  let valuesCorrect = true;
  const summary = document.createElement('div');
  summary.className = 'mt-6';

  userAnswers.forEach(user => {
    const q = quizData.find(q => q.id === user.id);
    const correctAnswer = q.correct;
    const isCorrect = user.answer === correctAnswer;
    if (isCorrect) score++;
    if (q.isValueQuestion && !isCorrect) valuesCorrect = false;

    if (!isCorrect) {
      const block = document.createElement('div');
      block.className = 'mb-4 p-4 border border-red-400 bg-red-50 rounded text-black';

      const questionEl = document.createElement('p');
      questionEl.className = 'font-semibold mb-1';
      questionEl.innerText = `❌ ${q.question}`;
      block.appendChild(questionEl);

      const userAnswerText = q.options.find(opt => opt.value === user.answer)?.label || "No answer";
      const correctAnswerText = q.options.find(opt => opt.value === correctAnswer)?.label || "Unknown";

      const userAnswerEl = document.createElement('p');
      userAnswerEl.innerHTML = `<strong>Your answer:</strong> ${userAnswerText}`;
      const correctAnswerEl = document.createElement('p');
      correctAnswerEl.innerHTML = `<strong>Correct answer:</strong> ${correctAnswerText}`;

      block.appendChild(userAnswerEl);
      block.appendChild(correctAnswerEl);

      summary.appendChild(block);
    }
  });

  const percentage = (score / quizData.length) * 100;
  scoreElem.innerText = `You scored ${score} out of ${quizData.length} (${percentage.toFixed(1)}%)`;

  let feedback = "";
  if (percentage >= 75 && valuesCorrect) {
    feedback = "🎉 Congratulations! You passed the quiz.";
  } else if (!valuesCorrect) {
    feedback = "❌ You missed one or more Australian values questions. These must be answered correctly to pass.";
  } else {
    feedback = "❌ You did not reach the required 75% score to pass. Try again.";
  }

  feedbackElem.innerText = feedback;
  results.appendChild(summary);
  results.classList.remove('hidden');
  results.classList.add('bg-white', 'shadow-lg', 'rounded', 'p-6', 'relative', 'z-10');
  container.classList.add('hidden');
}

loadQuestions();
