import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import fileMenuStore from '@/store/fileMenu.js';

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
          needAutoFind: true,
        },
        children: [
          {
            path: '/file/company-space/:cateId(\\d+)/:folderId(\\d+)',
            name: 'CompanySpaceCategory',
            meta: {
              hidden: true,
              needAutoFind: false,
              activeOpen: '/file/company-space',
              route: '/file/company-space',
              // keepAlive: false,
              topbar: 'search',
            },
            component: () => import('@/views/home/file/company-space/index.vue'),
          },
          {
            path: '/file/sector-space/:cateId(\\d+)/:folderId(\\d+)',
            name: 'SectorSpaceCategory',
            meta: {
              hidden: true,
              needAutoFind: false,
              activeOpen: '/file/sector-space',
              route: '/file/sector-space',
              // keepAlive: false,
              topbar: 'search',
            },
            component: () => import('@/views/home/file/sector-space/index.vue'),
          },
        ],
        component: () => import('@/views/home/file/file.vue'),
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
  const fileRoutes = fileMenuStore().allRoutes;
  if (!fileRoutes.length) {
    next(false);
    return;
  }
  if (to) {
    let cur: any = fileRoutes.find((item: any) => item.path == to.path);
    if (cur) {
      if (cur.meta.needAutoFind) {
        getFirst(cur.children[0], next);
      } else {
        next({ path: cur.meta.fullpath, replace: true });
      }
    } else {
      next(to);
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
    if (to.path.includes('/file') && fileMenuStore().allRoutes.length === 0) {
      await fileMenuStore().getMenus();

      getFirst(to.path === '/file' ? null : to, next);
      return;
    }
    if (to?.meta?.needAutoFind) {
      getFirst(to.path === '/file' ? null : to, next);
      return;
    }
    next(); // 如果已经是登录页，直接放行
  }
});
export default router;
