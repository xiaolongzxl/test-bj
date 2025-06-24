import {
  secondUploadApi,
  uploadApi,
  uploadFolderApi,
  versionSecondUploadApi,
  versionUploadApi,
  downloadApi,
  singleDownloadApi,
  historyDownloadApi,
  chunkUploadApi,
  mergechunkApi,
  versionChunkUploadApi,
  versionMergeChunkApi,
} from '@/api/file';
import { createSHA256 } from 'hash-wasm';
const CHUNK_SIZE = 10 * 1024 * 1024;
const MAX_FILE_SIZE = 40 * 1024 * 1024;
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
    {
      type: 'image',
      includes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      icon: 'file/file/icon-pic.png',
      bigIcon: 'file/file/icon-pic-big.png',
      name: '图片',
    },
    { type: 'cad', includes: ['dwg', 'dxf', 'cad'], icon: 'file/file/icon-cad.png', bigIcon: 'file/file/icon-cad-big.png', name: 'cad' },
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
  try {
    // 分块大小，例如 2MB
    const chunkSize = 2 * 1024 * 1024;
    let offset = 0;

    // 初始化 SHA-256 哈希器
    const hasher = await createSHA256();

    while (offset < file.size) {
      // 读取当前块的内容
      const chunk = file.slice(offset, offset + chunkSize);
      const buffer = await chunk.arrayBuffer();

      // 更新哈希内容
      hasher.update(new Uint8Array(buffer));

      // 移动到下一个块
      offset += chunkSize;
    }

    // 计算最终哈希值
    return hasher.digest('hex');
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
      // return console.log(file);
      const hash = await getFileHash(file);
      const res = await second({ ...uploadQuery, name: file.name, hash });
      console.log(res);

      if (res.code != 200) {
        if (res.msg !== '文件不存在') {
          throw new Error(`${file.name} 上传失败: ${res.msg}`);
        }
      } else {
        return { status: 'success', file: file.name, data: res };
      }

      const formData = new FormData();
      Object.keys(uploadQuery).forEach((key) => {
        formData.append(key, uploadQuery[key]);
      });
      if (file.size > MAX_FILE_SIZE) {
        const chunkRes = await chunkUpload(file, uploadQuery, flag);

        if (chunkRes.status == 'success') {
          return { status: 'success', file: file.name, data: chunkRes };
        } else {
          throw new Error(`${file.name} 上传失败: ${chunkRes.msg}`);
        }
      }

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
        console.log(result);
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
// 获取文件后缀
const getFileExtension = (fileName) => {
  const names = fileName.split('.');
  const last = names[names.length - 1];
  if (!last) return '无后缀';
  return last.toLowerCase();
};
const chunkUploadPromise = async (data, api) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api(data);
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};
const chunkUpload = async (file, query, flag = 'normal') => {
  const chunkApi = flag == 'normal' ? chunkUploadApi : versionChunkUploadApi;
  const mergeApi = flag == 'normal' ? mergechunkApi : versionMergeChunkApi;
  const { size, name, type } = file;
  const totalChunks = Math.ceil(size / CHUNK_SIZE);

  const uploadChunk = [];
  const uploadId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const uploadQuery = {
    ...query,
    upload_id: uploadId,
    total_chunks: totalChunks,
    file_name: name,
    file_size: size,
    file_extension: getFileExtension(name),
    mime_type: type,
  };
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, size);
    const chunk = file.slice(start, end);
    uploadQuery.file = chunk;
    uploadQuery.chunk_index = i;
    const chunkFormData = new FormData();
    Object.keys(uploadQuery).forEach((key) => {
      chunkFormData.append(key, uploadQuery[key]);
    });

    uploadChunk.push(chunkUploadPromise(chunkFormData, chunkApi));
  }
  try {
    const results = await Promise.all(uploadChunk);
    console.log('分片全部上传完', results);
    // promise.resolve({ status: 'success', msg:'上传成功',data:results });
    const mergeRes = await mergeApi({
      upload_id: uploadId,
      file_name: name,
      file_size: size,
      file_extension: getFileExtension(name),
      mime_type: type,
      ...query,
    });
    if (mergeRes.code == 200) {
      return { status: 'success', msg: '上传成功', data: mergeRes };
    } else {
      return { status: 'error', msg: mergeRes?.msg || '上传失败', data: mergeRes };
    }
  } catch (err) {
    console.log(err);
    return { status: 'error', msg: err?.msg || '上传失败', data: err };
  }
};
export const folderUpload = async (files = [], uploadQuery = {}) => {
  if (files.length === 0) {
    return Promise.resolve([]); // 如果没有文件，直接返回空数组
  }

  const results = [];
  const UploadPromise = async (file) => {
    try {
      const formData = new FormData();
      Object.keys(uploadQuery).forEach((key) => {
        formData.append(key, uploadQuery[key]);
      });
      if (file?.file) {
        formData.append('file', file.file);
        formData.append('relativePath', file.relativePath);
      } else {
        formData.append('file', file);
        formData.append('relativePath', file.webkitRelativePath);
      }

      const uploadRes = await uploadFolderApi(formData);
      console.log(uploadRes);
      if (uploadRes?.code !== 200) {
        throw new Error(`${file.name} 上传失败: ${uploadRes.msg}`);
      }
      results.push({ status: 'success', file: file.name, data: uploadRes });
    } catch (error) {
      results.push({ status: 'error', file: file.name, error: error.message });
    }
  };
  try {
    for (const file of files) {
      await UploadPromise(file);
    }

    console.log('所有文件上传结果:', results);
    return results;
  } catch (err) {
    console.error('全局错误:', err);
    return [{ status: 'error', error: '全局错误，请检查控制台' }];
  }
  // return Promise.allSettled(Object.values(files).map(UploadPromise))
  //   .then((results) => {
  //     const formattedResults = results.map(
  //       (result) => result.value
  //       // {
  //       //   if (result.status === 'fulfilled') {
  //       //     return result.value;
  //       //   }
  //       //  else {
  //       //   return {
  //       //     status: 'error',
  //       //     file: result.reason.file || '未知文件',
  //       //     error: result.reason.message || '上传过程中发生未知错误',
  //       //   };
  //       // }
  //     );
  //     console.log('所有文件上传结果:', formattedResults);
  //     return formattedResults;
  //   })
  //   .catch((err) => {
  //     console.error('全局错误:', err);
  //     return [{ status: 'error', error: '全局错误，请检查控制台' }];
  //   });
};

