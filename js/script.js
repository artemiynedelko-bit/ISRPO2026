function showInformation() {
    let name = "Артемий Неделько";
    let group = "ИС-3.2";

    console.log("Привет, мир!");
    console.log(`Студент: ${name}`);
    console.log(`Группа: ${group}`);

    document.getElementById("informationResult").textContent =
        `Привет, мир!\nСтудент: ${name}\nГруппа: ${group}`;
}

function enterUserData() {
    let name = prompt("Введите ваше имя:");

    if (name === null || name.trim() === "") {
        return;
    }

    let age = prompt("Введите ваш возраст:");

    if (age === null || age.trim() === "") {
        return;
    }

    console.log("Имя:", name);
    console.log("Возраст:", age);
    console.log("Тип имени:", typeof name);
    console.log("Тип возраста:", typeof age);

    document.getElementById("userResult").textContent =
        `Привет, ${name}!\nТебе ${age} лет.\nТип имени: ${typeof name}\nТип возраста: ${typeof age}`;
}

function checkAge() {
    let input = prompt("Введите ваш возраст:");

    if (input === null || input.trim() === "") {
        return;
    }

    let age = Number(input);

    if (!Number.isInteger(age) || age < 0) {
        alert("Введите корректный возраст.");
        return;
    }

    let message;

    if (age < 7) {
        message = "Вы ещё слишком юны.";
    } else if (age < 18) {
        message = "Вы несовершеннолетний.";
    } else {
        message = "Вы совершеннолетний.";
    }

    console.log(message);

    document.getElementById("ageResult").textContent = message;
}

function runLoop() {
    let input = prompt("Введите число N:");

    if (input === null || input.trim() === "") {
        return;
    }

    let n = Number(input);

    if (!Number.isInteger(n) || n < 1) {
        alert("Введите целое положительное число.");
        return;
    }

    let allNumbers = [];
    let evenNumbers = [];

    for (let i = 1; i <= n; i++) {
        allNumbers.push(i);
    }

    for (let i = 2; i <= n; i += 2) {
        evenNumbers.push(i);
    }

    console.log("Все числа:", allNumbers);
    console.log("Чётные числа:", evenNumbers);

    document.getElementById("loopResult").textContent =
        `Все числа:\n${allNumbers.join(", ")}\n\nЧётные числа:\n${evenNumbers.join(", ")}`;
}

function isEven(x) {
    return x % 2 === 0;
}

function checkEven() {
    let input = document.getElementById("evenNumber").value;

    if (input === "") {
        alert("Введите число.");
        return;
    }

    let number = Number(input);

    let result = isEven(number)
        ? "Число чётное."
        : "Число нечётное.";

    console.log(result);

    document.getElementById("evenResult").textContent = result;
}

function compareEquality() {
    let firstComparison = (5 == "5");
    let secondComparison = (5 === "5");

    console.log("5 == '5':", firstComparison);
    console.log("5 === '5':", secondComparison);

    document.getElementById("equalityResult").textContent =
        `5 == "5": ${firstComparison}\n5 === "5": ${secondComparison}\n\nОператор == допускает преобразование типов.\nОператор === сравнивает значения и их типы.`;
}

function calculate() {
    let a = Number(document.getElementById("number1").value);
    let b = Number(document.getElementById("number2").value);

    let operator = document.getElementById("operator").value;

    if (
        document.getElementById("number1").value === "" ||
        document.getElementById("number2").value === ""
    ) {
        alert("Введите оба числа.");
        return;
    }

    let result;

    switch (operator) {
        case "+":
            result = a + b;
            break;

        case "-":
            result = a - b;
            break;

        case "*":
            result = a * b;
            break;

        case "/":
            if (b === 0) {
                alert("На ноль делить нельзя.");
                return;
            }
            result = a / b;
            break;
    }

    console.log("Результат:", result);
    console.log("Тип результата:", typeof result);

    document.getElementById("calculatorResult").textContent =
        `Результат: ${result}\nТип результата: ${typeof result}`;
}


function multiplicationTable() {
    let input = document.getElementById("multiplicationNumber").value;

    if (input === "") {
        alert("Введите число.");
        return;
    }

    let number = Number(input);
    let result = [];

    for (let i = 1; i <= 10; i++) {
        result.push(`${number} × ${i} = ${number * i}`);
    }

    console.log(result.join("\n"));

    document.getElementById("multiplicationResult").textContent =
        result.join("\n");
}

function calculateSum() {
    let input = document.getElementById("sumNumber").value;

    if (input === "") {
        alert("Введите число.");
        return;
    }

    let n = Number(input);

    if (!Number.isInteger(n) || n < 1) {
        alert("Введите целое положительное число.");
        return;
    }

    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    console.log("Сумма чисел:", sum);

    document.getElementById("sumResult").textContent =
        `Сумма чисел от 1 до ${n} равна ${sum}.`;
}