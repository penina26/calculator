// ----Basic operations---
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        console.log("Error: cannot divide by zero");
        return null;
    }
    return a / b;
}

// --- History array ---
const calculations = [];

// --- Expression-based UI state ---
let displayValue = "0";
let expressionPrefix = "";
let justEvaluated = false;  // true right after pressing =
let openParens = 0;         // how many '(' not yet closed

// ---- Helpers to update the DOM ---
function updateDisplay() {
    const display = document.getElementById("display");
    display.textContent = displayValue;
}

function updateExpression() {
    const exprEl = document.getElementById("expression");

    // Full expression = prefix + current number (unless it's 0 at the start)
    const fullExpression =
        expressionPrefix +
        (displayValue === "0" && expressionPrefix !== "" ? "" : displayValue);

    exprEl.textContent = fullExpression;
}

function getFullExpression() {
    if (
        expressionPrefix === "" &&
        (displayValue === "0" || displayValue === "Error")
    ) {
        return "";
    }
    return expressionPrefix + displayValue;
}

// Evaluate a full expression string using JS precedence (BODMAS)
function evaluateExpression(expr) {
    // allow only digits, operators, dots, spaces, brackets
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        console.log("Invalid characters in expression");
        return null;
    }

    try {
        const result = Function("return " + expr)();
        return result;
    } catch (e) {
        console.log("Error evaluating expression:", e);
        return null;
    }
}

// ---- History list in the overlay ---
function updateHistoryList() {
    const list = document.getElementById("history-list");
    list.innerHTML = "";

    calculations.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.expression} = ${entry.result}`;
        list.appendChild(li);
    });
}

// ---Button handlers---

// Digits 0–9 
function pressDigit(digit) {
    if (displayValue === "Error" || justEvaluated) {
        // start a new expression after error or after =
        displayValue = digit;
        expressionPrefix = "";
        openParens = 0;
        justEvaluated = false;
    } else if (displayValue === "0") {
        displayValue = digit;
    } else {
        displayValue += digit;
    }

    updateDisplay();
    updateExpression();
}

// Decimal point .
function pressDot() {
    if (displayValue === "Error" || justEvaluated) {
        displayValue = "0.";
        expressionPrefix = "";
        openParens = 0;
        justEvaluated = false;
    } else if (!displayValue.includes(".")) {
        if (displayValue === "0") {
            displayValue = "0.";
        } else {
            displayValue += ".";
        }
    }

    updateDisplay();
    updateExpression();
}

// Backspace / ⌫ (only affects the current number)
function backspace() {
    if (displayValue === "Error" || justEvaluated) {
        displayValue = "0";
        expressionPrefix = "";
        openParens = 0;
        justEvaluated = false;
    } else if (displayValue.length <= 1) {
        displayValue = "0";
    } else {
        displayValue = displayValue.slice(0, -1);
    }

    updateDisplay();
    updateExpression();
}

// Left bracket '('
function pressLeftBracket() {
    if (displayValue === "Error" || justEvaluated) {
        // start fresh
        displayValue = "0";
        expressionPrefix = "";
        openParens = 0;
        justEvaluated = false;
    }

    // Just add '(' to the prefix
    expressionPrefix += "(";
    openParens += 1;

    updateExpression();
}

// Right bracket ')'
function pressRightBracket() {
    // only allow if we have an unmatched '('
    if (openParens <= 0) {
        return;
    }

    // If user has typed a number, commit it before closing
    if (
        displayValue !== "0" &&
        displayValue !== "Error" &&
        !justEvaluated
    ) {
        expressionPrefix += displayValue;
        displayValue = "0";
    }

    expressionPrefix += ")";
    openParens -= 1;

    updateDisplay();
    updateExpression();
}


// Operators +, -, *, /
function pressOperator(op) {
    if (displayValue === "Error") {
        return;
    }

    // If we just evaluated, treat the result as the starting number
    if (justEvaluated) {
        expressionPrefix = "";
        justEvaluated = false;
    }

    // If prefix is empty but there's a number on the display, start from it
    if (expressionPrefix === "") {
        expressionPrefix = displayValue;
    } else {
        // If the user just typed a number, add that number to the prefix
        if (!justEvaluated && displayValue !== "0") {
            expressionPrefix += displayValue;
        }
    }

    const OPS = "+-*/";
    const lastChar = expressionPrefix.slice(-1);

    // Replace last operator if the user changes their mind
    if (OPS.includes(lastChar)) {
        expressionPrefix = expressionPrefix.slice(0, -1) + op;
    } else {
        expressionPrefix += op;
    }

    displayValue = "0";
    updateDisplay();
    updateExpression();
}

// Equals = 
function pressEquals() {
    const expr = getFullExpression();
    if (!expr) return;

    // If brackets are still open, expression is incomplete
    if (openParens !== 0) {
        displayValue = "Error";
        expressionPrefix = "";
        openParens = 0;
        updateDisplay();
        updateExpression();
        return;
    }

    const result = evaluateExpression(expr);

    if (result === null || !isFinite(result)) {
        displayValue = "Error";
        expressionPrefix = "";
        openParens = 0;
        updateDisplay();
        updateExpression();
        return;
    }

    // Save in history
    const record = {
        expression: expr,
        result: result,
        timestamp: new Date().toLocaleString()
    };
    calculations.push(record);
    updateHistoryList();

    // Show result and allow chaining
    displayValue = String(result);
    expressionPrefix = "";
    openParens = 0;
    justEvaluated = true;

    updateDisplay();
    updateExpression();

    console.log("Expression:", expr, "=", result);
}

// --- History overlay controls ---
function showHistoryOverlay() {
    updateHistoryList();
    const overlay = document.getElementById("history-overlay");
    if (overlay) {
        overlay.classList.remove("hidden");
    }
}

function hideHistoryOverlay() {
    const overlay = document.getElementById("history-overlay");
    if (overlay) {
        overlay.classList.add("hidden");
    }
}

// --- Initial render ---
updateDisplay();
updateExpression();
hideHistoryOverlay();
