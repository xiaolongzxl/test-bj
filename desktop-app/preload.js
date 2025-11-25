// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  dragRemoteFiles: (fileUrls) => ipcRenderer.invoke('drag-remote-files', fileUrls),
});
