const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const mammoth = require("mammoth");
let docxFiles;

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
    const files = await fs.readdir(filePaths[0]);
    docxFiles = files.filter((file) => path.extname(file) === ".docx");
    return docxFiles;
  }
}

function handelReadDocxFile(event, fileName) {
  // const docxFilePath = "path";

  fs.readFile(docxFilePath, "binary", (err, data) => {
    if (err) {
      console.error("Error reading .docx file:", err);
      return;
    }

    // Convert the binary data to a readable text format using mammoth
    mammoth
      .extractRawText({ buffer: data })
      .then((result) => {
        // The result object contains the extracted text
        console.log(result.value);
        return result.value;
      })
      .catch((err) => {
        console.error("Error extracting text from .docx file:", err);
      });
  });
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
