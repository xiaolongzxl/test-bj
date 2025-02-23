<template>
  <div class="home-header flex-between pl-24 pr-40">
    <div class="flex-between left-logo">
      <img :src="$getAssetsImages('logo/logo.png')" alt="" />
      <div class="card-tab flex">
        <div :class="{ active: activePage == 'price' }" @click="changePage('price')" class="no-select cursor-pointer mr-50 ml-130 flex-center"
          >报价系统</div
        >
        <div :class="{ active: activePage == 'file' }" @click="changePage('file')" class="no-select cursor-pointer flex-center">文件管理</div>
      </div>
    </div>
    <img :src="$getAssetsImages('home/img-tx.png')" alt="" />
  </div>
  <div class="home-content flex">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const router = useRouter();
  const activePage = ref<any>(null);
  function changePage(path: any) {
    activePage.value = path;
    router.push(path);
  }
  onMounted(() => {
    // console.log(route.name);
    activePage.value = route.name;
  });
</script>

<style scoped lang="less">
  .home-header {
    width: 100%;
    height: 70px;
    background: #ffffff;
    box-shadow: 0px 3px 6px 0px rgba(128, 128, 128, 0.2);
    border-radius: 0px 0px 0px 0px;
    position: relative;
    z-index: 9;
    .left-logo {
      height: 100%;
    }
    .card-tab {
      height: 100%;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #666;
      .active {
        position: relative;
        font-weight: bold;
        color: #111f2c;
        &::after {
          position: absolute;
          content: '';
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: #0066ff;
          border-radius: 0px 0px 0px 0px;
        }
      }
    }
  }
  .home-content {
    height: calc(100% - 70px);
    background: #f4f5f7;
  }
</style>
