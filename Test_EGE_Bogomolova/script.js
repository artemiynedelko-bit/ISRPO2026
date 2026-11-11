// Массив правильных ответов. Индекс массива соответствует номеру задания - 1.
const answers = [60];

const checkButton = document.getElementById('checkButton');
const resetButton = document.getElementById('resetButton');
const scoreElement = document.getElementById('score');
const questionFeedback = document.getElementById('questionFeedback');

function Check() {
    let score = 0;

    for (let i = 1; i <= answers.length; i++) {
        const question = document.getElementById('q' + i);
        const answerInput = document.getElementById('a' + i);
        const userAnswer = answerInput.value.trim();

        question.classList.remove('correct', 'incorrect');

        if (userAnswer !== '' && Number(userAnswer) === answers[i - 1]) {
            question.classList.add('correct');
            score++;
        } else {
            question.classList.add('incorrect');
        }
    }

    scoreElement.textContent = score;

    if (score === answers.length) {
        questionFeedback.textContent = 'Верно! Отличная работа.';
        questionFeedback.className = 'feedback success';
    } else {
        questionFeedback.textContent = 'Есть ошибка. Проверьте вычисления и попробуйте ещё раз.';
        questionFeedback.className = 'feedback error';
    }
}

function resetTest() {
    for (let i = 1; i <= answers.length; i++) {
        document.getElementById('a' + i).value = '';
        document.getElementById('q' + i).classList.remove('correct', 'incorrect');
    }

    scoreElement.textContent = '0';
    questionFeedback.textContent = '';
    questionFeedback.className = 'feedback';
}

function RND(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RandomArray(n) {
    const numbers = [];

    for (let i = 0; i < n; i++) {
        numbers.push(RND(1, 100));
    }

    return numbers;
}

function startGuessingGame() {
    const secretNumber = RND(1, 100);
    let attempts = 0;
    let guessed = false;

    while (!guessed) {
        const input = prompt('Введите целое число от 1 до 100:');

        if (input === null) {
            document.getElementById('guessFeedback').textContent =
                'Игра отменена. Попробуйте запустить её снова.';
            return;
        }

        const guess = Number(input);

        if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
            alert('Введите целое число от 1 до 100.');
            continue;
        }

        attempts++;

        if (guess < secretNumber) {
            alert('Загаданное число больше.');
        } else if (guess > secretNumber) {
            alert('Загаданное число меньше.');
        } else {
            guessed = true;
            alert('Вы угадали!');
        }
    }

    document.getElementById('guessFeedback').textContent =
        `Число угадано за ${attempts} попыток.`;
}

// Обработчики событий назначаются из JavaScript, а не через onclick в HTML.
checkButton.addEventListener('click', Check);
resetButton.addEventListener('click', resetTest);

document.getElementById('guessButton').addEventListener('click', startGuessingGame);

document.getElementById('arrayButton').addEventListener('click', () => {
    const generated = RandomArray(5);
    document.getElementById('randomArray').textContent = generated.join(', ');
});
