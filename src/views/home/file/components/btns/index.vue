<template>
  <template v-if="btnType.includes('add')">
    <Add @addBtnClick="handleAddBtnClick" />
  </template>
  <template v-if="btnType.includes('upload')">
    <Upload @uploadBtnClick="handleUploadBtnClick" />
  </template>
  <template v-if="btnType.includes('download')"> <el-button type="info" plain>下载</el-button></template>
  <template v-if="btnType.includes('move')"><Move /></template>
  <template v-if="btnType.includes('copy')"> <el-button type="info" plain class="ml-10">复制</el-button></template>
  <template v-if="btnType.includes('del')"><Del /></template>
</template>
<script setup>
  import Add from './add.vue';
  import Upload from './upload.vue';
  import Del from './del.vue';
  import Move from './move.vue';
  import { fileType } from '@/utils/util';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const props = defineProps({
    btnType: {
      type: Array,
      default: () => [],
    },
    checkedFiles: {
      type: Array,
      default: () => [],
    },
  });

  const uploadBtns = ref([
    {
      line: 1,
      data: [
        {
          type: 'wjj',
          name: '文件夹',
        },
        {
          type: 'any',
          name: '文件',
        },
      ],
    },
  ]);
  const handleAddBtnClick = (item) => {
    console.log('点击了新建', item);
  };
  const handleUploadBtnClick = (item) => {
    console.log('点击了上传', item);
  };
</script>
<style lang="less" scoped></style>
