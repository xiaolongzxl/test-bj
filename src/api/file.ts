const root = '';

import defHttp from '@/service';

/***
 * 验证码登录
 */
export function getLeftMenus() {
  return defHttp.request({
    url: root + '/api/pan/getFolderCategory',
    method: 'POST',
  });
}
