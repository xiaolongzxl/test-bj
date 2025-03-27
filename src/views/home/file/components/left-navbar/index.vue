<template>
  <el-scrollbar>
    <el-menu :default-active="activeMenu" :default-openeds="activeOpen" :unique-opened="true" mode="vertical">
      <SideBarItem v-for="(route, index) in routers" :key="route.path + index" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>
<script setup>
  import SideBarItem from './sidebarItem.vue';
  import { routes as allRoutes } from '@/router';
  const route = useRoute();
  const router = useRouter();
  import fileMenuStore from '@/store/fileMenu';
  const activeMenu = computed(() => {
    const { path } = route;
    return path;
  });

  const activeOpen = computed(() => {
    if (route.meta?.activeOpen) {
      return [route.meta.activeOpen];
    } else {
      return [];
    }
  });

  const routers = computed(() => {
    // console.log(fileMenuStore().getFileRoute());
    return fileMenuStore().routes;
    let _routers = getFileRoute(allRoutes).children.map((e) => {
      if (e.name == 'companySpace') {
        e.children = gsMenu.value.map((e) => ({
          path: `/file/company-space/${e.id}`,
          id: '1',
          meta: {
            title: e.title,
          },
        }));
      }
      return e;
    });

    return _routers;
  });

  provide('activeMenu', activeMenu);
</script>
