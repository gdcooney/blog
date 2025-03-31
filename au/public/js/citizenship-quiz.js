
import quizData from '/src/quiz-data/questions.json';

const container = document.getElementById('quiz-container');
const results = document.getElementById('quiz-results');
const scoreElem = document.getElementById('score');
const feedbackElem = document.getElementById('feedback');

const valuesQuestions = quizData
  .filter(q => q.isValueQuestion)
  .map(q => q.id);

const form = document.createElement('form');
form.id = 'quiz-form';

quizData.forEach((q, idx) => {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.innerText = `${idx + 1}. ${q.question}`;
  fieldset.appendChild(legend);

  q.options.forEach((opt) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = q.id;
    input.value = opt.value;
    label.appendChild(input);
    label.append(` ${opt.label}`);
    fieldset.appendChild(label);
    fieldset.appendChild(document.createElement('br'));
  });

  form.appendChild(fieldset);
});

const submit = document.createElement('button');
submit.type = 'submit';
submit.innerText = 'Submit Quiz';
form.appendChild(submit);

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(form);
  let score = 0;
  let valuesCorrect = true;

  quizData.forEach(q => {
    const userAnswer = formData.get(q.id);
    if (userAnswer === q.correct) score++;
    if (q.isValueQuestion && userAnswer !== q.correct) valuesCorrect = false;
  });

  const percentage = (score / quizData.length) * 100;
  scoreElem.innerText = `You scored ${score} out of ${quizData.length} (${percentage.toFixed(1)}%)`;

  let feedback = "";
  if (percentage >= 75 && valuesCorrect) {
    feedback = "🎉 Congratulations! You passed the quiz.";
  } else if (!valuesCorrect) {
    feedback = "❌ You missed one or more Australian values questions.";
  } else {
    feedback = "❌ You did not reach the 75% score to pass.";
  }

  feedbackElem.innerText = feedback;
  results.style.display = 'block';
  container.style.display = 'none';
});

container.innerHTML = '';
container.appendChild(form);
