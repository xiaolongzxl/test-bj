<template>
  <el-scrollbar>
    <el-menu :default-active="activeMenu" :unique-opened="true" mode="vertical">
      <SideBarItem v-for="(route, index) in routers" :key="route.path + index" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>
<script setup>
  import { all } from 'axios';
  import SideBarItem from './sidebarItem.vue';
  import { routes as allRoutes } from '@/router';
  const route = useRoute();
  const activeMenu = computed(() => {
    const { path } = route;
    return path;
  });

  const getFileRoute = (_routes) => {
    if (!_routes) return null;
    if (Array.isArray(_routes)) {
      for (const route of _routes) {
        if (route.path === '/file') return route;
        if (route.children) {
          const found = getFileRoute(route.children);
          if (found) return found;
        }
      }
    } else if (_routes.children) {
      return getFileRoute(_routes.children);
    }
  };
  const routers = computed(() => {
    console.log(getFileRoute(allRoutes).children);
    return getFileRoute(allRoutes).children;
  });
  provide('activeMenu', activeMenu);
</script>
