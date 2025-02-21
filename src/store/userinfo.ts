/**
 *  defineStore 第一个参数，实际项目中建议定义成枚举类型
 * 实际项目中，定义不同的store用不同的文件分割出来，index中用来到处store 和基础的数据
 */
import { defineStore } from 'pinia';
export const UserStore = defineStore('userInfo', {
  state: () => {
    return {
      userInfo: null,
    };
  },
  getters: {},
  // 修改方法
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },
  },
  persist: {
    key: 'userInfo', // 存储的 key，默认为 store 的 id（'auth'）
    storage: localStorage, // 存储方式，默认为 localStorage
  },
});
