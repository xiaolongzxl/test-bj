<template>
  <template v-if="btnType.includes('add')">
    <el-popover popper-class="btn-popover" placement="bottom" trigger="click" key="add">
      <template #reference>
        <el-button type="info" plain>新建</el-button>
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
  <template v-if="btnType.includes('upload')">
    <el-popover popper-class="btn-popover" placement="bottom" trigger="click" key="upload">
      <template #reference>
        <el-button type="info" plain>上传</el-button>
      </template>
      <div class="popover-wrapper uploadPopover">
        <div class="popover-top">上传</div>
        <div class="popover-line" v-for="item in uploadBtns" :key="item.line">
          <div class="popover-line-item" v-for="iitem in item.data" :key="iitem.type" @click="handleUploadBtnClick(iitem)">
            <img :src="$getAssetsImages(fileType(iitem.type))" />
            <div class="popover-line-item-text">{{ iitem.name }}</div>
          </div>
        </div>
      </div>
    </el-popover>
  </template>
  <template v-if="btnType.includes('download')"> <el-button type="info" plain>下载</el-button></template>
  <template v-if="btnType.includes('move')"> <el-button type="info" plain>移动</el-button></template>
  <template v-if="btnType.includes('copy')"> <el-button type="info" plain>复制</el-button></template>
  <template v-if="btnType.includes('del')"> <el-button type="info" plain @click="handleDel">删除</el-button></template>
  <template v-if="true">
    <el-dialog class="self-dialog" title="提示" v-model="delShow" width="500" center>
      <div class="del-wrapper">
        <div class="del-title">你确定要将“研究报告.docx”删除吗？</div>
        <div class="del-tip">删除后文件(夹）将在回收站保留30天</div>
        <div class="del-btns footer-btn">
          <el-button color="#F2F3F5">下次再说</el-button>
          <el-button type="danger">删除</el-button>
        </div>
      </div>
    </el-dialog>
  </template>
</template>
<script setup>
  import { fileType } from '@/utils/util';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const props = defineProps({
    btnType: {
      type: Array,
      default: () => [],
    },
  });
  const delShow = ref(true);
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
    {
      line: 2,
      data: [
        {
          type: 'word',
          name: '文档',
        },
        {
          type: 'excel',
          name: '表格',
        },
        {
          type: 'ppt',
          name: '幻灯片',
        },
      ],
    },
  ]);
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
  const handleDel = () => {};
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
  .del {
    &-wrapper {
      padding: 0 40px 25px;
    }
    &-title {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      line-height: 14px;
    }
    &-tip {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #999999;
      line-height: 14px;
      margin-top: 24px;
    }
    &-btns {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
