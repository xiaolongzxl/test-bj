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
        redirect: '/file/recently-used',
        children: [
          {
            path: '/file/commonly-used',
            name: 'CommonlyUsed',
            meta: {
              keepAlive: false,
              title: '常用文件',
              icon: 'cy',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/commonly-used/index.vue')),
          },

          {
            path: '/file/recently-used',
            name: 'RecentlyUsed',
            meta: {
              keepAlive: false,
              title: '最近使用',
              icon: 'zj',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/recently-used/index.vue')),
          },
          {
            path: '/file/my-used',
            name: 'MyUsed',
            meta: {
              keepAlive: false,
              title: '我的文件',
              icon: 'wd',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/my-used/index.vue')),
          },
          {
            path: '/file/corporate-used',
            name: 'CorporateUsed',
            meta: {
              keepAlive: false,
              title: '企业文件',
              icon: 'qy',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/corporate-used/index.vue')),
          },
          {
            path: '/file/recycling-bin',
            name: 'RecyclingBin',
            meta: {
              keepAlive: false,
              title: '回收站',
              icon: 'hs',
            },
            component: defineAsyncComponent(() => import('@/views/home/file/recycling-bin/index.vue')),
          },
        ],
        component: defineAsyncComponent(() => import('@/views/home/file/file.vue')),
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      keepAlive: false,
    },
    component: defineAsyncComponent(() => import('@/views/about/index.vue')),
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

// router.beforeEach(async (to, _from, next) => {
//   let token = localStorage.getItem('token') || '';
//   if (!token) {
//     if (to.path !== '/login') {
//       next('/login');
//     } else {
//       next(); // 如果已经是登录页，直接放行
//     }
//     return; // 结束逻辑
//   }
//   next(); // 如果已经是登录页，直接放行
// });
export default router;
