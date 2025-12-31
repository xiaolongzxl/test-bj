const { protocol, net, session, Notification } = require('electron');
const axios = require('axios');

function drag(win) {
  // 工具函数
  function streamToString(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  }

  protocol.handle('dragfile', (request) => {
    const url = new URL(request.url);

    const fileName = decodeURIComponent(url.searchParams.get('fileName') || '[]');

    const realUrl = decodeURIComponent(url.searchParams.get('fakeUrl'));
    console.log(fileName);
    // 用 Node 无 Referrer 地请求你的真实接口
    return net
      .fetch(realUrl, {
        method: 'GET',
        headers: {
          // 把 token 放 header 里（你原来的接口可能也支持）
          // 'Authorization': `Bearer ${token}`,
          'User-Agent': 'Mozilla/5.0', // 有些后端会校验
          // 千万不要带 Referer !!!
        },
        // 关键：把查询参数也带上
        redirect: 'follow',
        // 如果你的接口是 GET + 查询参数形式，就把参数拼到 url 上
        // 下面这行是兼容你当前接口的（带 folder_category_id 等参数）
      })
      .then((response) => {
        if (!response.ok) {
          return new Response('Download failed', { status: 500 });
        }

        const headers = new Headers(response.headers);
        // 必须加上这几个头，系统才会当文件处理
        headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
        headers.set('Content-Type', 'application/octet-stream');
        // 可选：如果后端返回了真实大小，带上
        // headers.set('Content-Length', response.headers.get('content-length'))

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      });
  });

  protocol.handle('dragzip', async (request) => {
    // 示例请求: dragzip://folder/25?folder_id=123&name=我的相册

    const url = new URL(request.url);
    const files = JSON.parse(decodeURIComponent(url.searchParams.get('files') || '[]'));
    const folderName = decodeURIComponent(url.searchParams.get('name') || '未命名文件夹');
    const category_id = url.searchParams.get('category_id');
    const token = url.searchParams.get('token');

    try {
      new Notification({
        title: '开始打包下载',
        body: `正在打包 ${folderName}，大小约 ${files.length} 个文件`,
        // icon: 'path/to/your/icon.png'
      }).show();
      if (win && !win.isDestroyed()) {
        win.webContents.send('drag-complete');
      }

      const response = await axios({
        method: 'POST',
        url: 'https://wddlsz.com/api/pan/downloadZip',
        data: {
          folder_category_id: category_id,
          data: files,
        },
        headers: {
          token,
          'Content-Type': 'application/json',
        },
        responseType: 'stream', // 重点！必须是 stream
        timeout: 1000 * 60 * 5,
      });

      // 关键！加这一段防御性代码
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('text/html') || contentType.includes('application/json')) {
        const errorText = await streamToString(response.data);
        console.error('后端返回错误（不是 zip！）:', errorText);
        return new Response(errorText, { status: 500 });
      }

      const headers = new Headers();
      headers.set('Content-Type', 'application/zip');
      headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(folderName)}`);
      // 关键！手动带上 Content-Length（axios 能拿到）
      if (response.headers['content-length']) {
        headers.set('Content-Length', response.headers['content-length']);
      }

      return new Response(response.data, {
        status: 200,
        headers,
      });
    } catch (error) {
      console.log(error);
      console.error('打包失败:', error);
      return new Response('打包失败', { status: 500 });
    }
  });

  const activeDownloads = new Set();

  session.defaultSession.on('will-download', (event, item, webContents) => {
    const fileName = item.getFilename();

    // 如果这个文件已经在下载了，直接取消这次新的（防止重复）
    if (activeDownloads.has(fileName)) {
      console.log(JSON.stringify('重复下载，已取消 →', fileName));
      event.preventDefault(); // 重点！阻止这次下载
      return;
    }

    activeDownloads.add(fileName);
    console.log(JSON.stringify('开始下载 →', fileName));

    item.on('updated', (e, state) => {
      if (state === 'progressing') {
        // 可选：你可以看到实时进度
        // console.log(fileName, (item.getReceivedBytes() / item.getTotalBytes() * 100).toFixed(1) + '%')
      }
    });

    item.on('done', (e, state) => {
      activeDownloads.delete(fileName);
      if (state === 'completed') {
        new Notification({
          title: '下载完成',
          body: `${fileName} 已保存`,
          silent: false,
        }).show();
      } else if (state === 'cancelled') {
        console.log(JSON.stringify('下载被取消 →', fileName));
      } else {
        let reason = '未知错误';
        const received = item.getReceivedBytes();
        const total = item.getTotalBytes();

        if (received === 0) {
          reason = '无法连接服务器，请检查网络或稍后重试';
        } else if (total > 0 && received < total) {
          reason = '下载中断，请检查网络连接';
        } else {
          reason = '保存失败（磁盘空间不足或无写入权限）';
        }

        new Notification({
          title: '❌ 下载失败',
          body: `${fileName}\n${reason}`,
        }).show();

        console.error(JSON.stringify(`[Download Failed] ${fileName}`, { url: item.getURL(), received, total }));
      }
    });
  });
}

// 👇 关键：导出
module.exports = { drag };
