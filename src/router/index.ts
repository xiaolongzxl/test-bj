import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

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
            path: '/file/company-space/:cateId(\\d+)',
            name: 'companySpace',
            meta: {
              // keepAlive: false,
              title: '公司空间',
              icon: 'gskj',
              topbar: 'search',
            },

            component: defineAsyncComponent(() => import('@/views/home/file/company-space/index.vue')),
          },

          {
            path: '/file/sector-space',
            name: 'sectorSpace',
            meta: {
              // keepAlive: false,
              title: '部门空间',
              icon: 'bmkj',
              topbar: 'search',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/sector-space/index.vue')),
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

router.beforeEach(async (to, _from, next) => {
  let token = localStorage.getItem('token') || '';
  if (!token) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next(); // 如果已经是登录页，直接放行
    }
    return; // 结束逻辑
  }
  next(); // 如果已经是登录页，直接放行
});
export default router;
