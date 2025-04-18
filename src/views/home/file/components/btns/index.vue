<template>
  <template v-if="btnType.includes('add') && hasPremission(10)">
    <Add :addFolderType="addFolderType" @addBtnClick="handleAddBtnClick" />
  </template>
  <template v-if="btnType.includes('upload') && hasPremission(2)">
    <Upload @listRefresh="listRefresh" :isTrigger="props.isTriggerUpload" @triggerUpload="handleTrigger('upload', {})" />
  </template>
  <template v-if="btnType.includes('download') && hasPremission(5) && props.checkedFiles.length > 0">
    <el-button text bg size="large" class="ml-10" :disabled="props.checkedFiles.length == 0" @click="handleDownload('mutli')"
      >下载</el-button
    ></template
  >
  <template v-if="btnType.includes('move') && hasPremission(7) && props.checkedFiles.length > 0"
    ><el-button text bg size="large" @click="handleOpenMove('mutli')" :disabled="props.checkedFiles.length == 0">移动</el-button></template
  >
  <template v-if="btnType.includes('copy') && hasPremission(8) && props.checkedFiles.length > 0">
    <el-button :disabled="props.checkedFiles.length == 0" text bg size="large" plain class="ml-10" @click="handleOpenCopy('mutli')"
      >复制</el-button
    ></template
  >
  <template v-if="btnType.includes('del') && props.checkedFiles.length > 0 && hasPremission(1)"
    ><el-button text bg size="large" @click="handleOpenDel('mutli')" :disabled="props.checkedFiles.length == 0">删除</el-button>
  </template>
  <template v-if="btnType.includes('tablePreview')">
    <el-button @click="handlePreview" class="mr-4" plain :disabled="getIsFolder(props.lineRow.extension) || notPreview"
      ><svg-icon name="preview" class="mr-4"></svg-icon> 预览
    </el-button>
  </template>
  <template v-if="btnType.includes('tableDownload') && hasPremission(5)">
    <el-button class="mr-4" plain @click="handleDownload('single')"><svg-icon name="table-download" class="mr-4"></svg-icon> 下载 </el-button>
  </template>
  <template v-if="btnType.includes('tableMore') && hasPremission(7)">
    <TableMore @tableCommand="handleTableCommand" :isExpireTime="props.isExpireTime" :tableMoreType="props.tableMoreType" />
  </template>
  <template v-if="btnType.includes('tableCopy') && hasPremission(8)">
    <TableCopy :lineRow="lineRow" />
  </template>
  <template v-if="btnType.includes('tableHistory')">
    <TableHistory :lineRow="lineRow" />
  </template>
  <template v-if="btnType.includes('tableDel') && hasPremission(1)">
    <el-button class="tableBtn" @click="handleTrigger('tableDel', props.lineRow)">删除</el-button>
  </template>
  <template v-if="btnType.includes('tableRestore')">
    <el-button class="tableBtn" @click="handleTrigger('tableRestore', props.lineRow)">还原</el-button>
  </template>
  <template v-if="btnType.includes('tableAlwaysRemove')">
    <el-button class="tableBtn" @click="handleTrigger('tableAlwaysRemove', props.lineRow)">彻底删除</el-button>
  </template>
  <template v-if="btnType.includes('tableProperty') && hasPremission(3)">
    <TableProperty :lineRow="lineRow" />
  </template>
  <div>
    <handleFolder ref="handleFolderRef" @listRefresh="emits('listRefresh')" />
    <handleDelModel ref="handleDelModelRef" @listRefresh="emits('listRefresh')" />
    <CopyMoveModel ref="copyMoveModelRef" @listRefresh="emits('listRefresh')" />
    <PreviewModel ref="previewModelRef" />
  </div>
</template>
<script setup>
  import Add from './add.vue';
  import Upload from './upload.vue';

  import TableMore from './tableMore.vue';
  import TableCopy from './tableCopy.vue';
  import TableHistory from './tableHistory.vue';
  import TableProperty from './tableProperty.vue';
  import { fileType, getIsFolder, downLoadFile, downLoadSingle } from '@/utils/util';
  import handleFolder from './handleFolder.vue';
  import handleDelModel from './delModel.vue';
  import CopyMoveModel from './copyMoveModel.vue';
  import { ElLoading } from 'element-plus';
  import PreviewModel from './preview.vue';

  const hasPremission = fileMenuStore().hasPremission;
  const folderQuery = inject('folderQuery');
  const handleFolderRef = ref(null);
  const handleDelModelRef = ref(null);
  const copyMoveModelRef = ref(null);
  const previewModelRef = ref(null);
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
    isTriggerUpload: {
      type: Boolean,
      default: false,
    },
    isExpireTime: {
      type: Boolean,
      default: false,
    },
    addFolderType: {
      type: String,
      default: '1',
    },
  });

  const emits = defineEmits(['btnClickTrigger', 'update:checkedFiles', 'listRefresh']);
  const handleAddBtnClick = () => {
    handleFolderRef.value.open();
  };
  const notPreview = computed(() => {
    return !['word', 'excel', 'ppt', 'pdf', 'video', 'audio', 'image'].includes(fileType(props.lineRow.extension, false, 'type'));
  });
  const handleTableCommand = (command) => {
    if (command == 'rename' || command == 'update') {
      const { name, id, expiration_time, extension } = props.lineRow;
      const data = {
        name,
        id,
        expiration_time,
      };
      handleFolderRef.value.open(data, getIsFolder(extension) ? 'folder' : 'file', props.isExpireTime);
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
    const originFiles = flag == 'mutli' ? [...props.checkedFiles] : [props.lineRow];
    const files = originFiles.map((e) => ({ id: e.id, type: getIsFolder(e.extension) ? '1' : '2' }));
    const folderObj = originFiles.find((e) => getIsFolder(e.extension)) || [];
    const name = folderObj?.name ? folderObj?.name : originFiles[0].name;
    console.log(name);
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    const api = flag == 'mutli' || getIsFolder(originFiles[0].extension) ? downLoadFile : downLoadSingle;
    const res = api(files, folderQuery.value.folder_category_id, name)
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
  const handlePreview = () => {
    previewModelRef.value.open(props.lineRow);
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
