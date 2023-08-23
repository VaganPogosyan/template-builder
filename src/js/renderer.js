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
const mainForm = document.querySelector("#mainForm");

let files;

async function getOutputText(procedureCode, denialCode, patientName) {
  let outputText = "";
  const textForProcedureCode = `Hello ${patientName}, your procedure code is: ${procedureCode}`;

  // get filepath to pass into readDocxFile
  let textForDenialCode = "";
  try {
    textFromDocxFile = await window.electronAPI.readDocxFile(
      `${denialCode}.docx`
    );
    if (textFromDocxFile) {
      textForDenialCode = textFromDocxFile
        .replace(/{PatientName}/g, patientName)
        .replace(/{DenialCode}/g, denialCode);
    } else {
      showError("Template with this denial code doesn't exist");
    }
  } catch (error) {
    console.log(error);
  }
  outputText = `${textForProcedureCode}\r\n\r\n${textForDenialCode}`;
  textAreaForProcedureCode.value = outputText;
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
  // if (!files.includes(`${denialCode}.docx`)) {
  //   showError(`Template with that denial code: ${denialCode} doesn't exist`);
  //   noErrors = false;
  // }

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
  const errorText = document.createElement("h3");
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
  const { docxFiles, folderPath } = await window.electronAPI.openFolder();
  files = docxFiles;
}

// window.addEventListener("load", openLastSavedFolder);

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
