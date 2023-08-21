const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");

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

  let filesInFolder;

  if (!canceled) {
    // return filePaths[0];
    const files = await fs.readdir(filePaths[0]);

    // const files = await fs.readdir(filePaths[0], (err, files) => {
    //   if (err) {
    //     console.error("Error reading folder:", err);
    //     return;
    //   }

    //   console.log("Files in the folder:");
    //   console.log(files);
    //   // return files;
    //   // filesInFolder = [...files];

    //   // files.forEach((file) => {
    //   //   filesInFolder.push(file);
    //   // });
    // });
    return [...files];
    // console.log("f: " + filesInFolder);
    // return filesInFolder;
  }
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFolder", handleFolderOpen);

  createMainWindow();

  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
