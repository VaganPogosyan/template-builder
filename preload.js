const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  readDocxFile: (fileName) => ipcRenderer.invoke("file:readDocxFile", fileName),
});
