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
 * 获取文件详情
 */
export function getFileDetailApi(data: { folder_category_id: string; id: string }) {
  return defHttp.request({
    url: root + 'http://dianlan.vip/api/pan/getFolderFileList',
    method: 'POST',
    data,
  });
}
