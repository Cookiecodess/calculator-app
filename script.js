let accumulator = 0;
let currentNumberString = "0";
let lastNumberString = "0";
// let currentNumber = accumulator;
let currentOperator = null;
let lastOperator = null;

const CalcState = {
    INITIAL: 'INITIAL',
    HAS_FIRST_OPERAND: 'HAS_FIRST_OPERAND',
    OPERATOR_SET: 'OPERATOR_SET',
    HAS_SECOND_OPERAND: 'HAS_SECOND_OPERAND',
    RESULT: 'RESULT',
};
let calcState = CalcState.INITIAL;

const allButtons = document.querySelectorAll(".btn");
const operatorBtnArray = document.querySelectorAll(".operator");
const numberBtnArray = document.querySelectorAll(".number");
const percentBtn = document.getElementById("percent-btn");
const flipSignBtn = document.getElementById("flip-sign-btn");
const clearOrAllClearBtn = document.getElementById("clear-or-all-clear-btn");
const equalBtn = document.getElementById("equal-btn");
const calculatorDisplay = document.getElementById("calculator-display");

function typeNumber(char) {
    // prevent multiple dots
    if (currentNumberString.includes('.') && char === '.') {
        return
    }

    if (calcState === CalcState.INITIAL) {
        calcState = CalcState.HAS_FIRST_OPERAND;
    } else if (calcState === CalcState.OPERATOR_SET) {
        calcState = CalcState.HAS_SECOND_OPERAND;
    } else if (calcState === CalcState.RESULT) {
        calcState = CalcState.HAS_FIRST_OPERAND;
        accumulator = 0 // if type number at RESULT state (after pressing equal), reset accumulator
    }

    if (currentNumberString === "0" && char !== '.') {
        // replace "0" with typed number if not '.'
        currentNumberString = char;
    } else {
        currentNumberString += char;
    }

    calculatorDisplay.innerText = currentNumberString;

    if (calcState === CalcState.HAS_FIRST_OPERAND) {
        // for first operand, the number being types
        // becomes the accumulator immediately
        accumulator = parseFloat(currentNumberString);
    }
}

function add(numString) {
    accumulator += parseFloat(numString);
}

function subtract(numString) {
    accumulator -= parseFloat(numString);
}

function multiply(numString) {
    accumulator *= parseFloat(numString);
}

function divide(numString) {
    accumulator /= parseFloat(numString);
}

// function pow(num1, num2) {
//     return num1 ** num2;
// }

function calcPercent() {
    accumulator = currentNumberString = parseFloat(currentNumberString) / 100;
    calculatorDisplay.innerText = accumulator;
}

function flipSign() {
    accumulator *= -1;
    calculatorDisplay.innerText = accumulator;
}

const operatorFuncObj = {
    add,
    subtract,
    multiply,
    divide
}

function clear() {
    currentNumberString = "0";
    calculatorDisplay.innerText = "0";
}

function allClear() {
    accumulator = 0;
    currentOperator = null;
    calculatorDisplay.innerText = "0";
}


function calculate() {
    // handle special case where equal button is clicked
    // when currentOperator is still null (no operator
    // has yet been selected since the start of the app)
    if (!currentOperator) {
        accumulator = parseFloat(currentNumberString);
        return;
    } 

    

    const operation = operatorFuncObj[currentOperator];
    operation(
        currentNumberString === "0" // bug here
            ? lastNumberString 
            : currentNumberString
    );
    calculatorDisplay.innerText = accumulator;

    lastNumberString = currentNumberString;
    lastOperator = currentOperator;
    currentNumberString = "0";
    currentOperator = null;
    
}

function setOperator(operationName) {
    let isValidOperation = false;
    for (const validOperation in operatorFuncObj) {
        if (operationName === validOperation) {
            isValidOperation = true;
        }
    }
    if (!isValidOperation) return;

    operatorBtnArray.forEach((btn) => {
        if (btn.id === operationName) {
            btn.classList.add("selected");
        } else {
            // deselect the other operator buttons
            btn.classList.remove("selected");
        }
    });

    currentOperator = operationName;
}

/**
 * Visually deselect all operators AND set currentOperator to null
 */ 
function clearOperator() {
    operatorBtnArray.forEach((btn) => {
        btn.classList.remove("selected");
    });

    currentOperator = null;
}

/**
 * Visually deselect all operators.
 */
function deselectAllOperators() {
    operatorBtnArray.forEach((btn) => {
        btn.classList.remove("selected");
    });
}

