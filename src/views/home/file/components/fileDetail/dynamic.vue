<template>
  <div class="dynamic-list">
    <div class="dynamic-item" v-for="item in dynamicList" :key="item.id">
      <div class="dynamic-item-avatar" :style="'background-color:' + getColor()">{{ item.firstName }}</div>
      <div class="dynamic-item-info">
        <div class="dynamic-item-name">{{ item.name }}</div>
        <div class="dynamic-item-dynamic">{{ item.dynamic }}</div>
        <div class="dynamic-item-file">{{ item.file }}</div>
      </div>
      <div class="dynamic-time">{{ item.time }}</div>
    </div>
  </div>
</template>
<script setup>
  const getColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };
  const dynamicList = ref([]);
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
    }
  }
</style>
