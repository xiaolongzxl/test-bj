const root = '';

import defHttp from '@/service';

/***
 * 接口名称
 */
export function interface_name(data: any) {
  return defHttp.request({
    url: root + 'interface_url',
    method: 'post',
    data,
  });
}
