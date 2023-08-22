const submitButton = document.querySelector("#submitButton");
const clearButton = document.querySelector("#clearButton");
const openFolderButton = document.querySelector("#openFolderButton");
const procedureCodeInput = document.querySelector("#procedureCode");
const denialCodeInput = document.querySelector("#denialCode");
const patientNameInput = document.querySelector("#patientName");
const form = document.querySelector("#form");
const errors = document.querySelector("#errors");
const fileInput = document.querySelector("#fileInput");
const textAreaForProcedureCode = document.querySelector("#textareaOutput");

let files;
// const procedureCodeDB = ["234", "567", "C57", "X21"];
// const denialCodeDB = ["11", "RF", "AB", "4F", "9P"];
// const combinations = { 1: ["234", "AB"], 2: ["RF", "234"], 3: ["X21", "9P"] };
// const combinations = { "234+RF": "fff", "234+AB": "ffx", "C57+9P": "ffa" };
// {'234+AB': templateCode, '234+RF': templateCode}

// function outputForProcedureCode(procedureCode, patientName) {
//   const textForProcedureCode = `Hello ${patientName}, your procedure code is: ${procedureCode}`;
//   textAreaForProcedureCode.value += textForProcedureCode;
// }

// function outputForDenialCode(denialCode, patientName) {
//   const textForDenialCode = ` - Denial ${patientName}, your denial code is: ${denialCode}`;
//   textAreaForProcedureCode.value += textForDenialCode;
// }

async function getOutputText(procedureCode, denialCode, patientName) {
  let outputText = "";
  const textForProcedureCode = `Hello ${patientName}, your procedure code is: ${procedureCode}`;

  // get filepath to pass into readDocxFile
  let textForDenialCode = "";
  try {
    textForDenialCode = await window.electronAPI.readDocxFile(
      `${denialCode}.docx`
    );
  } catch (error) {
    console.log(error);
  }
  // const textForDenialCode = `${denialCode}.docx`;
  outputText = `${textForProcedureCode}\r\n\r\n${textForDenialCode}`;
  textAreaForProcedureCode.value = outputText;
  // return outputText;
}

async function checkCodes() {
  const procedureCode = procedureCodeInput.value
    .toString()
    .toUpperCase()
    .trim();
  const denialCode = denialCodeInput.value.toString().toUpperCase().trim();
  const patientName = patientNameInput.value.toString().trim();
  let noErrors = true;

  // if (!procedureCodeDB.includes(procedureCode) && procedureCode !== "") {
  //   showError("First code doesn't exist");
  //   noErrors = false;
  // }
  // if (!denialCodeDB.includes(denialCode) && denialCode !== "") {
  //   showError("Second code doesn't exist");
  //   noErrors = false;
  // }

  if (procedureCode == "") {
    showError("Please enter first code");
    noErrors = false;
  }
  if (denialCode == "") {
    showError("Please enter second code");
    noErrors = false;
  }
  if (patientName == "") {
    showError("Please enter patient's name");
    noErrors = false;
  }

  if (noErrors) {
    // const templateCode = checkCombination(procedureCode, denialCode);
    // if (!templateCode) return false;
    // console.log(`TEMPLATE CODE: ${templateCode}`);
    // showTemplateCode(templateCode);
    // outputForProcedureCode(procedureCode, patientName);
    // outputForDenialCode(denialCode, patientName);
    await getOutputText(procedureCode, denialCode, patientName);
  } else {
    return noErrors;
  }
}

function showTemplateCode(templateCode) {
  const errorText = document.createElement("h1");
  errorText.style.color = "green";
  errorText.innerText = templateCode;
  errors.appendChild(errorText);
}

function showError(text) {
  const errorText = document.createElement("h1");
  errorText.style.color = "red";
  errorText.innerText = text;
  errors.appendChild(errorText);
}

// check what is the combination of two codes
// function checkCombination(procedureCode, denialCode) {
//   // Object.keys(combinations);
//   const combinedCode = `${procedureCode}+${denialCode}`;
//   console.log(combinedCode);
//   if (!combinations[combinedCode]) {
//     showError("Template doesn't exist");
//     return;
//   }
//   return combinations[combinedCode];
// }

function handleFile(event) {
  const file = event.target.files[0]; // Get the first selected file
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const contents = e.target.result;
      errors.innerText = contents;
    };

    reader.readAsText(file); // Read the file as text
  }
}

clearButton.addEventListener("click", (e) => {
  location.reload();
});

form.addEventListener("submit", async (e) => {
  //   if (checkCodes()) {
  //     e.preventDefault();
  //   }
  e.preventDefault();
  errors.innerText = "";
  await checkCodes();
});

openFolderButton.addEventListener("click", async () => {
  files = await window.electronAPI.openFolder();
  errors.innerText = files;
  console.log(files);
});

procedureCodeInput.addEventListener("keydown", () => {
  errors.innerText = "";
});
denialCodeInput.addEventListener("keydown", () => {
  errors.innerText = "";
});
