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
export function getFileListApi(data: { folder_category_id: string; parent_id: string; keyword?: string; type?: string }) {
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
 * 获取目录详情
 */
export function getMenuDetailApi(data: { folder_category_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getcategorydetails',
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
 * 修改文件
 */
export function updateFileApi(data: { folder_category_id: string; name?: string; id: string; remark?: string }) {
  return defHttp.request({
    url: root + '/api/pan/getEditFile',
    method: 'POST',
    data,
  });
}

/***
 * 下载
 */
export function downloadApi(data: { folder_category_id: string; data: [{ id: string; type: string }] }) {
  return defHttp.request({
    url: root + '/api/pan/downloadZip',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
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
 * 查询动态列表
 */
export function dynamicListApi(data: { page: string; file_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/dynamicslist',
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

/***
 * 一出成员
 */
export function userDelApi(data: { user_id: string; folder_category_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/userDelRole',
    method: 'POST',
    data,
  });
}

/***
 * 上传前秒传功能
 */
export function secondUploadApi(data: {
  folder_category_id: string;
  folder_id: string;
  name: string;
  type: string;
  expiration_time?: string;
  hash: string;
}) {
  return defHttp.request({
    url: root + '/api/pan/transmissionUploadFiles',
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
 * 新版本上传前秒传功能
 */
export function versionSecondUploadApi(data: { folder_category_id: string; name: string; file_id: string; hash: string }) {
  return defHttp.request({
    url: root + '/api/pan/versionTransmissionUploadFiles',
    method: 'POST',
    data,
  });
}

/***
 * 新版本正常上传文件
 */
export function versionUploadApi(data: { folder_category_id: string; file_id: string; file: any }) {
  return defHttp.request({
    timeout: 300000,
    url: root + '/api/pan/versionUploadFiles',
    method: 'POST',
    data,
  });
}

/***
 * 查询历史版本
 */
export function getHistoryVer(data: { folder_category_id: string; id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getHistorical',
    method: 'POST',
    data,
  });
}

/***
 * 修改历史版本
 */
export function updateHistoryVer(data: { remark: string; id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getEditHistorical',
    method: 'POST',
    data,
  });
}

/***
 * 删除历史版本
 */
export function delHistoryVer(data: { folder_category_id: string; id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getDelHistorical',
    method: 'POST',
    data,
  });
}

/***
 * 置顶历史版本
 */
export function topHistoryVer(data: { file_id: string; id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getTopHistorical',
    method: 'POST',
    data,
  });
}

/***
 * 查询导航栏
 */
export function getNavigation(data: { folder_category_id: string; parent_id: string }) {
  return defHttp.request({
    url: root + '/api/pan/getNavigation',
    method: 'POST',
    data,
  });
}

/***
 * 复制文件（夹）
 */
export function copyApi(data: { folder_category_id: string; parent_id: string; data: [{ id: string; type: string }] }) {
  return defHttp.request({
    url: root + '/api/pan/getCopy',
    method: 'POST',
    data,
  });
}

/***
 * 移动文件（夹）
 */
export function moveApi(data: { parent_id: string; data: [{ id: string; type: string }] }) {
  return defHttp.request({
    url: root + '/api/pan/updateMove',
    method: 'POST',
    data,
  });
}

/***
 * 密码列表
 */
export function pwdListApi(data: { keyword: string }) {
  return defHttp.request({
    url: root + '/api/pan/getPasswordManagement',
    method: 'POST',
    data,
  });
}

/***
 * 修改密码
 */
export function updatePwdApi(data: { id: string; field: string; field_name: string; value: string }) {
  return defHttp.request({
    url: root + '/api/pan/editPasswordManagement',
    method: 'POST',
    data,
  });
}
/***
 * 添加密码
 */
export function addPwdApi(data: { name: string; website: string; username: string; password: string }) {
  return defHttp.request({
    url: root + '/api/pan/addPasswordManagement',
    method: 'POST',
    data,
  });
}

/***
 * 删除密码
 */
export function delPwdApi(data: { id: string }) {
  return defHttp.request({
    url: root + '/api/pan/delPasswordManagement',
    method: 'POST',
    data,
  });
}

/***
 * 密码历史记录
 */
export function PwdHistoryApi(data: { id: string }) {
  return defHttp.request({
    url: root + '/api/pan/historyPasswordManagement',
    method: 'POST',
    data,
  });
}

/***
 * 密码修改颜色
 */
export function PwdSetColorApi(data: { id: string; field_name: string; color: string }) {
  return defHttp.request({
    url: root + '/api/pan/colorPasswordManagement',
    method: 'POST',
    data,
  });
}

/***
 * 文件文件夹排序
 */
export function fileFolderSort(data: { data: { type: string; id: string; sort: string } }) {
  return defHttp.request({
    url: root + '/api/pan/sortFileFolder',
    method: 'POST',
    data,
  });
}

/***
 * 回收站列表
 */
export function recycleList(data: { type: string }) {
  return defHttp.request({
    url: root + '/api/pan/recycleList',
    method: 'POST',
    data,
  });
}

/***
 * 还原
 */
export function recycleRestore(data: { type: string; user_type: string; data?: { type: string; id: string } }) {
  return defHttp.request({
    url: root + '/api/pan/getRestore',
    method: 'POST',
    data,
  });
}

/***
 * 清空
 */
export function recycleDelete(data: { type: string; user_type: string; data?: { type: string; id: string } }) {
  return defHttp.request({
    url: root + '/api/pan/completelyDelete',
    method: 'POST',
    data,
  });
}
