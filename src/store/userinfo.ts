/**
 *  defineStore 第一个参数，实际项目中建议定义成枚举类型
 * 实际项目中，定义不同的store用不同的文件分割出来，index中用来到处store 和基础的数据
 */
import { defineStore } from 'pinia';
export const UserStore = defineStore('userInfo', {
  state: () => {
    return {
      avatar: null,
      company_name: null,
      phone: null,
      area: null,
      nickname: null,
      is_structure: 0,
      is_discount: 0,
    };
  },
  getters: {},
  // 修改方法
  actions: {
    setUserInfo(userInfo: any) {
      this.nickname = userInfo.nickname;
      this.avatar = userInfo.avatar;
      this.company_name = userInfo.company_name;
      this.phone = userInfo.phone;
      this.area = userInfo.area;
      this.is_structure = userInfo.is_structure;
      this.is_discount = userInfo.is_discount;
    },
  },
  persist: {
    key: 'userInfo', // 存储的 key，默认为 store 的 id（'auth'）
    storage: localStorage, // 存储方式，默认为 localStorage
  },
});
