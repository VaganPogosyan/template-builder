const submitButton = document.querySelector("#submitButton");
const clearButton = document.querySelector("#clearButton");
const openFolderButton = document.querySelector("#openFolderButton");
const procedureCodeInput = document.querySelector("#procedureCode");
const denialCodeInput = document.querySelector("#denialCode");
const patientNameInput = document.querySelector("#patientName");
const form = document.querySelector("#form");
const errors = document.querySelector("#errors");
const fileInput = document.querySelector("#fileInput");
const textareaOutput = document.querySelector("#textareaOutput");
const mainForm = document.querySelector("#mainForm");
const copyTextButton = document.querySelector("#copyTextButton");

let files;

async function getOutputText(procedureCode, denialCode, patientName) {
  let outputText = "";
  const textForProcedureCode = `To whom it may concern,\n\nIt came to our attention that the CPT code ${procedureCode} was denied with ${denialCode}. After a thorough review of the claim, it was determined that the denial decision is invalid.`;

  let textForDenialCode = "";
  try {
    textFromDocxFile = await window.electronAPI.readDocxFile(
      `${denialCode}.docx`
    );
    console.log(textFromDocxFile);
    if (textFromDocxFile) {
      textForDenialCode = textFromDocxFile
        .replace(/{PatientName}/g, patientName)
        .replace(/{DenialCode}/g, denialCode);
    } else {
      showError("Template with this denial code doesn't exist");
      return;
    }
  } catch (error) {
    console.error(error);
  }
  outputText = `${textForProcedureCode}\r\n\r\n${textForDenialCode}`;
  textareaOutput.value = outputText;
}

async function checkCodes() {
  const procedureCode = procedureCodeInput.value
    .toString()
    .toUpperCase()
    .trim();
  const denialCode = denialCodeInput.value.toString().toUpperCase().trim();
  const patientName = patientNameInput.value.toString().trim();
  let noErrors = true;

  if (procedureCode == "") {
    showError("Enter procedure code");
    noErrors = false;
  }
  if (denialCode == "") {
    showError("Enter denial code");
    noErrors = false;
  }
  if (patientName == "") {
    showError("Enter patient's name");
    noErrors = false;
  }

  if (noErrors) {
    await getOutputText(procedureCode, denialCode, patientName);
  } else {
    return noErrors;
  }
}

function showError(text) {
  const errorText = document.createElement("h6");
  errorText.style.color = "red";
  errorText.innerText = text;
  errorText.style.fontFamily = "sans-serif";
  errors.appendChild(errorText);
}

clearButton.addEventListener("click", (e) => {
  location.reload();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errors.innerText = "";
  await checkCodes();
});

async function handleOpenFolder() {
  files = await window.electronAPI.openFolder();
  location.reload();
}

openFolderButton.addEventListener("click", handleOpenFolder);

procedureCodeInput.addEventListener("keydown", () => {
  errors.innerText = "";
});
denialCodeInput.addEventListener("keydown", () => {
  errors.innerText = "";
});
patientNameInput.addEventListener("keydown", () => {
  errors.innerText = "";
});

window.addEventListener("DOMContentLoaded", async () => {
  const folderPath = await window.electronAPI.getLastFolderPath();
  if (!folderPath) {
    // disable mainForm
    mainForm.style.opacity = 0.1;
    mainForm.style.pointerEvents = "none";
  }
});

copyTextButton.addEventListener("click", function () {
  textareaOutput.select();
  document.execCommand("copy");

  // textareaOutput.setSelectionRange(0, 0);
});
