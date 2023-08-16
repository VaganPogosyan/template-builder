const submitButton = document.querySelector("#submitButton");
const clearButton = document.querySelector("#clearButton");
const firstCodeInput = document.querySelector("#firstCode");
const secondCodeInput = document.querySelector("#secondCode");
const form = document.querySelector("#form");
const errors = document.querySelector("#errors");

const firstCodeDB = ["234", "567", "C57", "X21"];
const secondCodeDB = ["11", "RF", "AB", "4F", "9P"];
// const combinations = { 1: ["234", "AB"], 2: ["RF", "234"], 3: ["X21", "9P"] };
const combinations = { "234+RF": "fff", "234+AB": "ffx", "C57+9P": "ffa" };
// {'234+AB': templateCode, '234+RF': templateCode}

function checkCodes() {
  const firstCode = firstCodeInput.value.toString().toUpperCase().trim();
  const secondCode = secondCodeInput.value.toString().toUpperCase().trim();
  let noErrors = true;

  if (!firstCodeDB.includes(firstCode) && firstCode !== "") {
    showError("First code doesn't exist");
    noErrors = false;
  }
  if (!secondCodeDB.includes(secondCode) && secondCode !== "") {
    showError("Second code doesn't exist");
    noErrors = false;
  }
  if (firstCode == "") {
    showError("Please enter first code");
    noErrors = false;
  }
  if (secondCode == "") {
    showError("Please enter second code");
    noErrors = false;
  }

  if (noErrors) {
    const templateCode = checkCombination(firstCode, secondCode);
    if (!templateCode) return false;
    console.log(`TEMPLATE CODE: ${templateCode}`);
  } else {
    return noErrors;
  }
}

// function showError(text) {
//   const errorText = document.createElement("h1");
//   errorText.style.color = "red";
//   errorText.innerText = text;
//   errors.appendChild(errorText);
// }

function showError(text) {
  const errorText = document.createElement("h1");
  errorText.style.color = "red";
  errorText.innerText = text;
  errors.appendChild(errorText);
}

// check the what is the combination of two codes
function checkCombination(firstCode, secondCode) {
  // Object.keys(combinations);
  const combinedCode = `${firstCode}+${secondCode}`;
  console.log(combinedCode);
  if (!combinations[combinedCode]) {
    showError("Teamplate doesn't exist");
    return;
  }
  return combinations[combinedCode];
}

clearButton.addEventListener("click", (e) => {
  location.reload();
});

form.addEventListener("submit", (e) => {
  //   if (checkCodes()) {
  //     e.preventDefault();
  //   }
  errors.innerText = "";
  checkCodes();
  e.preventDefault();
});

firstCodeInput.addEventListener("keydown", () => {
  errors.innerText = "";
});
secondCodeInput.addEventListener("keydown", () => {
  errors.innerText = "";
});
