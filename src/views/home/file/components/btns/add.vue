<template>
  <el-popover popper-class="btn-popover" placement="bottom" trigger="click" key="add">
    <template #reference>
      <el-button text bg size="large"
        >新建 <el-icon class="ml-4"><CaretBottom /></el-icon
      ></el-button>
    </template>
    <div class="popover-wrapper">
      <div class="popover-top">新建</div>
      <div class="popover-line" v-for="item in addBtns" :key="item.line">
        <div class="popover-line-item" v-for="iitem in item.data" :key="iitem.type" @click="handleAddBtnClick(iitem)">
          <img :src="$getAssetsImages(fileType(iitem.type))" />
          <div class="popover-line-item-text">{{ iitem.name }}</div>
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
  import { fileType } from '@/utils/util';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const emits = defineEmits(['addBtnClick']);
  const addBtns = ref([
    {
      line: 1,
      data: [
        {
          type: 'wjj',
          name: '文件夹',
        },
      ],
    },
    // {
    //   line: 2,
    //   data: [
    //     {
    //       type: 'word',
    //       name: '文档',
    //     },
    //     {
    //       type: 'excel',
    //       name: '表格',
    //     },
    //     {
    //       type: 'ppt',
    //       name: '幻灯片',
    //     },
    //   ],
    // },
  ]);
  const handleAddBtnClick = (item) => {
    console.log('点击了新建', item);
    emits('addBtnClick');
  };
</script>
<style lang="less" scoped>
  .popover {
    &-wrapper {
      background: #ffffff;
      box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
      border-radius: 12px 12px 12px 12px;
      padding: 20px 40px;
      &.uploadPopover {
        .popover-line {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
    &-top {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #000000;
      line-height: 20px;
      margin-bottom: 14px;
    }
    &-line {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      &-item {
        cursor: pointer;
        border-radius: 6px 6px 6px 6px;
        flex-basis: 33%;
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        &-text {
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          line-height: 16px;
          margin-top: 10px;
          white-space: nowrap;
        }
        &:hover {
          background: #f3f4f9;
        }
      }
    }
  }
</style>
