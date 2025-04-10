import { secondUploadApi, uploadApi, versionSecondUploadApi, versionUploadApi, downloadApi } from '@/api/file';
export const fileType = (type, isBig = false, retuenKey) => {
  const fileType = [
    {
      type: 'audio',
      includes: ['mp3', 'wav', 'aac', 'flac', 'ogg'],
      icon: 'file/file/icon-audio.png',
      bigIcon: 'file/file/icon-audio-big.png',
      name: '音频',
    },
    {
      type: 'video',
      includes: ['mp4', 'avi', 'wmv', 'mov', 'flv', 'mkv'],
      icon: 'file/file/icon-video.png',
      bigIcon: 'file/file/icon-video-big.png',
      name: '视频',
    },
    { type: 'image', includes: ['jpg', 'jpeg', 'png', 'gif'], icon: 'file/file/icon-pic.png', bigIcon: 'file/file/icon-pic-big.png', name: '图片' },
    { type: 'cad', includes: ['dwg', 'dxf'], icon: 'file/file/icon-cad.png', bigIcon: 'file/file/icon-cad-big.png', name: 'cad' },
    { type: 'excel', includes: ['xls', 'xlsx'], icon: 'file/file/icon-excel.png', bigIcon: 'file/file/icon-excel-big.png', name: 'excel' },
    { type: 'pdf', includes: ['pdf'], icon: 'file/file/icon-pdf.png', bigIcon: 'file/file/icon-pdf-big.png', name: 'pdf' },
    { type: 'ppt', includes: ['ppt', 'pptx'], icon: 'file/file/icon-ppt.png', bigIcon: 'file/file/icon-ppt-big.png', name: 'ppt' },
    {
      type: 'wjj',
      includes: ['2', 2],
      icon: 'file/file/icon-wenjianjia.png',
      bigIcon: 'file/file/icon-wenjianjia-big.png',
      name: '文件夹',
      value: 1,
    },
    {
      type: 'qyWjj',
      includes: [1, '1'],
      icon: 'file/file/icon-wenjianjia-blue.png',
      bigIcon: 'file/file/icon-wenjianjia-blue-big.png',
      name: '企业文件夹',
    },
    { type: 'word', includes: ['doc', 'docx'], icon: 'file/file/icon-word.png', bigIcon: 'file/file/icon-word-big.png', name: 'word' },
    { type: 'any', includes: [], icon: 'file/file/icon-any.png', bigIcon: 'file/file/icon-any-big.png', name: 'any' },
  ];
  if (type) {
    let item = fileType.find((e) => e.includes.includes(type));
    if (!item) {
      item = fileType.find((e) => e.type == 'any');
    }
    if (retuenKey) {
      return item[retuenKey];
    }
    if (!!item) {
      return isBig ? item.bigIcon : item.icon;
    }
  }
};

export const uniqueId = () => {
  const uniqueId = 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
  return uniqueId;
};

export const getColor = (excludes) => {
  const color =
    '#' +
    Math.floor(Math.random() * 0x1000000)
      .toString(16)
      .padStart(6, '0');
  if (color === excludes) {
    return getColor(excludes);
  }
  return color;
};

const getFileHash = async (file) => {
  // 读取文件内容
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    throw new Error(`计算文件哈希时出错: ${error.message}`);
  }
};
export const fileUpload = (files = [], uploadQuery = {}, flag = 'normal') => {
  if (files.length === 0) {
    return Promise.resolve([]); // 如果没有文件，直接返回空数组
  }
  const second = flag == 'normal' ? secondUploadApi : versionSecondUploadApi;
  const upload = flag == 'normal' ? uploadApi : versionUploadApi;
  const UploadPromise = async (file) => {
    try {
      const hash = await getFileHash(file);
      const res = await second({ ...uploadQuery, hash });

      if (res.msg !== '文件不存在') {
        // 如果文件已经存在，可能需要处理或直接返回
        return { status: 'success', file: file.name, data: res };
      }

      const formData = new FormData();
      Object.keys(uploadQuery).forEach((key) => {
        formData.append(key, uploadQuery[key]);
      });
      formData.append('file', file);

      const uploadRes = await upload(formData);
      if (uploadRes.code !== 200) {
        throw new Error(`${file.name} 上传失败: ${uploadRes.msg}`);
      }
      return { status: 'success', file: file.name, data: uploadRes };
    } catch (error) {
      return { status: 'error', file: file.name, error: error.message };
    }
  };
  return Promise.allSettled(Object.values(files).map(UploadPromise))
    .then((results) => {
      const formattedResults = results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            status: 'error',
            file: result.reason.file || '未知文件',
            error: result.reason.message || '上传过程中发生未知错误',
          };
        }
      });
      console.log('所有文件上传结果:', formattedResults);
      return formattedResults;
    })
    .catch((err) => {
      console.error('全局错误:', err);
      return [{ status: 'error', error: '全局错误，请检查控制台' }];
    });
};

export const downLoadFile = async (files, folder_category_id, name) => {
  let _name = name.split('.');
  _name = _name.slice(0, _name.length - 1).join('.');
  return new Promise(async (resolve, reject) => {
    try {
      const data = await downloadApi({
        folder_category_id,
        data: files,
      });

      if (data.type !== 'application/zip') {
        throw new Error('下载失败');
      }
      // const blob = new Blob([res]);
      const url = window.URL.createObjectURL(data);

      // 创建隐藏的 <a> 标签并模拟点击
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${_name}.zip`); // 设置下载文件名
      document.body.appendChild(link);
      link.click();

      // 清理资源
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      resolve({ type: 'success' });
    } catch (err) {
      console.log(err);
      resolve({ type: 'error', msg: err.message });
    }
  });
};
export const getIsFolder = (extension) => {
  if (extension) {
    return [1, 2, '1', '2'].includes(extension);
  }
};

export const getAllPath = (_path) => {
  _path = decodeURIComponent(_path);
  let domain = 'http://dlwz.souxianlan.com';
  let path = '';
  if (_path.indexOf(domain) === -1) {
    path = domain + _path;
  } else {
    path = _path;
  }
  return path;
};
