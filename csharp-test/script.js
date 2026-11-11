const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8npd5PH-JqcPEX01dohhKinidbrVP4fr54wavJztgJf6Ym31G5x5UMoZbD-yvfhFeAvBnn3YrJWlj/pub?gid=0&single=true&output=tsv';

const STORAGE_KEY = 'csharpTestProgress';

const TEST_DURATION = 10 * 60;

let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = TEST_DURATION;
let timerInterval = null;
let testFinished = false;


// Получение элементов страницы
const questionContainer = document.getElementById('questionContainer');
const questionCounter = document.getElementById('questionCounter');
const progressBar = document.getElementById('progressBar');
const timerElement = document.getElementById('timer');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const resultElement = document.getElementById('result');


// Перемешивание массива по алгоритму Фишера — Йетса
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


// Парсинг TSV
function parseTSV(text) {
    const rows = text.trim().split(/\r?\n/);

    return rows.slice(1)
        .filter(row => row.trim() !== '')
        .map(row => {
            const columns = row.split('\t');

            if (columns.length < 8) {
                return null;
            }

            const correctAnswer = Number(columns[7].trim());

            if (
                !Number.isInteger(correctAnswer) ||
                correctAnswer < 1 ||
                correctAnswer > 4
            ) {
                return null;
            }

            const options = columns.slice(3, 7).map(value => value.trim());

            if (options.some(option => !option)) {
                return null;
            }

            const answers = options.map((text, index) => ({
                text,
                correct: index === correctAnswer - 1
            }));

            shuffleArray(answers);

            return {
                topic: columns[1].trim(),
                question: columns[2].trim(),
                answers
            };
        })
        .filter(question =>
            question &&
            question.topic &&
            question.question
        );
}


