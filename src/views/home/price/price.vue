<template>
  <div class="left-navbar">
    <div class="top-navbar-self flex-between pl-15 pr-11 cursor-pointer">
      <div>电力金具</div>
      <img :src="$getAssetsImages('price/icon-more.png')" alt="" />
    </div>
  </div>
  <div class="right-content"></div>
</template>

<script setup lang="ts">
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
</script>

<style scoped lang="less">
  .left-navbar {
    flex: 0 0 260px;
    max-width: 260px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(128, 128, 128, 0.2);
    border-radius: 0px 0px 0px 0px;
    .top-navbar-self {
      margin: 11px;
      width: 238px;
      height: 38px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #cccccc;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
    .text {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
  }
  .right-content {
    flex: 0 0 calc(100% - 260px);
  }
</style>
