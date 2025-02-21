const root = 'apiUrl';

import defHttp from '@/service';
import { ILogin } from './type.ts';
/***
 * 登录
 */
export function userLogin(data: ILogin) {
  return defHttp.request({
    url: root + '/api/login',
    method: 'post',
    data,
  });
}
