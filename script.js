const previousOperand = document.querySelector("#previous-operand");
const currentOperand = document.querySelector("#current-operand");

let currentValue = "0";
let previousValue = "";
let operation = null;
let justCalculated = false;

function formatNumber(value) {
  if (value === "Error") return value;

  const number = Number(value);
  if (!Number.isFinite(number)) return "Error";

  return number.toLocaleString("en-US", {
    maximumFractionDigits: 10,
    useGrouping: false
  });
}

function updateDisplay() {
  currentOperand.textContent = formatNumber(currentValue);
  previousOperand.textContent = previousValue && operation
    ? `${formatNumber(previousValue)} ${operation}`
    : "";
}

function appendNumber(number) {
  if (justCalculated) {
    currentValue = "0";
    justCalculated = false;
  }

  if (number === "." && currentValue.includes(".")) return;
  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function chooseOperation(nextOperation) {
  if (currentValue === "Error") clear();

  if (operation && previousValue !== "" && !justCalculated) {
    calculate();
  }

  operation = nextOperation;
  previousValue = currentValue;
  currentValue = "0";
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (!operation || previousValue === "") return;

  const left = Number(previousValue);
  const right = Number(currentValue);
  let result;

  switch (operation) {
    case "+": result = left + right; break;
    case "−": result = left - right; break;
    case "×": result = left * right; break;
    case "÷": result = right === 0 ? NaN : left / right; break;
    default: return;
  }

  if (!Number.isFinite(result)) {
    currentValue = "Error";
  } else {
    currentValue = String(Number(result.toPrecision(12)));
  }

  previousValue = "";
  operation = null;
  justCalculated = true;
  updateDisplay();
}

function clear() {
  currentValue = "0";
  previousValue = "";
  operation = null;
  justCalculated = false;
  updateDisplay();
}

function deleteDigit() {
  if (justCalculated || currentValue === "Error") {
    clear();
    return;
  }

  currentValue = currentValue.length > 1
    ? currentValue.slice(0, -1)
    : "0";
  updateDisplay();
}

document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

document.querySelectorAll("[data-operation]").forEach((button) => {
  button.addEventListener("click", () => chooseOperation(button.dataset.operation));
});

document.querySelector('[data-action="clear"]').addEventListener("click", clear);
document.querySelector('[data-action="delete"]').addEventListener("click", deleteDigit);
document.querySelector('[data-action="equals"]').addEventListener("click", calculate);

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) appendNumber(event.key);
  if (event.key === "+") chooseOperation("+");
  if (event.key === "-") chooseOperation("−");
  if (event.key === "*") chooseOperation("×");
  if (event.key === "/") chooseOperation("÷");
  if (event.key === "Enter" || event.key === "=") calculate();
  if (event.key === "Backspace") deleteDigit();
  if (event.key === "Escape") clear();
});
