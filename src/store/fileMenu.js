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
import { getLeftMenus, copyApi, moveApi, permissionKey } from '@/api/file';
import router, { routes as defaultRoute } from '../router';
import { defineStore } from 'pinia';
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../views/home/file/**/*.vue');
export const fileMenuStore = defineStore('fileMenu', {
  state: () => {
    return {
      routes: [],
      allRoutes: [],
      activeBreadCrumb: [],
      copyQuery: {
        originFolder: '',
        copyFiles: [],
      },
      /* 顶级搜索框临时存储选中值 */
      temporaryChecked: {},
      permissionKeys: [],
    };
  },

  actions: {
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

    setMenu(_routes) {
      this.routes = _routes;
    },
    async getMenus() {
      try {
        const res = await getLeftMenus();

        if (res.code == 200) {
          const lastRoutes = await this.formatMenus(res.data, '/file');

          this.setMenu(lastRoutes);
          Promise.resolve(lastRoutes);
        }
      } catch (err) {}
    },
    formatRouteName(routeName) {
      let _routeName = '';
      if (routeName) {
        if (routeName.indexOf('/') > -1) {
          _routeName = routeName.split('/')[1];
        }
        _routeName = _routeName.split('-');

        _routeName = _routeName.map((e) => e.replace(e[0], e[0].toUpperCase())).join('');
      }
      return _routeName;
    },
    formatMenus(menus) {
      try {
        const formatSecond = (juniorMenus, activeOpen, route) => {
          return juniorMenus.map((menu) => ({
            path: `${menu.id}${menu.junior?.length > 0 ? '' : '/0'}`,

            meta: {
              parentId: menu.parent_id,
              id: menu.id,
              fullpath: `${activeOpen}/${menu.id}/0`,
              route: route,
              roleId: menu?.role_id,
              // activeOpen,
              activeOpen: `${activeOpen}/${menu.id}${menu.junior?.length > 0 ? '' : '/0'}`,
              title: menu.name,
              needAutoFind: false,
            },
            children: menu.junior ? formatSecond(menu.junior, activeOpen, route) : [],
          }));
        };

        const allMenus = [];
        const lastRoutes = [];

        menus.forEach((menu) => {
          if (menu.route) {
            const routeName = this.formatRouteName(menu.route);

            const route = {
              path: menu.junior?.length > 0 ? `/file${menu.route}` : `/file${menu.route}/:cateId(\\d+)/:folderId(\\d+)`,
              name: routeName,
              meta: {
                parentId: menu.parent_id,
                id: menu.id,
                route: `/file${menu.route}`,
                fullpath: `/file${menu.route}${menu.junior?.length > 0 ? '' : '/' + menu.id + '/0'}`,
                title: menu.name,
                icon: menu.icon,
                topbar: menu.route === '/password-management' ? 'title' : menu.route === '/recycle-bin' ? 'null' : 'search',
                needAutoFind: menu.junior?.length > 0,
              },
              component: this.loadView(menu.path),
            };

            router.addRoute('file', route);

            if (menu.junior?.length) {
              const children = formatSecond(menu.junior, `/file${menu.route}`, `/file${menu.route}`);
              route.children = children;
              allMenus.push(...children);
            }
            route.path = `/file${menu.route}${menu.junior?.length > 0 ? '' : '/' + menu.id + '/0'}`;
            lastRoutes.push(route);
            allMenus.push(route);
            // console.log(lastRoutes);
          }
        });

        this.allRoutes = allMenus;
        return lastRoutes;
      } catch (e) {
        console.log(e);
      }
    },

    loadView(view) {
      let res;
      for (const path in modules) {
        const dir = path.split('file/')[1].split('.vue')[0];
        if (dir === view) {
          res = () => modules[path]();
        }
      }
      return res;
    },
    clear() {
      this.allRoutes = [];
      this.routes = [];
    },
    setBreadCrumb(list) {
      this.activeBreadCrumb = list;
    },
    setCopyFiles(originFolder, list) {
      this.copyQuery = {
        originFolder,
        copyFiles: list,
      };
    },
    handlePaste(targetQuery) {
      return new Promise(async (resolve, reject) => {
        try {
          const { copyFiles } = this.copyQuery;
          let isSelf = copyFiles.some((e) => e.type == 1 && this.activeBreadCrumb.map((el) => el.id).includes(e.id));
          if (isSelf) {
            throw new Error('不能复制到自己');
          }
          const data = {
            folder_category_id: targetQuery.folder_category_id,
            parent_id: targetQuery.parent_id,
            data: copyFiles,
          };

          const res = await this.handleMoveCopy(data, 'copy');

          this.setCopyFiles('', []);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    handleMoveCopy(data, flag) {
      return new Promise(async (resolve, reject) => {
        try {
          const api = flag == 'move' ? moveApi : copyApi;
          const res = await api(data);
          if (res.code != 200) {
            throw new Error(res.msg);
          }
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    setTemporaryChecked(data) {
      this.temporaryChecked = data;
    },
    clearTemporaryChecked() {
      this.temporaryChecked = {};
    },
    async getPremission(folder_category_id) {
      if (!folder_category_id) return;
      try {
        const res = await permissionKey(folder_category_id);
        console.log(res);
        if (res.code != 200) {
          throw new Error(res.msg);
        }
        this.permissionKeys = res.data;
      } catch (err) {
        this.permissionKeys = [];
      }
    },
    hasPremission(key) {
      return this.permissionKeys.map((e) => e.rule_id).includes(key);
    },
  },
});

export default fileMenuStore;
