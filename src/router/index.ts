import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { fileMenuStore } from '@/store/fileMenu.js';

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
        redirect: '/file/company-space',
        children: [
          {
            path: '/file/company-space',
            name: 'companySpace',
            meta: {
              // keepAlive: false,
              title: '公司空间',
              icon: 'gskj',
              topbar: 'search',
              needAutoFind: true,
              idx: 'gs',
            },
            children: [
              {
                path: ':cateId(\\d+)',
                name: 'companySpaceCategory',

                meta: {
                  hidden: true,
                  needAutoFind: false,
                  activeOpen: '/file/company-space',
                  // keepAlive: false,
                  topbar: 'search',
                },
                component: defineAsyncComponent(() => import('@/views/home/file/company-space/index.vue')),
              },
            ],
            component: () => import('@/views/home/file/company-space/routerLink.vue'),
          },

          {
            path: '/file/sector-space',
            name: 'sectorSpace',
            meta: {
              // keepAlive: false,
              title: '部门空间',
              icon: 'bmkj',
              topbar: 'search',
              needDynamicRoute: true,
              needAutoFind: true,
              idx: 'bm',
            },
            children: [
              {
                path: ':cateId(\\d+)',
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
            component: defineAsyncComponent(() => import('@/views/home/file/sector-space/routerLink.vue')),
          },
          {
            path: '/file/contract-template',
            name: 'contractTemplate',
            meta: {
              // keepAlive: false,
              title: '合同模板',
              icon: 'htmb',
              topbar: 'search',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/contract-template/index.vue')),
          },
          {
            path: '/file/certificate-management',
            name: 'certificateManagement',
            meta: {
              // keepAlive: false,
              title: '证书管理',
              icon: 'zsgl',
              topbar: 'search',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/certificate-management/index.vue')),
          },
          {
            path: '/file/password-management',
            name: 'passwordManagement',
            meta: {
              // keepAlive: false,
              title: '密码管理',
              icon: 'mmgl',
              topbar: 'title',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/password-management/index.vue')),
          },
          {
            path: '/file/personal-space',
            name: 'personalSpace',
            meta: {
              // keepAlive: false,
              title: '个人空间',
              icon: 'grkj',
              topbar: 'search',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/personal-space/index.vue')),
          },
          {
            path: '/file/recycle-bin',
            name: 'recycleBin',
            meta: {
              // keepAlive: false,
              title: '回收站',
              icon: 'hsz',
              topbar: 'null',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/recycle-bin/index.vue')),
          },
        ],
        component: defineAsyncComponent(() => import('@/views/home/file/file.vue')),
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

let isFirst: Boolean = true;

const getFirst = (to, next) => {
  if (to?.meta?.needAutoFind) {
    if (fileMenuStore()[`${to.meta.idx}Cate`]?.length) {
      return next({ path: `${to.path}/${fileMenuStore()[`${to.meta.idx}Cate`][0].id}`, replace: true });
    }
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
    if (isFirst) {
      await fileMenuStore().addFileRouter();
      isFirst = false;
      getFirst(to, next);
      return next({ ...to, replace: true });
    }
    getFirst(to, next);
    next(); // 如果已经是登录页，直接放行
  }
});
export default router;
