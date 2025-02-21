import axios from 'axios';
// 这个就是axios实例的类型
import type { AxiosInstance } from 'axios';
import type { HRequestInterceptors, HRequestConfig } from './type';
// import router from '@/router';
class HRequest {
  // 这是axios的实例：类型注解
  instance: AxiosInstance;
  interceptors?: HRequestInterceptors;

  constructor(config: HRequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    // 这里都是从实例取出的拦截器
    this.instance.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorCatch);
    this.instance.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorCatch);

    // 添加默认的拦截器 ->请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // let token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.token = `Bearer ${token}`;
        // }
        return config;
      },
      (err) => {
        console.log(err, '请求接口出错');
      }
    );
    // 添加默认的拦截器 ->响应拦截器
    this.instance.interceptors.response.use(
      (res: any) => {
        // console.log(res);
        // if (res.name == 'AxiosError') {
        //   throw '请求失败';
        // }
        // if (res.data.code == 401) {
        //   setTimeout(() => {
        //     router.replace({
        //       path: '/login',
        //       query: {
        //         redirect: router.currentRoute.value.fullPath,
        //       },
        //     });
        //   }, 1000);
        // }
        return res.data;
      },
      (err) => {
        console.log(err, '响应数据出错');
      }
    );
  }

  request<T = any>(config: HRequestConfig<T>): Promise<T> {
    return new Promise((resolve) => {
      // 对单个实例的拦截
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 对单个实例响应数据的拦截
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          // 这样不会影响下一个请求
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  get<T = any>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T = any>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  delete<T = any>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }

  put<T = any>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' });
  }
}

export default HRequest;
