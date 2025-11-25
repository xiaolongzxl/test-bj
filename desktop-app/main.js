// main.js
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

require('./utils/drag-file');

Menu.setApplicationMenu(null);
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // 安全起见关闭 Node 集成（除非你需要）
      contextIsolation: true,
      frame: false,
      // 👇 关键：隐藏顶部菜单栏
      autoHideMenuBar: true, // 隐藏但可通过 Alt 键呼出（Windows

      preload: path.join(__dirname, 'preload.js'), // 可选：用于安全通信
    },
  });

  // 加载本地 H5 项目（推荐）
  // win.loadFile(path.join(__dirname, 'dist/index.html'));

  // 或加载远程 URL（不推荐用于生产）
  win.loadURL('http://localhost:5173/');

  // 开发时打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
