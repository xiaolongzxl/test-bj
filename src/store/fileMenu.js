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
import { getLeftMenus } from '@/api/file';
import router, { routes as defaultRoute } from '../router';
import { defineStore } from 'pinia';
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../views/home/file/**/*.vue');
export const fileMenuStore = defineStore('fileMenu', {
  state: () => {
    return {
      routes: [],
      allRoutes: [],
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
        // const res = {
        //   code: 200,
        //   msg: '成功',
        //   data: [
        //     {
        //       id: 1,
        //       name: '公司空间',
        //       parent_id: 0,
        //       icon: 'gskj',
        //       route: '/company-space',
        //       path: 'company-space/routerLink',
        //       is_leaf: 0,
        //       type: 1,
        //       sort: 7,
        //       create_time: 0,
        //       update_time: null,
        //       junior: [
        //         {
        //           id: 18,
        //           name: '二级分类4',
        //           parent_id: 1,
        //           icon: '',
        //           route: null,
        //           path: null,
        //           is_leaf: 1,
        //           type: 1,
        //           sort: 5,
        //           create_time: 1742736808,
        //           update_time: null,
        //         },
        //         {
        //           id: 3,
        //           name: '二级分类2',
        //           parent_id: 1,
        //           icon: '',
        //           route: null,
        //           path: null,
        //           is_leaf: 1,
        //           type: 1,
        //           sort: 5,
        //           create_time: 0,
        //           update_time: null,
        //         },
        //       ],
        //     },
        //     {
        //       id: 7,
        //       name: '合同模板',
        //       parent_id: 0,
        //       icon: 'htmb',
        //       route: '/contract-template',
        //       path: 'contract-template/index',
        //       is_leaf: 1,
        //       type: 3,
        //       sort: 5,
        //       create_time: 0,
        //       update_time: null,
        //       junior: [],
        //     },
        //     {
        //       id: 8,
        //       name: '证书管理',
        //       parent_id: 0,
        //       icon: 'zsgl',
        //       route: '/certificate-management',
        //       path: 'certificate-management/index',
        //       is_leaf: 1,
        //       type: 4,
        //       sort: 4,
        //       create_time: 0,
        //       update_time: null,
        //       junior: [],
        //     },
        //     {
        //       id: 9,
        //       name: '密码管理',
        //       parent_id: 0,
        //       icon: 'mmgl',
        //       route: '/password-management',
        //       path: 'password-management/index',
        //       is_leaf: 1,
        //       type: 5,
        //       sort: 3,
        //       create_time: 0,
        //       update_time: null,
        //       junior: [],
        //     },
        //     {
        //       id: 10,
        //       name: '个人空间',
        //       parent_id: 0,
        //       icon: 'grkj',
        //       route: '/personal-space',
        //       path: 'personal-space/index',
        //       is_leaf: 1,
        //       type: 6,
        //       sort: 2,
        //       create_time: 0,
        //       update_time: null,
        //       junior: [],
        //     },
        //   ],
        // };
        if (res.code == 200) {
          // console.log(router, router.hasRoute('file'));
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
        const formatSecond = (juniorMenus, activeOpen) => {
          return juniorMenus.map((menu) => ({
            path: `${menu.id}${menu.junior?.length > 0 ? '' : '/0'}`,

            meta: {
              parentId: menu.parent_id,
              id: menu.id,
              fullpath: `${activeOpen}/${menu.id}/0`,
              // activeOpen,
              activeOpen: `${activeOpen}/${menu.id}${menu.junior?.length > 0 ? '' : '/0'}`,
              title: menu.name,
              needAutoFind: false,
            },
            children: menu.junior ? formatSecond(menu.junior, activeOpen) : [],
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
                fullpath: `/file${menu.route}`,
                title: menu.name,
                icon: menu.icon,
                topbar: menu.route === '/password-management' ? 'title' : menu.route === '/recycle-bin' ? 'null' : 'search',
                needAutoFind: menu.junior?.length > 0,
              },
              component: this.loadView(menu.path),
            };

            router.addRoute('file', route);

            if (menu.junior?.length) {
              const children = formatSecond(menu.junior, `/file${menu.route}`);
              route.children = children;
              allMenus.push(...children);
            }
            route.path = `/file${menu.route}${menu.junior?.length > 0 ? '' : '/' + menu.id + '/0'}`;
            lastRoutes.push(route);
            allMenus.push(route);
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
  },
});

export default fileMenuStore;