export const downLoadSingle = (files, folder_category_id, name, flag = 'normal') => {
  console.log(files, folder_category_id, flag);
  return new Promise(async (resolve, reject) => {
    try {
      const file = files[0];
      const api = flag == 'normal' ? singleDownloadApi : historyDownloadApi;
      const data = flag == 'normal' ? { folder_category_id, file_id: file.id } : file.id;
      const response = await api(data);
      const res = response.data;

      const contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // 是一个 JSON 响应，尝试将其转换成文本并解析
        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(new Uint8Array(response.data));
        const errorData = JSON.parse(jsonString);
        if (errorData?.code != 200) {
          throw new Error(errorData?.msg || '下载失败');
        }
      }

      const url = window.URL.createObjectURL(new Blob([res], { type: contentType }));

      // 创建隐藏的 <a> 标签并模拟点击
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name || files[0].name); // 设置下载文件名
      document.body.appendChild(link);
      link.click();

      // 清理资源
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      resolve({ type: 'success' });
    } catch (err) {
      console.log(err);
      reject({ type: 'error', msg: err.message });
    }
  });
};
export const downLoadFile = async (files, folder_category_id, name) => {
  let _name = name.split('.');
  if (_name.length > 1) {
    _name = _name.slice(0, _name.length - 1).join('.');
  } else {
    _name = _name[0];
  }

  return new Promise(async (resolve, reject) => {
    try {
      if (files.length == 1) {
      }
      const response = await downloadApi({
        folder_category_id,
        data: files,
      });
      const res = response.data;
      const contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // 是一个 JSON 响应，尝试将其转换成文本并解析
        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(new Uint8Array(response.data));
        const errorData = JSON.parse(jsonString);
        if (errorData?.code != 200) {
          throw new Error(errorData?.msg || '下载失败');
        }
      }

      const url = window.URL.createObjectURL(new Blob([res], { type: contentType }));

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
      reject({ type: 'error', msg: err.message });
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
  let domain = 'https://dlwz.souxianlan.com';
  let path = '';
  if (_path.indexOf(domain) === -1) {
    path = domain + _path;
  } else {
    path = _path;
  }
  return path;
};
