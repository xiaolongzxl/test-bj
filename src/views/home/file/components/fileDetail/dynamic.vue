<template>
  <div class="dynamic-list" v-infinite-scroll="getList" :infinite-scroll-disabled="loading || nomore">
    <div class="dynamic-item" v-for="item in dynamicList" :key="item.id">
      <div class="dynamic-item-avatar" :style="'background-color:' + getColor()">{{ item.firstName }}</div>
      <div class="dynamic-item-info">
        <div class="dynamic-item-info-top flex-center">
          <div class="dynamic-item-name">{{ item.id }}</div>
          <div class="dynamic-time">{{ item.create_time }}</div>
        </div>
        <div class="dynamic-item-dynamic">{{ item.description }}</div>
        <div class="dynamic-item-file">{{ item.name }}</div>
      </div>
    </div>
    <div class="tip" v-if="loading">加载中...</div>
    <div class="tip" v-if="nomore" @click="getList">我也是有底线的~~</div>
  </div>
</template>
<script setup>
  import { dynamicListApi } from '@/api/file';
  const props = defineProps({
    file: {
      type: Object,
      default: () => ({}),
    },
  });
  const getColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };
  const loading = ref(false);
  const nomore = ref(false);
  const dynamicList = ref([]);
  const page = ref(1);
  const size = ref(20);
  const getList = async () => {
    if (loading.value) return;
    try {
      loading.value = true;
      const res = await dynamicListApi({
        page: page.value,
        file_id: props.file.id,
      });
      loading.value = false;
      if (res.data.length < size.value) {
        nomore.value = true;
      }
      page.value = page.value + 1;
      dynamicList.value = dynamicList.value.concat(
        res.data.map((e) => {
          e.firstName = e.id[0];
          return e;
        })
      );
    } catch (err) {
      loading.value = false;
    }
  };
  const init = () => {
    page.value = 1;
    dynamicList.value = [];
    getList();
  };
  watch(
    () => props.file,
    () => {
      init();
    },
    {
      immediate: true,
    }
  );

  onMounted(() => {
    init;
  });
</script>
<style lang="less" scoped>
  .dynamic {
    &-list {
      height: 100%;
      overflow: auto;
      padding: 0 30px;
    }

    &-item {
      padding: 18px 0;
      display: flex;
      align-items: flex-start;

      &-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        flex: none;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
      }
      &-info {
        flex: auto;
        margin: 0 12px;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
      }
      &-name {
        color: #31373d;
      }
      &-dynamic {
        margin: 10px 0 16px;
        font-size: 12px;
        color: #757c8f;
      }
      &-file {
        font-size: 14px;
        color: #31373d;
      }
    }
    &-time {
      margin-left: auto;
      flex: none;
      color: #757c8f;
      font-size: 12px;
    }
  }
  .tip {
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    margin-bottom: 4px;
  }
</style>
