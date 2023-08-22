const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const mammoth = require("mammoth");
let docxFiles;
let folderPath;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./src/index.html"));
}

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (!canceled) {
    folderPath = filePaths[0];
    const files = await fs.readdir(folderPath);
    // console.log(folderPath);
    docxFiles = files.filter((file) => path.extname(file) === ".docx");
    return docxFiles;
  }
}

function handelReadDocxFile(event, fileName) {
  if (!fileName) console.log("wtf");
  const docxFilePath = `${folderPath}/${fileName}`;
  console.log("docxFilePath: " + docxFilePath);

  let output = "";
  output = mammoth
    .extractRawText({ path: docxFilePath })
    .then((result) => {
      return result.value;
    })
    .catch((err) => {
      console.error("Error extracting text from .docx file:", err);
    });

  return output;
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFolder", handleFolderOpen);
  ipcMain.handle("file:readDocxFile", (event, fileName) =>
    handelReadDocxFile(event, fileName)
  );

  createMainWindow();

  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
