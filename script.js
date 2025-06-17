let accumulator = 0;
let currentNumberString = "0";
let lastNumberString = "0";
// let currentNumber = accumulator;
let currentOperator = null;

const operatorBtnArray = document.querySelectorAll(".operator");
const numberBtnArray = document.querySelectorAll(".number");
const equalBtn = document.getElementById("equal-btn");
const calculatorDisplay = document.getElementById("calculator-display");

function typeNumber(char) {
    // prevent multiple dots
    if (currentNumberString.includes('.') && char === '.') {
        return
    }

    if (currentNumberString === "0" && char !== '.') {
        // replace "0" with typed number if not '.'
        currentNumberString = char;
    } else {
        currentNumberString += char;
    }

    calculatorDisplay.innerText = currentNumberString;
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

function perCent() {
    accumulator /= 100;
}

function flipSign() {
    accumulator *= -1;
}

const operatorFuncObj = {
    add,
    subtract,
    multiply,
    divide
}

function clear() {
    currentNumberString = "0";
}

function allClear() {
    accumulator = 0;
    currentOperator = null;
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
        currentNumberString === "0" 
            ? lastNumberString 
            : currentNumberString
    );
    calculatorDisplay.innerText = accumulator;

    lastNumberString = currentNumberString;
    currentNumberString = "0";
    
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

function clearOperator() {
    operatorBtnArray.forEach((btn) => {
        btn.classList.remove("selected");
    });

    currentOperator = null;
}

// function updateDisplayScreen() {
//     calculatorDisplay.innerText = accumulator;
// }


operatorBtnArray.forEach((btn) => btn.addEventListener("click", (e) => {
    if (!accumulator) {
        accumulator = parseFloat(currentNumberString);
        currentNumberString = "0";
    } else {
        currentNumberString = "0";
    }

    setOperator(e.target.id);


    
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
}))

equalBtn.addEventListener("click", (e) => {
    calculate();
    clearOperator();
})