function getCurrentOperatorButtonEl() {
    let toReturn;
    operatorBtnArray.forEach((btn) => {
        if (btn.id === currentOperator) {
            toReturn = btn;
            return; // reminder: this returns out of the anonymous callback function, not the outer function.
        } 
    });
    return toReturn;
}
// function updateDisplayScreen() {
//     calculatorDisplay.innerText = accumulator;
// }


operatorBtnArray.forEach((btn) => btn.addEventListener("click", (e) => {
    
    const operation = e.target.id;

    if (calcState === CalcState.HAS_SECOND_OPERAND) {
        // calculate
        calculate();

        // set new operator
        currentOperator = operation;

    }

    if (!accumulator) {
        accumulator = parseFloat(currentNumberString);
        currentNumberString = "0";
    } else {
        currentNumberString = "0";
    }

    setOperator(operation);

    calcState = CalcState.OPERATOR_SET;


    
    // btn.classList.add("selected");
    // // deselect the other operator buttons
    // operatorBtnArray.forEach((innerBtn) => {
    //     if (innerBtn !== btn) {
    //         innerBtn.classList.remove("selected");
    //     }
    // });

    // if (!accumulator) {
    //     accumulator = parseFloat(currentNumberString);
    //     currentNumberString = "0";
    // } else {
    //     calculate();
    // }

    // currentOperator = btn.dataset.operation;
}));

numberBtnArray.forEach((btn) => btn.addEventListener("click", (e) => {
    const numberChar = e.target.innerText;
    typeNumber(numberChar);

    if (numberChar !== "0") clearOrAllClearBtn.innerText = "C";
}))

equalBtn.addEventListener("click", (e) => {
    if (calcState !== CalcState.HAS_SECOND_OPERAND && calcState !== CalcState.OPERATOR_SET /* this second condition is important. see the next IF block for more details */) {
        // if equal button is pressed when there
        // isn't a second operand OR an operator set, 
        // repeat the last operation
        const operation = operatorFuncObj[lastOperator];
        operation(lastNumberString);
        calculatorDisplay.innerText = accumulator;
        return;
    } 
    if (calcState === CalcState.OPERATOR_SET) {
        // if the equal button is pressed
        // when an operator is set,
        // the iOS 17 Calculator app's behavior
        // in tihs situation is followed:
        // take the accumulator and carry out the
        // latest specified operation ON ITSELF.
        //
        // I'm aware that this behavior may not be
        // a deliberate intent on the Apple developer's
        // part, but rather a byproduct of their existing
        // code, since I suppose this order of pressing 
        // buttons ('=' right after an operator) doesn't 
        // really count as a main or essential
        // use case -- most users that do this probably do it 
        // accidentally. At the time of writing this, I honestly
        // don't have my own opinion about what behavior
        // is most reasonable in this scenario, and
        // since this project is modeled after the iOS
        // calculator anyway, I decided to just follow
        // its behavior.
        currentNumberString = String(accumulator);
    }

    calculate();
    clearOperator(); 
    calcState = CalcState.RESULT;
}) 

clearOrAllClearBtn.addEventListener("click", (e) => {
    switch (calcState) {
        case CalcState.RESULT:
            accumulator = 0;
            calcState = CalcState.OPERATOR_SET;
    }
    if (clearOrAllClearBtn.innerText === "C") {
        // clear

        currentNumberString = "0";
        calculatorDisplay.innerText = "0";

        calcState = CalcState.OPERATOR_SET;
        clearOrAllClearBtn.innerText = "AC";
    } else {
        // all clear

        accumulator = 0;
        currentOperator = null;
        lastOperator = null;
        lastNumberString = "0";

        calculatorDisplay.innerText = "0";
        deselectAllOperators();

        calcState = CalcState.INITIAL;
    }
})

percentBtn.addEventListener("click", (e) => {
    calcPercent();
});

flipSignBtn.addEventListener("click", flipSign);

// UI updater
// runs after all other individual-button event listeners have run
allButtons.forEach((btn) => btn.addEventListener("click", (e) => {
    if (calcState === CalcState.OPERATOR_SET) {
        setOperator(currentOperator);
    } else if (calcState === CalcState.HAS_SECOND_OPERAND) {
        const currentOperatorButtonEl = getCurrentOperatorButtonEl();
        currentOperatorButtonEl.classList.remove("selected");
    } else if (calcState === CalcState.RESULT) {
        deselectAllOperators();
    }

    console.log(calcState)
    console.log(currentOperator)
}));

// Read keyboard inputs
document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (parseFloat(key) || key === '.') {
        typeNumber(key);
    }
    // else if (key === "Backspace") {
    //     currentNumberString = currentNumberString.slice(0, -1); // remove last number
    // }
})