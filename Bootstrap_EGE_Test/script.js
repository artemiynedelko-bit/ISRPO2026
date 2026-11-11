const answers = ['60', '10', '1024'];
const storageKey = 'bootstrapEgeTestAnswers';

const checkButton = document.getElementById('checkBtn');
const saveButton = document.getElementById('saveBtn');
const loadButton = document.getElementById('loadBtn');
const resetButton = document.getElementById('resetBtn');

function getUserAnswers() {
  return answers.map((_, index) => {
    const input = document.getElementById(`a${index + 1}`);
    return input.value.trim();
  });
}

function showStatus(message, type = 'info') {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `alert alert-${type} mt-3 mb-0`;
}

function checkAnswers() {
  const userAnswers = getUserAnswers();
  let score = 0;

  answers.forEach((correctAnswer, index) => {
    const question = document.getElementById(`q${index + 1}`);
    const isCorrect = userAnswers[index] === correctAnswer;

    question.classList.toggle('correct', isCorrect);
    question.classList.toggle('incorrect', !isCorrect);

    if (isCorrect) score++;
  });

  document.getElementById('score').textContent = score;
  document.getElementById('scoreText').textContent =
    score === answers.length ? 'Отличный результат! Все ответы верны.' : 'Проверьте задания с красной отметкой.';

  showStatus(`Правильных ответов: ${score} из ${answers.length}.`, score === answers.length ? 'success' : 'warning');
}

function saveAnswers() {
  const data = {
    answers: getUserAnswers(),
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    showStatus('Ответы сохранены в браузере.', 'success');
  } catch (error) {
    showStatus('Не удалось сохранить ответы. Возможно, хранилище браузера недоступно.', 'danger');
  }
}

function loadAnswers() {
  try {
    const rawData = localStorage.getItem(storageKey);

    if (!rawData) {
      showStatus('Сохранённых ответов пока нет.', 'warning');
      return;
    }

    const data = JSON.parse(rawData);

    if (!data || !Array.isArray(data.answers) || data.answers.length !== answers.length) {
      throw new Error('Некорректный формат сохранённых данных');
    }

    data.answers.forEach((answer, index) => {
      document.getElementById(`a${index + 1}`).value = String(answer ?? '');
    });

    showStatus('Сохранённые ответы загружены.', 'success');
  } catch (error) {
    showStatus('Не удалось прочитать сохранение: данные повреждены. Очистите сохранение и попробуйте снова.', 'danger');
  }
}

function resetTest() {
  answers.forEach((_, index) => {
    document.getElementById(`a${index + 1}`).value = '';
    const question = document.getElementById(`q${index + 1}`);
    question.classList.remove('correct', 'incorrect');
  });

  document.getElementById('score').textContent = '—';
  document.getElementById('scoreText').textContent = 'Ответьте на вопросы и нажмите «Проверить ответы».';
  showStatus('Поля очищены. Сохранённые в браузере ответы не удалены.', 'secondary');
}

checkButton.addEventListener('click', checkAnswers);
saveButton.addEventListener('click', saveAnswers);
loadButton.addEventListener('click', loadAnswers);
resetButton.addEventListener('click', resetTest);
