<template>
  <div class="home-header flex-between pl-24 pr-40">
    <div class="flex-between left-logo">
      <img :src="$getAssetsImages('logo/logo.png')" alt="" />
      <div class="card-tab flex">
        <div :class="{ active: activePage == '/price' }" @click="changePage('/price')" class="no-select cursor-pointer mr-50 ml-130 flex-center"
          >报价系统</div
        >
        <div :class="{ active: activePage == '/file' }" @click="changePage('/file')" class="no-select cursor-pointer flex-center">文件管理</div>
      </div>
    </div>
    <el-dropdown placement="bottom">
      <img :src="$getAssetsImages('home/img-tx.png')" class="w-45px h-45px" alt="" />
      <template #dropdown>
        <div class="login-out">
          <div class="info flex-center">
            <div style="flex: 0 0 100px" class="flex-center">
              <img :src="$getAssetsImages('home/img-tx.png')" alt="" class="w-66px h-66px" />
            </div>
            <div style="flex: 0 0 228px">
              <div class="t1">北京万达电力工程有限公司</div>
              <div class="t2 my-8">账号 : 15614063168</div>
              <div class="t2">地区：北京市-丰台区</div>
            </div>
          </div>
          <div class="h-55px flex-center t3"> 退出登录 </div>
        </div>
      </template>
    </el-dropdown>
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
  // const activePage = ref<any>(null);
  // 默认激活的菜单
  const activePage = computed(() => {
    const path = route.path;
    let activePath = path;
    if (path !== undefined && path.lastIndexOf('/') > 0) {
      const tmpPath = path.substring(1, path.length);
      activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'));
    }
    return activePath;
  });
  function changePage(path: any) {
    console.log(path);
    router.push(path);
  }
  onMounted(() => {
    // console.log(route.name);
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
  .login-out {
    width: 328px;
    height: 164px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(33, 52, 95, 0.3);
    border-radius: 8px 8px 8px 8px;
    .info {
      height: 109px;
      background: url('@/assets/images/home/bg-idcard.png') no-repeat;
    }
    .t1 {
      height: 21px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #171b1e;
    }
    .t2 {
      height: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #4e6780;
    }
    .t3 {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      cursor: pointer;
    }
    div {
      cursor: default;
    }
  }
</style>
