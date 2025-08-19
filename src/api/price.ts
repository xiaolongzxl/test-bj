const root = '';

import defHttp from '@/service';

/***
 * -------------------- 首页 --------------------
 */

/***
 * 获取产品系列列表
 */
export function getSeriesList() {
  return defHttp.request({
    url: root + '/api/quotation_pc/getSeriesList',
    method: 'post',
  });
}
/***
 * 获取产品子系列列表
 */
export function getSeriesSonList(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/getSeriesSonList',
    method: 'post',
    data,
  });
}

/***
 * 获取产品型号列表
 */
export function getSeriesTypeList(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/getSeriesTypeList',
    method: 'post',
    data,
  });
}

/***
 * 获取产品规格列表
 */
export function getSeriesSpecList(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/getSeriesSpecList',
    method: 'post',
    data,
  });
}

/***
 * 获取结构列表
 */
export function getlabellist(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/getlabellist',
    method: 'post',
    data,
  });
}

/***
 * 关键词搜索
 */
export function seriesSpecSearch(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/seriesSpecSearch',
    method: 'post',
    data,
  });
}
/***
 * 规格详情
 */
export function seriesSpecInfo(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/seriesSpecInfo',
    method: 'post',
    data,
  });
}
/***
 * 规格详情
 */
export function specPriceEdit(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/specPriceEdit',
    method: 'post',
    data,
  });
}
/***
 * -------------------- 报价单 --------------------
 */

/***
 * 加入报价单
 */
export function addQuotation(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/add',
    method: 'post',
    data,
  });
}

/***
 * 产品名搜索
 */
export function seriesSpecNameSearch(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/seriesSpecNameSearch',
    method: 'post',
    data,
  });
}

/***
 * 报价单信息
 */
export function myInfo(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/myInfo',
    method: 'post',
    data,
  });
}

/***
 * 编辑报价单信息
 */
export function editQuotation(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/edit',
    method: 'post',
    data,
  });
}

/***
 * 报价单批量调价
 */
export function priceAdjustment(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/priceAdjustment',
    method: 'post',
    data,
  });
}

/***
 * 报价单设置字体颜色
 */
export function colorAdjustment(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/colorAdjustment',
    method: 'post',
    data,
  });
}
/***
 * 清空报价单规格
 */
export function clearSpec(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/clearSpec',
    method: 'post',
    data,
  });
}

/***
 * 报价单规格排序
 */
export function quotationSpecSort(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/quotationSpecSort',
    method: 'post',
    data,
  });
}

/***
 * 获取公司列表
 */
export function getTemplateList(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/getTemplateList',
    method: 'post',
    data,
  });
}
/***
 * 获取公司列表
 */
export function editRemark(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/editRemark',
    method: 'post',
    data,
  });
}

/***
 * 报价记录列表
 */
export function recordList(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/recordList',
    method: 'post',
    data,
  });
}
/***
 * 报价记录详情
 */
export function recordDetails(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/recordDetails',
    method: 'post',
    data,
  });
}
/***
 * 报价记录删除
 */
export function recordDel(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/recordDel',
    method: 'post',
    data,
  });
}
export function generateQuotation(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/generateQuotation',
    method: 'post',
    data,
  });
}
export function editSpec(data: any) {
  return defHttp.request({
    url: root + '/api/quotation_pc/editSpec',
    method: 'post',
    data,
  });
}
// 获取线图/恢复参数
export function getlinelist(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/getlinelist',
    method: 'post',
    data,
  });
}
// 最外层确认价格;
export function confirm_parameters(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/confirm_parameters',
    method: 'post',
    data,
  });
}
// 确认提交
export function confirm_data(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/confirm_data',
    method: 'post',
    data,
  });
}

// 最外层取消
export function cancel_parameters(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/cancel_parameters',
    method: 'post',
    data,
  });
}
// 获取某个item的详情
export function get_data_info(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/get_data_info',
    method: 'post',
    data,
  });
}
// 获取子系列列表
export function get_raw_son(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/get_raw_son',
    method: 'post',
    data,
  });
}
// 计算直径
export function changezhijing(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/changezhijing',
    method: 'post',
    data,
  });
}
// 获取用量
export function gettable(data: any) {
  return defHttp.request({
    url: root + '/api/lgcode/gettable',
    method: 'post',
    data,
  });
}
