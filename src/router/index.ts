import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

let routes: RouteRecordRaw[] = [];
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

// router.beforeEach(async (_to, _from, next) => {
//   next();
// });

export default router;
