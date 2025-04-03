<template>
  <template v-if="btnType.includes('add')">
    <Add @addBtnClick="handleAddBtnClick" />
  </template>
  <template v-if="btnType.includes('upload')">
    <Upload @listRefresh="listRefresh" />
  </template>
  <template v-if="btnType.includes('download')">
    <el-button text bg size="large" class="ml-10" :disabled="props.checkedFiles.length == 0" @click="handleDownload('mutli')"
      >下载</el-button
    ></template
  >
  <template v-if="btnType.includes('move')"
    ><el-button text bg size="large" @click="handleOpenMove('mutli')" :disabled="props.checkedFiles.length == 0">移动</el-button></template
  >
  <template v-if="btnType.includes('copy')">
    <el-button :disabled="props.checkedFiles.length == 0" text bg size="large" plain class="ml-10" @click="handleOpenCopy('mutli')"
      >复制</el-button
    ></template
  >
  <template v-if="btnType.includes('del')"
    ><el-button text bg size="large" @click="handleOpenDel('mutli')" :disabled="props.checkedFiles.length == 0">删除</el-button>
  </template>
  <template v-if="btnType.includes('tablePreview')">
    <el-button class="mr-4" plain :disabled="getIsFolder(props.lineRow.extension)"><svg-icon name="preview" class="mr-4"></svg-icon> 预览 </el-button>
  </template>
  <template v-if="btnType.includes('tableDownload')">
    <el-button class="mr-4" plain :disabled="getIsFolder(props.lineRow.extension)" @click="handleDownload('single')"
      ><svg-icon name="table-download" class="mr-4"></svg-icon> 下载
    </el-button>
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
    <CopyMoveModel ref="copyMoveModelRef" @listRefresh="emits('listRefresh')" />
  </div>
</template>
<script setup>
  import Add from './add.vue';
  import Upload from './upload.vue';

  import TableMore from './tableMore.vue';
  import TableCopy from './tableCopy.vue';
  import TableHistory from './tableHistory.vue';
  import TableProperty from './tableProperty.vue';
  import { fileType, getIsFolder, downLoadFile } from '@/utils/util';
  import handleFolder from './handleFolder.vue';
  import handleDelModel from './delModel.vue';
  import CopyMoveModel from './copyMoveModel.vue';
  import { ElLoading } from 'element-plus';

  const folderQuery = inject('folderQuery');
  const handleFolderRef = ref(null);
  const handleDelModelRef = ref(null);
  const copyMoveModelRef = ref(null);
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
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

  const handleTableCommand = (command) => {
    if (command == 'rename') {
      handleFolderRef.value.open(props.lineRow.name, props.lineRow.id, getIsFolder(props.lineRow.extension) ? 'folder' : 'file');
    } else if (command == 'move') {
      handleOpenMove('single');
    } else if (command == 'copy') {
      handleOpenCopy('single');
    } else if (command == 'del') {
      handleOpenDel('single');
    }
    console.log('点击了表格更多操作', command);
  };
  const handleDownload = (flag) => {
    let files = flag == 'mutli' ? [...props.checkedFiles] : [props.lineRow];
    let name = files[0].name;
    files = files.map((e) => ({ id: e.id, type: getIsFolder(e.extension) ? '1' : '2' }));
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    const res = downLoadFile(files, folderQuery.value.folder_category_id, name)
      .then((res) => {
        console.log(res);
        loading.close();
        handleChangeCheckedFiles();
      })
      .catch((err) => {
        loading.close();
        $message.error(err?.message || err?.msg);
      });
  };
  const handleOpenDel = (flag = 'mutli') => {
    handleDelModelRef.value.open(flag == 'mutli' ? props.checkedFiles : [props.lineRow]);
  };

  const handleOpenMove = (flag = 'mutli') => {
    copyMoveModelRef.value.open(flag == 'mutli' ? props.checkedFiles : [props.lineRow], 'move');
  };
  const handleOpenCopy = (flag = 'mutli') => {
    copyMoveModelRef.value.open(flag == 'mutli' ? props.checkedFiles : [props.lineRow], 'copy');
  };
  const handleChangeCheckedFiles = (item = []) => {
    emits('update:checkedFiles', item);
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
