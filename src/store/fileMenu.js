/**
 *  defineStore 第一个参数，实际项目中建议定义成枚举类型
 * 实际项目中，定义不同的store用不同的文件分割出来，index中用来到处store 和基础的数据
 */
const gsMenu = [
  {
    id: 1,
    title: '二级分类',
  },
  {
    id: 2,
    title: '二级分类2',
  },
  {
    id: 3,
    title: '二级分类3',
  },
];
import router, { routes as defaultRoute } from '../router';
import { defineStore } from 'pinia';
export const fileMenuStore = defineStore('fileMenu', {
  state: () => {
    return {
      gsCate: [
        {
          id: 1,
          title: '二级分类',
        },
        {
          id: 2,
          title: '二级分类2',
        },
        {
          id: 3,
          title: '二级分类3',
        },
      ],
      bmCate: [],
      routes: [],
    };
  },

  actions: {
    getFirstRoute(path) {
      let findItem = this.getFileRoute(this.routes, path);
      if (findItem?.children?.length) {
        return findItem.children[0];
      } else {
        return findItem;
      }
    },
    getFileRoute(_routes = this.routes, path = '/file') {
      if (!_routes) return null;
      if (Array.isArray(_routes)) {
        for (const route of _routes) {
          if (route.path === path || route?.meta?.fullpath === path) return route;
          if (route.children) {
            const found = this.getFileRoute(route.children, path);
            if (found) return found;
          }
        }
      } else if (_routes.children) {
        return this.getFileRoute(_routes.children, path);
      }
    },
    async addMenu() {
      const _defaultRoutes = JSON.parse(JSON.stringify(defaultRoute));
      const awaitRoute = this.getFileRoute(_defaultRoutes, '/file/company-space');
      const bmAwaitRoute = this.getFileRoute(_defaultRoutes, '/file/sector-space');
      await gsMenu.forEach((e) => {
        if (!awaitRoute?.children?.length) {
          awaitRoute.children = [];
        }
        const addroute = {
          path: e.id + '',
          meta: {
            fullpath: `${awaitRoute.path}/${e.id}`,
            activeOpen: awaitRoute.path,
            title: e.title,
            needAutoFind: false,
          },
        };
        bmAwaitRoute.children.push(addroute);
        awaitRoute.children.push(addroute);
      });

      this.setMenu(_defaultRoutes);
    },
    setMenu(_routes) {
      this.routes = _routes;
    },

    getMenu(menu, type = 'gs') {
      if (gs) {
        return this.gsCate.find((e) => e.id == menu);
      }
    },
  },
  persist: {
    key: 'fileMenu', // 存储的 key，默认为 store 的 id（'auth'）
    storage: localStorage, // 存储方式，默认为 localStorage
  },
});

export default fileMenuStore;
