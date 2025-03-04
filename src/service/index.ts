import HRequest from './request';
import { API_BASE_URL, TIME_OUT } from './request/config';

// /如果需要两个不同的baseUrl 可以创建出来两个不同的SHRequest实例来进行区分   在new 这个类的时候传入一个config对象来进行区分
// 配置信息尽量不要写死，把他写到配置文件里面config.ts
// 这样可以让每个实例又不同的拦截器
const request = new HRequest({
  baseURL: API_BASE_URL,
  timeout: TIME_OUT,
  // axios实例默认是没有这个属性的
  interceptors: {
    requestInterceptor(config: any) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.token = token;
        // config.headers.token = token;
      }
      return config;
    },
    requestInterceptorCatch(err) {
      return err;
    },
    responseInterceptor(res) {
      return res;
    },
    responseInterceptorCatch(err) {
      return err;
    },
  },
});

export default request;
