<template>
  <div class="fileDetail" v-if="file">
    <div class="file-info">
      <div class="file-title">
        <img :src="$getAssetsImages(fileType(file?.type))" />
        <span class="ml1">{{ file.name }}</span>
      </div>
      <div class="file-line tip">
        <div class="file-line-label"> 说明： </div>
        <div class="file-line-value"> </div>
        <div class="file-line-icon effect-btn">
          <svg-icon name="edit"></svg-icon>
        </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 大小： </div>
        <div class="file-line-value"> </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 创建时间： </div>
        <div class="file-line-value"> </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 修改时间： </div>
        <div class="file-line-value"> </div>
      </div>
    </div>
    <el-tabs v-model="activeTab" class="file-tabs" @tab-click="handleClick">
      <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabs" :key="item.value"></el-tab-pane>
    </el-tabs>
    <div class="file-other">
      <template v-if="activeTab == '1'">
        <User />
      </template>
      <template v-else-if="activeTab == '2'">
        <History />
      </template>
      <template v-else-if="activeTab == '3'">
        <Dynamic />
      </template>
    </div>
  </div>
</template>
<script setup>
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import History from './history.vue';
  import User from './user.vue';
  import Dynamic from './dynamic.vue';
  import { fileType } from '@/utils/util';
  const props = defineProps({
    file: {
      type: Object,
      default: () => {},
    },
  });
  const tabs = ref([
    {
      label: '成员列表',
      value: '1',
    },
    {
      label: '历史版本',
      value: '2',
    },
    {
      label: '动态',
      value: '3',
    },
  ]);
  const activeTab = ref('3');
  const handleClick = () => {};
  watch(
    () => props.file,
    (val) => {
      console.log(val);
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="less" scoped>
  .fileDetail {
    flex: none;
    height: 100%;
    width: 380px;
    box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
    padding: 33px 0;
    display: flex;
    flex-direction: column;
    .file {
      &-info {
        flex: none;
        overflow: hidden;
        padding: 0 30px;
      }
      &-title {
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #495060;
        line-height: 20px;
      }
      &-line {
        display: flex;
        align-items: center;
        margin-top: 20px;
        &-label {
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 16px;
        }
        &-value {
          flex: auto;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &-icon {
          color: #000;
        }
      }
      &-tabs {
        flex: none;
        margin-top: 40px;
        padding: 0 30px;
      }
      &-other {
        flex: auto;
        overflow: hidden;
      }
    }
  }
</style>
