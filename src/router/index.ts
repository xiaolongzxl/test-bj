import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import fileMenuStore from '@/store/fileMenu.js';
import { get } from 'lodash';

export let routes: RouteRecordRaw[] = [];
routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/price',
    meta: {
      keepAlive: false,
    },
    component: defineAsyncComponent(() => import('@/views/home/index.vue')),
    children: [
      {
        path: '/price',
        name: 'price',
        meta: {
          keepAlive: false,
        },
        component: defineAsyncComponent(() => import('@/views/home/price/price.vue')),
      },
      {
        path: '/file',
        name: 'file',
        meta: {
          keepAlive: false,
        },
        children: [
          {
            path: '/file/company-space/:cateId(\\d+)',
            name: 'companySpaceCategory',
            meta: {
              hidden: true,
              needAutoFind: false,
              activeOpen: '/file/company-space',
              // keepAlive: false,
              topbar: 'search',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/sector-space/index.vue')),
          },
          {
            path: '/sector-space/:cateId(\\d+)',
            name: 'sectorSpaceCategory',
            meta: {
              hidden: true,
              needAutoFind: false,
              activeOpen: '/file/sector-space',
              // keepAlive: false,
              topbar: 'search',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/sector-space/index.vue')),
          },
        ],
        component: defineAsyncComponent(() => import('@/views/home/file/file.vue')),
        // redirect: '/file/company-space',
        // children: [
        //   {
        //     path: '/file/company-space',
        //     name: 'companySpace',
        //     meta: {
        //       // keepAlive: false,
        //       title: '公司空间',
        //       icon: 'gskj',
        //       topbar: 'search',
        //       needAutoFind: true,
        //       idx: 'gs',
        //     },
        //     children: [
        //       {
        //         path: ':cateId(\\d+)',
        //         name: 'companySpaceCategory',

        //         meta: {
        //           hidden: true,
        //           needAutoFind: false,
        //           activeOpen: '/file/company-space',
        //           // keepAlive: false,
        //           topbar: 'search',
        //         },
        //         component: defineAsyncComponent(() => import('@/views/home/file/company-space/index.vue')),
        //       },
        //     ],
        //     component: () => import('@/views/home/file/company-space/routerLink.vue'),
        //   },

        //   {
        //     path: '/file/sector-space',
        //     name: 'sectorSpace',
        //     meta: {
        //       // keepAlive: false,
        //       title: '部门空间',
        //       icon: 'bmkj',
        //       topbar: 'search',
        //       needDynamicRoute: true,
        //       needAutoFind: true,
        //       idx: 'bm',
        //     },
        //     children: [
        //       {
        //         path: ':cateId(\\d+)',
        //         name: 'sectorSpaceCategory',
        //         meta: {
        //           hidden: true,
        //           needAutoFind: false,
        //           activeOpen: '/file/sector-space',
        //           // keepAlive: false,
        //           topbar: 'search',
        //         },
        //         component: defineAsyncComponent(() => import('@/views/home/file/sector-space/index.vue')),
        //       },
        //     ],
        //     component: defineAsyncComponent(() => import('@/views/home/file/sector-space/routerLink.vue')),
        //   },
        //   {
        //     path: '/file/contract-template',
        //     name: 'contractTemplate',
        //     meta: {
        //       // keepAlive: false,
        //       title: '合同模板',
        //       icon: 'htmb',
        //       topbar: 'search',
        //     },
        //     component: defineAsyncComponent(() => import('@/views/home/file/contract-template/index.vue')),
        //   },
        //   {
        //     path: '/file/certificate-management',
        //     name: 'certificateManagement',
        //     meta: {
        //       // keepAlive: false,
        //       title: '证书管理',
        //       icon: 'zsgl',
        //       topbar: 'search',
        //     },
        //     component: defineAsyncComponent(() => import('@/views/home/file/certificate-management/index.vue')),
        //   },
        //   {
        //     path: '/file/password-management',
        //     name: 'passwordManagement',
        //     meta: {
        //       // keepAlive: false,
        //       title: '密码管理',
        //       icon: 'mmgl',
        //       topbar: 'title',
        //     },
        //     component: defineAsyncComponent(() => import('@/views/home/file/password-management/index.vue')),
        //   },
        //   {
        //     path: '/file/personal-space',
        //     name: 'personalSpace',
        //     meta: {
        //       // keepAlive: false,
        //       title: '个人空间',
        //       icon: 'grkj',
        //       topbar: 'search',
        //     },
        //     component: defineAsyncComponent(() => import('@/views/home/file/personal-space/index.vue')),
        //   },
        //   {
        //     path: '/file/recycle-bin',
        //     name: 'recycleBin',
        //     meta: {
        //       // keepAlive: false,
        //       title: '回收站',
        //       icon: 'hsz',
        //       topbar: 'null',
        //     },
        //     component: defineAsyncComponent(() => import('@/views/home/file/recycle-bin/index.vue')),
        //   },
        // ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      keepAlive: false,
    },
    component: defineAsyncComponent(() => import('@/views/login/index.vue')),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const getFirst = (to: any, next: any) => {
  console.log(123);
  const fileMenuStoreValue: any = fileMenuStore();
  const fileRoutes = fileMenuStoreValue.allRoutes;
  if (to) {
    let cur = fileRoutes.find((item: any) => item.path == to.path);
    if (cur) {
      if (cur.meta.needAutoFind) {
        getFirst(cur.children[0], next);
      } else {
        next({ path: cur.meta.fullpath, replace: true });
      }
    }
  } else {
    getFirst(fileRoutes[0], next);
  }
};

router.beforeEach(async (to: any, _from, next) => {
  let token = localStorage.getItem('token') || '';
  if (!token) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next(); // 如果已经是登录页，直接放行
    }
    return; // 结束逻辑
  } else {
    if (to.path === '/file' || fileMenuStore().allRoutes.length === 0) {
      await fileMenuStore().getMenus();
      return getFirst(to.path === '/file' ? null : to, next);
    }
    if (to?.meta?.needAutoFind) {
      return getFirst(to, next);
    }
    next(); // 如果已经是登录页，直接放行
  }
});
export default router;
