const { app, ipcMain, dialog, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
// 配置日志（可选但强烈推荐）
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
let winLoad = null;

// 检查更新主函数
async function checkForUpdates(win) {
  winLoad = win;
  console.log('[publish] 测试增量更新');
  if (!app.isPackaged) {
    console.log('[Dev] Skipping update check in development');
    return;
  }

  try {
    // autoUpdater 会自动从 package.json 的 publish.url 获取 latest.yml
    const result = await autoUpdater.checkForUpdates();
    console.log('[publish] result', result);
    if (result?.downloadPromise) {
      // 监听下载进度（可选）
      result.downloadPromise.catch((err) => {
        console.error('Update download failed:', err);
        dialog.showErrorBox('更新失败', `下载更新时出错：${err.message}`);
      });
    }
  } catch (err) {
    console.error('Failed to check for updates:', err);
    // 可选：提示用户网络问题
  }
}
// 监听更新可用
autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version);
  new Notification({
    title: '开始下载',
    body: `发现新版本，开始下载 ${info.version} 版本`,
    // icon: 'path/to/your/icon.png'
  }).show();
});
// 当更新下载完成时
autoUpdater.on('update-downloaded', (info) => {
  const version = info.version;

  if (!winLoad) return;

  const options = {
    type: 'info',
    buttons: ['立即重启', '稍后'],
    title: '更新可用',
    message: `新版本 ${version} 已下载完毕！`,
    detail: '点击“立即重启”以应用更新。',
  };

  dialog.showMessageBox(winLoad, options).then(({ response }) => {
    if (response === 0) {
      // 用户选择立即重启
      autoUpdater.quitAndInstall();
    }
  });
});
// 可选：监听更新进度（用于渲染进程显示进度条）
autoUpdater.on('download-progress', (progressObj) => {
  winLoad?.webContents.send('update-download-progress', {
    percent: progressObj.percent.toFixed(2),
    transferred: progressObj.transferred,
    total: progressObj.total,
  });
});

// 处理渲染进程发来的“立即安装”指令（如果你在前端加了按钮）
ipcMain.on('install-update-now', () => {
  autoUpdater.quitAndInstall();
});

// 错误处理
autoUpdater.on('error', (err) => {
  console.error('AutoUpdater error:', err);
  // 可选：记录到 Sentry 或提示用户
});

// 👇 关键：导出
module.exports = { checkForUpdates };
