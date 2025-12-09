// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, callback) => {
    // 可选：限制只允许特定通道（安全加固）
    const validChannels = ['drag-error', 'download-progress', 'export-complete', 'drag-complete'];
    if (validChannels.includes(channel)) {
      // 移除事件监听器的包装，防止内存泄漏
      return ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
