const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fsp = require('fs').promises; // Promise 版本
const fs = require('fs'); // 回调版本（用于 stream）
const os = require('os');
const https = require('https');
const http = require('http');
const archiver = require('archiver');
const { URL } = require('url');
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

// 清洗文件名
function sanitizeFilename(name) {
  return (
    name
      .replace(/[/\\?%*:|"<>]/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100) || 'unnamed'
  );
}

// 从 URL 提取安全文件名
function extractFilename(url, fallbackIndex = 0) {
  try {
    const parsed = new URL(url);
    let name = path.basename(parsed.pathname).split('?')[0].split('#')[0];
    if (!name || name === '/') {
      name = `file_${fallbackIndex}`;
    }
    return sanitizeFilename(name);
  } catch {
    return sanitizeFilename(`file_${fallbackIndex}`);
  }
}

// 下载文件（使用 pipeline 更健壮）
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Download timeout: ${url}`));
    });
  });
}

// 创建 ZIP
function createZip(localPaths, filenames, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 6 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    localPaths.forEach((localPath, i) => {
      if (fs.existsSync(localPath)) {
        archive.file(localPath, { name: filenames[i] });
      }
    });

    archive.finalize();
  });
}

// 主处理函数
ipcMain.handle('drag-remote-files', async (event, fileUrls) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || !Array.isArray(fileUrls) || fileUrls.length === 0) {
    return;
  }

  try {
    const tempDir = os.tmpdir();

    console.log(fileUrls, '------------------');
    // === 区分单文件 vs 多文件 ===
    if (fileUrls.length === 1) {
      // 单文件：直接下载，不打包
      const url = fileUrls[0];
      const filename = extractFilename(url, 0);
      const localPath = path.join(tempDir, `drag_single_${Date.now()}_${filename}`);

      await downloadFile(url, localPath);

      const iconPath = path.join(app.getAppPath(), 'assets', 'logo.png');
      win.webContents.startDrag({
        file: localPath,
        icon: fs.existsSync(iconPath) ? iconPath : undefined,
      });

      // 延迟清理
      setTimeout(async () => {
        try {
          await fsp.unlink(localPath);
        } catch (e) {
          // ignore
        }
      }, 15000);
    } else {
      // 多文件：走原有 ZIP 流程
      const zipPath = path.join(tempDir, `downloaded_files_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.zip`);

      const downloadedFiles = await Promise.all(
        fileUrls.map(async (url, index) => {
          const filename = extractFilename(url, index);
          const localPath = path.join(tempDir, `drag_temp_${Date.now()}_${index}_${filename}`);
          await downloadFile(url, localPath);
          return { url, localPath, originalName: filename };
        })
      );

      await createZip(
        downloadedFiles.map((f) => f.localPath),
        downloadedFiles.map((f) => f.originalName),
        zipPath
      );

      const iconPath = path.join(app.getAppPath(), 'assets', 'logo.png');
      win.webContents.startDrag({
        file: zipPath,
        icon: fs.existsSync(iconPath) ? iconPath : undefined,
      });

      // 延迟清理
      setTimeout(async () => {
        for (const f of downloadedFiles) {
          try {
            await fsp.unlink(f.localPath);
          } catch (e) {
            // ignore
          }
        }
        // 注意：zipPath 不清理，因为可能被系统占用
      }, 15000);
    }
  } catch (err) {
    console.error('拖拽远程文件失败:', err);
    // 可选：发送错误到前端
    // win.webContents.send('drag-error', err.message);
  }
});
