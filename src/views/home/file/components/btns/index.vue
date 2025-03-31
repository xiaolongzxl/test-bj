<template>
  <template v-if="btnType.includes('add')">
    <Add @addBtnClick="handleAddBtnClick" />
  </template>
  <template v-if="btnType.includes('upload')">
    <Upload @uploadBtnClick="handleUploadBtnClick" @listRefresh="listRefresh" />
  </template>
  <template v-if="btnType.includes('download')">
    <el-button text bg size="large" class="ml-10" :disabled="props.checkedFiles.length == 0">下载</el-button></template
  >
  <template v-if="btnType.includes('move')"><Move @listRefresh="listRefresh" /></template>
  <template v-if="btnType.includes('copy')">
    <el-button :disabled="props.checkedFiles.length == 0" text bg size="large" plain class="ml-10">复制</el-button></template
  >
  <template v-if="btnType.includes('del')"
    ><el-button text bg size="large" @click="handleOpenMutliDel" :disabled="props.checkedFiles.length == 0">删除</el-button>
  </template>
  <template v-if="btnType.includes('tablePreview')">
    <el-button class="mr-4" plain><svg-icon name="preview" class="mr-4"></svg-icon> 预览 </el-button>
  </template>
  <template v-if="btnType.includes('tableDownload')">
    <el-button class="mr-4" plain><svg-icon name="table-download" class="mr-4"></svg-icon> 下载 </el-button>
  </template>
  <template v-if="btnType.includes('tableMore')">
    <TableMore @tableCommand="handleTableCommand" :tableMoreType="props.tableMoreType" />
  </template>
  <template v-if="btnType.includes('tableCopy')">
    <TableCopy :lineRow="lineRow" />
  </template>
  <template v-if="btnType.includes('tableHistory')">
    <TableHistory :lineRow="lineRow" />
  </template>
  <template v-if="btnType.includes('tableDel')">
    <el-button class="tableBtn" @click="handleTrigger('tableDel', props.lineRow)">删除</el-button>
  </template>
  <template v-if="btnType.includes('tableRestore')">
    <el-button class="tableBtn">还原</el-button>
  </template>
  <template v-if="btnType.includes('tableAlwaysRemove')">
    <el-button class="tableBtn">彻底删除</el-button>
  </template>
  <template v-if="btnType.includes('tableProperty')">
    <TableProperty :linerow="lineRow" />
  </template>
  <div>
    <handleFolder ref="handleFolderRef" @listRefresh="emits('listRefresh')" />
    <handleDelModel ref="handleDelModelRef" @listRefresh="emits('listRefresh')" />
  </div>
</template>
<script setup>
  import Add from './add.vue';
  import Upload from './upload.vue';

  import Move from './move.vue';
  import TableMore from './tableMore.vue';
  import TableCopy from './tableCopy.vue';
  import TableHistory from './tableHistory.vue';
  import TableProperty from './tableProperty.vue';
  import { fileType } from '@/utils/util';
  import handleFolder from './handleFolder.vue';
  import handleDelModel from './delModel.vue';
  const handleFolderRef = ref(null);
  const handleDelModelRef = ref(null);
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
    lineRow: {
      type: Object,
      default: () => ({}),
    },
    tableMoreType: {
      type: String,
      default: 'table',
    },
  });

  const emits = defineEmits(['btnClickTrigger', 'update:checkedFiles', 'listRefresh']);
  const handleAddBtnClick = () => {
    handleFolderRef.value.open();
  };
  const handleUploadBtnClick = (item) => {
    console.log('点击了上传', item);
  };
  const handleTableCommand = (command) => {
    if (command == 'rename') {
      handleFolderRef.value.open(props.lineRow.name, props.lineRow.id);
    } else if (command == 'del') {
      handleOpenSignelDel();
    }
    console.log('点击了表格更多操作', command);
  };
  const handleDownload = (url, fileName) => {
    const parallelDownload = (files) => {
      files.forEach((file) => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    };
  };
  const handleOpenMutliDel = () => {
    handleDelModelRef.value.open(props.checkedFiles);
  };
  const handleOpenSignelDel = () => {
    handleDelModelRef.value.open(props.lineRow);
  };
  const handleChangeCheckedFiles = (item = []) => {
    emits('updeta:checkedFiles', item);
  };
  const handleTrigger = (type, item) => {
    emits('btnClickTrigger', { type, item });
  };
  const listRefresh = () => {
    emits('listRefresh');
  };
</script>
<style lang="less">
  .tableBtn {
    border: 1px solid #ececec;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    font-family:
      Microsoft YaHei,
      Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
  }
</style>