// Загрузка вопросов из Google Таблиц
async function loadQuestions() {
    questionContainer.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary"></div>
            <p class="mt-3">Загружаем вопросы...</p>
        </div>
    `;

    try {
        if (SHEET_URL === 'ВСТАВЬ_ССЫЛКУ_НА_TSV') {
            throw new Error('Не указана ссылка на Google Таблицу.');
        }

        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error('Ошибка сервера: ' + response.status);
        }

        const text = await response.text();

        const loadedQuestions = parseTSV(text);

        if (loadedQuestions.length === 0) {
            throw new Error('В таблице не найдено корректных вопросов.');
        }

        questions = loadedQuestions;

        shuffleArray(questions);

        userAnswers = new Array(questions.length).fill(null);

        currentQuestion = 0;
        timeLeft = TEST_DURATION;
        testFinished = false;

        resultElement.innerHTML = '';

        localStorage.removeItem(STORAGE_KEY);

        saveProgress();

        renderQuestion();
        startTimer();

    } catch (error) {
        console.error('Ошибка загрузки:', error);

        clearInterval(timerInterval);

        questionCounter.textContent = 'Ошибка загрузки';

        questionContainer.innerHTML = `
            <div class="alert alert-danger">
                <h5>Не удалось загрузить вопросы</h5>
                <p class="mb-0">
                    Проверьте подключение к интернету и доступность Google Таблицы.
                </p>
                <p class="small mt-2 mb-0">
                    ${error.message}
                </p>
                <button class="btn btn-danger mt-3" onclick="loadQuestions()">
                    Повторить
                </button>
            </div>
        `;

        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }
}


// Отображение вопроса
function renderQuestion() {
    if (testFinished) return;

    const question = questions[currentQuestion];

    questionCounter.textContent =
        `Вопрос ${currentQuestion + 1} из ${questions.length}`;

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width = `${progress}%`;

    let html = `
        <div class="question-title">
            <span class="badge bg-secondary mb-2">
                ${escapeHTML(question.topic)}
            </span>

            <p class="mt-2">
                ${escapeHTML(question.question)}
            </p>
        </div>
    `;

    question.answers.forEach((answer, index) => {
        const selected = userAnswers[currentQuestion] === index;

        html += `
            <button
                class="btn answer-option ${
                    selected ? 'selected' : 'btn-outline-primary'
                }"
                onclick="selectAnswer(${index})"
            >
                ${index + 1}. ${escapeHTML(answer.text)}
            </button>
        `;
    });

    questionContainer.innerHTML = html;

    prevBtn.disabled = currentQuestion === 0;

    nextBtn.disabled = userAnswers[currentQuestion] === null;

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? 'Завершить тест'
            : 'Далее';
}


// Защита отображаемого текста
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const symbols = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return symbols[character];
    });
}


// Выбор ответа
function selectAnswer(index) {
    if (testFinished) return;

    userAnswers[currentQuestion] = index;

    saveProgress();

    renderQuestion();
}


// Следующий вопрос
function nextQuestion() {
    if (userAnswers[currentQuestion] === null) return;

    if (currentQuestion === questions.length - 1) {
        finishTest();
        return;
    }

    currentQuestion++;

    saveProgress();

    renderQuestion();
}


// Предыдущий вопрос
function previousQuestion() {
    if (currentQuestion === 0) return;

    currentQuestion--;

    saveProgress();

    renderQuestion();
}


// Сохранение прогресса
function saveProgress() {
    if (!questions.length || testFinished) return;

    try {
        const data = {
            questions,
            currentQuestion,
            userAnswers,
            timeLeft
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    } catch (error) {
        console.error('Не удалось сохранить прогресс:', error);
    }
}


// Восстановление прогресса
function restoreProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return false;

        const data = JSON.parse(saved);

        if (
            !Array.isArray(data.questions) ||
            !Array.isArray(data.userAnswers) ||
            data.questions.length === 0 ||
            data.userAnswers.length !== data.questions.length ||
            !Number.isInteger(data.currentQuestion) ||
            data.currentQuestion < 0 ||
            data.currentQuestion >= data.questions.length ||
            !Number.isFinite(data.timeLeft) ||
            data.timeLeft <= 0
        ) {
            throw new Error('Некорректные сохранённые данные');
        }

        const validQuestions = data.questions.every(question =>
            typeof question.question === 'string' &&
            typeof question.topic === 'string' &&
            Array.isArray(question.answers) &&
            question.answers.length === 4 &&
            question.answers.filter(answer => answer.correct === true).length === 1 &&
            question.answers.every(answer => typeof answer.text === 'string')
        );

        const validAnswers = data.userAnswers.every((answer, index) =>
            answer === null ||
            (
                Number.isInteger(answer) &&
                answer >= 0 &&
                answer < 4
            )
        );

        if (!validQuestions || !validAnswers) {
            throw new Error('Некорректные данные теста');
        }

        questions = data.questions;
        currentQuestion = data.currentQuestion;
        userAnswers = data.userAnswers;
        timeLeft = Math.min(data.timeLeft, TEST_DURATION);

        return true;

    } catch (error) {
        console.error('Ошибка восстановления:', error);

        localStorage.removeItem(STORAGE_KEY);

        return false;
    }
}


// Таймер
function startTimer() {
    clearInterval(timerInterval);

    updateTimer();

    timerInterval = setInterval(() => {
        timeLeft--;

        updateTimer();

        saveProgress();

        if (timeLeft <= 0) {
            finishTest();
        }

    }, 1000);
}


// Обновление времени
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeLeft <= 60) {
        timerElement.classList.remove('bg-primary');
        timerElement.classList.add('bg-danger');
    } else {
        timerElement.classList.remove('bg-danger');
        timerElement.classList.add('bg-primary');
    }
}


// Завершение теста
function finishTest() {
    if (testFinished) return;

    testFinished = true;

    clearInterval(timerInterval);

    let score = 0;

    questions.forEach((question, index) => {
        const selected = userAnswers[index];

        if (
            selected !== null &&
            question.answers[selected].correct
        ) {
            score++;
        }
    });

    const percentage = Math.round((score / questions.length) * 100);

    questionCounter.textContent = 'Тест завершён';

    progressBar.style.width = '100%';

    questionContainer.innerHTML = '';

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    resultElement.innerHTML = `
        <div class="alert alert-success py-4">
            <h3>Тест завершён!</h3>

            <p class="result-score">
                ${score} из ${questions.length}
            </p>

            <p class="mb-3">
                Правильных ответов: ${percentage}%
            </p>

            <button
                class="btn btn-primary"
                onclick="restartTest()"
            >
                Пройти заново
            </button>
        </div>
    `;

    localStorage.removeItem(STORAGE_KEY);
}


// Перезапуск теста
function restartTest() {
    loadQuestions();
}


// Обработчики кнопок
prevBtn.addEventListener('click', previousQuestion);

nextBtn.addEventListener('click', nextQuestion);


// Запуск приложения
async function initializeTest() {
    try {
        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error('Ошибка загрузки таблицы');
        }

        const text = await response.text();

        const loadedQuestions = parseTSV(text);

        if (loadedQuestions.length === 0) {
            throw new Error('В таблице нет вопросов');
        }

        const restored = restoreProgress();

        if (restored) {
            const continueTest = confirm(
                'Найден сохранённый прогресс. Продолжить тест?'
            );

            if (!continueTest) {
                localStorage.removeItem(STORAGE_KEY);

                questions = loadedQuestions;

                shuffleArray(questions);

                userAnswers = new Array(questions.length).fill(null);

                currentQuestion = 0;

                timeLeft = TEST_DURATION;
            }

        } else {
            questions = loadedQuestions;

            shuffleArray(questions);

            userAnswers = new Array(questions.length).fill(null);

            currentQuestion = 0;

            timeLeft = TEST_DURATION;
        }

        renderQuestion();

        startTimer();

    } catch (error) {
        console.error(error);

        questionCounter.textContent = 'Ошибка загрузки';

        questionContainer.innerHTML = `
            <div class="alert alert-danger">
                <h5>Не удалось загрузить вопросы</h5>

                <p>
                    Проверьте подключение к интернету и настройки
                    публикации Google Таблицы.
                </p>

                <button
                    class="btn btn-danger"
                    onclick="initializeTest()"
                >
                    Повторить
                </button>
            </div>
        `;
    }
}


// Проверка ссылки перед запуском
if (SHEET_URL === 'ВСТАВЬ_ССЫЛКУ_НА_TSV') {
    questionContainer.innerHTML = `
        <div class="alert alert-warning">
            Необходимо указать ссылку на опубликованную Google Таблицу
            в файле script.js.
        </div>
    `;
} else {
    initializeTest();
}