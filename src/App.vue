<template>
  <router-view v-slot="{ Component, route }">
    <component :key="route.name" v-if="!route.meta.keepAlive" :is="Component" />
    <keep-alive>
      <component :key="route.name" v-if="route.meta.keepAlive" :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
  // const bus = getCurrentInstance()?.appContext.config.globalProperties.Bus;
  // bus.on('name', () => {});

  onBeforeMount(() => {
    document.ondrop = () => false;
    document.ondragover = () => false;
    document.ondragenter = () => false;
  });
</script>

<style scoped lang="less">
  #app-content {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    overflow: hidden;
  }
</style>
<style>
  .viewer-container {
    z-index: 999999 !important;
  }
</style>
