const root = '';

import defHttp from '@/service';

/***
 * 验证码登录
 */
export function verifyLogin(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/verifyLogin',
    method: 'POST',
    data,
  });
}

/***
 * 发送验证码
 */
export function sendVerifyCode(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/sendVerifyCode',
    method: 'POST',
    data,
  });
}

/***
 * 手机号密码登录
 */
export function login(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/login',
    method: 'POST',
    data,
  });
}
/***
 * 获取用户信息
 */
export function getUserInfo(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/getUserInfo',
    method: 'POST',
    data,
  });
}
