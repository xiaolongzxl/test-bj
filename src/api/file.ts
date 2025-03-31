const root = '';

import defHttp from '@/service';

/***
 * 获取左边菜单栏列表
 */
export function getLeftMenus() {
  return defHttp.request({
    url: root + '/api/pan/getFolderCategory',
    method: 'POST',
  });
}

/***
 * 获取文件夹文件列表
 */
export function getFileListApi(data: { folder_category_id: string; parent_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getFolderFileList',
    method: 'POST',
    data,
  });
}

/***
 * 获取文件夹详情
 */
export function getFolderDetailApi(data: { folder_category_id: string; id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getFolderDetails',
    method: 'POST',
    data,
  });
}

/***
 * 获取文件详情
 */
export function getFileDetailApi(data: { folder_category_id: string; id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getFindDetails',
    method: 'POST',
    data,
  });
}

/***
 * 新增文件夹
 */
export function addFolderApi(data: { folder_category_id: string; name: string; parent_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getAddFolder',
    method: 'POST',
    data,
  });
}

/***
 * 修改文件夹
 */
export function updateFolderApi(data: { folder_category_id: string; name?: string; id: string; remark?: string }) {
  return defHttp.request({
    url: root + '/api/pan/getEditFolder',
    method: 'POST',
    data,
  });
}

/***
 * 正常上传文件
 */
export function uploadApi(data: { folder_category_id: string; folder_id: string; type: string; expiration_time?: string; file: any }) {
  return defHttp.request({
    timeout: 300000,
    url: root + '/api/pan/uploadFiles',
    method: 'POST',
    data,
  });
}

/***
 * 上传前秒传功能
 */
export function secondUploadApi(data: { folder_category_id: string; folder_id: string; type: string; expiration_time?: string; hash: string }) {
  return defHttp.request({
    url: root + '/api/pan/transmissionUploadFiles',
    method: 'POST',
    data,
  });
}

/***
 * 下载
 */
export function downloadApi(data: [{ id: string; type: string; folder_category_id: string }]) {
  return defHttp.request({
    url: root + '/api/pan/downloadZip',
    method: 'POST',
    data,
  });
}

/***
 * 删除
 */
export function deleteApi(data: { folder_category_id: string; data: [{ id: string; type: string }] }) {
  return defHttp.request({
    url: root + '/api/pan/deleteFileFolder',
    method: 'POST',
    data,
  });
}

/***
 * 查询成员列表
 */
export function memberListApi(data: { folder_category_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/memberList',
    method: 'POST',
    data,
  });
}
