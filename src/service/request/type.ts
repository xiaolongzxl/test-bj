import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HRequestInterceptors<T = AxiosResponse> {
  // 请求拦截器函数以及错误函数  相当于use((config)=>{},(error)=>{})   变为可选接口项
  requestInterceptor?: (config: any) => any;
  requestInterceptorCatch?: (err: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (err: any) => any;
}

//interface HRequestConfig extends AxiosRequestConfig 对 AxiosRequestConfig进行拓展 可以添加interceptors配置项
export interface HRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  // 将interceptors也变为可选的
  interceptors?: HRequestInterceptors<T>;
  // 是否需要展示loading
  showLoading?: boolean;
}
