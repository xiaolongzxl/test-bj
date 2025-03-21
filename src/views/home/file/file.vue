<template>
  <div class="file-contain">
    <div class="left-navbar">
      <leftBar />
    </div>
    <div class="right-content">
      <div class="content-title" v-if="topbar == 'title'"
        ><div class="content-title-text">{{ title }}</div>
      </div>
      <div class="content-title" v-if="topbar == 'search'">
        <Search @searchTrigger="searchTrigger" />
      </div>

      <div class="content-body">
        <RouterView v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :key="route.name" :is="Component" />
          </transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup>
  import leftBar from './components/left-navbar/index.vue';
  import Search from './components/search.vue';
  const route = useRoute();
  const title = computed(() => {
    return route.meta.title;
  });
  const topbar = computed(() => {
    return route.meta.topbar;
  });
  const topSearch = ref('');

  const searchTrigger = (value) => {
    console.log('搜索结果:', value);
    topSearch.value = value;
  };
  provide('topSearch', topSearch.value);
</script>

<style scoped lang="less">
  .file-contain {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    background: #f4f5f7;
  }
  .left-navbar {
    flex: none;
    width: 260px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(128, 128, 128, 0.2);
  }
  .right-content {
    overflow: hidden;
    margin: 20px;
    flex: auto;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
    border-radius: 8px 8px 8px 8px;
    .content-title {
      flex: none;
      height: 60px;
      box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
      border-radius: 8px 8px 0px 0px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      &-text {
        padding: 18px 0;
        font-weight: bold;
        font-size: 18px;
        color: #333333;
        line-height: 27px;
        display: inline-block;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          border-radius: 4px;
          height: 4px;
          width: 100%;
          background: linear-gradient(130deg, #3796ff 0%, #005eff 100%);
        }
      }
    }
    .content-body {
      flex: auto;
      overflow: hidden;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
