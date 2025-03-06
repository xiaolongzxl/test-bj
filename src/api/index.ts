import defHttp from '@/service';

/***
 * 获取文件流
 */
export function getProjectFile(url: any) {
  return defHttp.request({
    url: url,
    method: 'get',
    responseType: 'blob',
  });
}
