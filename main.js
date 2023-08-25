const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const mammoth = require("mammoth");
const Store = require("electron-store");
const store = new Store();
let mainWindow;

let docxFiles;
let folderPath;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 690,
    height: 990,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./src/index.html"));

  mainWindow.on("close", (event) => {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function setFolderPath(newPath) {
  lastSavedFolderPath = store.get("lastFolderPath");
  if (newPath) {
    store.set("lastFolderPath", newPath);
    folderPath = store.get("lastFolderPath");
    return;
  } else if (lastSavedFolderPath) {
    folderPath = lastSavedFolderPath;
    return;
  } else if (!lastSavedFolderPath) {
    return;
  }
}

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (!canceled) {
    setFolderPath(filePaths[0]);
    const files = await fs.readdir(folderPath);
    docxFiles = files.filter((file) => path.extname(file) === ".docx");
    return docxFiles;
  } else {
    return "";
  }
}

function handleReadDocxFile(event, fileName) {
  if (!fileName) return "Error";
  const docxFilePath = `${folderPath}/${fileName}`;
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

function handleTest(event, value) {
  return value;
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFolder", handleFolderOpen);
  ipcMain.handle("file:readDocxFile", (event, fileName) =>
    handleReadDocxFile(event, fileName)
  );
  ipcMain.handle("getLastFolderPath", () => {
    return store.get("lastFolderPath");
  });

  // store.clear();

  setFolderPath();

  createMainWindow();

  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("activate", () => {
  mainWindow.show();
});
app.on("before-quit", () => (app.quitting = true));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
