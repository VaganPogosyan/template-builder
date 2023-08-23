const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const mammoth = require("mammoth");
const Store = require("electron-store");
const store = new Store();

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

function setFolderPath(newPath) {
  const lastSavedFolderPath = store.get("lastFolderPath");
  if (newPath) {
    store.set("lastFolderPath", newPath);
    folderPath = store.get("lastFolderPath");
    return;
  } else if (lastSavedFolderPath) {
    // if there's no new path simply get last saved folder path in store
    folderPath = lastSavedFolderPath;
    // console.log(`got folder path from store : ${folderPath}`);
    return;
  } else if (!lastSavedFolderPath) return;
}

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (!canceled) {
    setFolderPath(filePaths[0]);
    console.log(`folderpath = ${folderPath}`);
    const files = await fs.readdir(folderPath);
    docxFiles = files.filter((file) => path.extname(file) === ".docx");
    return { docxFiles, folderPath };
  } else {
    return { docxFiles: "", folderPath: "" };
  }
}

function handleReadDocxFile(event, fileName) {
  if (!fileName) return "Error";
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
    handleReadDocxFile(event, fileName)
  );

  // store.clear();
  // console.log("store cleared");

  setFolderPath();

  createMainWindow();

  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
