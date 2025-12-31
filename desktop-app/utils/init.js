const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');

const path = require('path');
const { drag } = require('./drag');
const { checkForUpdates } = require('./update');

let win = null;

Menu.setApplicationMenu(null);
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'dragzip',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true, // 必须！
      corsEnabled: true,
      bypassCSP: true,
    },
  },
]);
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // 安全起见关闭 Node 集成（除非你需要）
      contextIsolation: true,
      frame: false,
      // 👇 关键：隐藏顶部菜单栏
      autoHideMenuBar: false, // 隐藏但可通过 Alt 键呼出（Windows

      preload: path.join(__dirname, '../preload.js'), // 可选：用于安全通信
    },
  });
  // 👇 添加这段：自定义右键菜单（仅保留常用项）
  win.webContents.on('context-menu', (event, params) => {
    const template = [];

    // 如果是可编辑区域（输入框等）
    if (params.editFlags.canPaste) {
      template.push({ role: 'paste', label: '粘贴' });
    }
    if (params.editFlags.canCopy) {
      template.push({ role: 'copy', label: '复制' });
    }

    // 如果是图片
    if (params.mediaType === 'image') {
      template.push(
        {
          label: '复制图片',
          click: () => {
            // params.x, params.y 是右键点击坐标
            win.webContents.copyImageAt(params.x, params.y);
          },
        }, // Electron 内置：复制图片到剪贴板
        {
          label: '图片另存为...',
          click: () => {
            if (win && !win.isDestroyed()) {
              win.webContents.downloadURL(params.srcURL);
            }
          },
        }
      );
    }

    // 刷新
    template.push({ role: 'reload', label: '刷新' });

    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: win });
  });
  // 加载本地 H5 项目（推荐）
  win.loadFile(path.join(__dirname, '../dist/index.html'));

  // 或加载远程 URL（不推荐用于生产）
  // win.loadURL('http://localhost:5173/');

  // 开发时打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
  // 启动后延迟检查更新（避免卡住启动）
  setTimeout(() => {
    checkForUpdates(win);
  }, 3000);
}

// 👇 新增：提供窗口位置
ipcMain.on('get-window-bounds', (event) => {
  if (win && !win.isDestroyed()) {
    event.returnValue = win.getBounds();
  } else {
    event.returnValue = { x: 0, y: 0, width: 1200, height: 800 };
  }
});

// 👇 新增：创建独立窗口
ipcMain.on('create-detached-window', (event, newPath) => {
  // console.log(event, newPath);
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: false, // 安全起见关闭 Node 集成（除非你需要）
      contextIsolation: true,
      frame: false,
      // 👇 关键：隐藏顶部菜单栏
      autoHideMenuBar: true, // 隐藏但可通过 Alt 键呼出（Windows
      preload: path.join(__dirname, '../preload.js'), // 可选：用于安全通信
    },
  });

  let url;
  if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:5173/#${newPath}`;
  } else {
    // 生产环境：file:// + hash 路由
    url = `file://${path.join(__dirname, '../dist', 'index.html')}#${newPath}`;
  }

  win.loadURL(url);
});
// 工具函数

app.whenReady().then(async () => {
  createWindow();
  drag(win);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
