import { backend } from 'declarations/backend';

const result = document.getElementById('result');
const buttons = document.querySelectorAll('button');
const loading = document.getElementById('loading');

let currentInput = '';
let currentOperator = '';
let waitingForSecondOperand = false;

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.textContent));
});

async function handleButtonClick(value) {
    if (value >= '0' && value <= '9' || value === '.') {
        handleNumber(value);
    } else if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
    } else if (value === '=') {
        await handleEquals();
    } else if (value === 'C') {
        handleClear();
    }
    updateDisplay();
}

function handleNumber(num) {
    if (waitingForSecondOperand) {
        currentInput = num;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
}

function handleOperator(op) {
    if (currentOperator && !waitingForSecondOperand) {
        handleEquals();
    }
    currentOperator = op;
    waitingForSecondOperand = true;
}

async function handleEquals() {
    if (currentOperator && !waitingForSecondOperand) {
        const [leftOperand, rightOperand] = currentInput.split(currentOperator);
        if (leftOperand && rightOperand) {
            loading.style.display = 'block';
            try {
                let calculationResult;
                switch (currentOperator) {
                    case '+':
                        calculationResult = await backend.add(parseFloat(leftOperand), parseFloat(rightOperand));
                        break;
                    case '-':
                        calculationResult = await backend.subtract(parseFloat(leftOperand), parseFloat(rightOperand));
                        break;
                    case '*':
                        calculationResult = await backend.multiply(parseFloat(leftOperand), parseFloat(rightOperand));
                        break;
                    case '/':
                        calculationResult = await backend.divide(parseFloat(leftOperand), parseFloat(rightOperand));
                        break;
                }
                currentInput = calculationResult.toString();
                currentOperator = '';
                waitingForSecondOperand = true;
            } catch (error) {
                currentInput = 'Error';
            } finally {
                loading.style.display = 'none';
            }
        }
    }
}

function handleClear() {
    currentInput = '0';
    currentOperator = '';
    waitingForSecondOperand = false;
}

function updateDisplay() {
    result.value = currentInput;
}

updateDisplay();
