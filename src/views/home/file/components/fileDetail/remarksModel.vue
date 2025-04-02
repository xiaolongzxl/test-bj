<template>
  <el-dialog v-model="modelShow" append-to-body class="self-dialog" :title="props.title" width="500" center>
    <div class="box-wrapper">
      <el-input v-model="remark" style="width: 400px" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" :placeholder="`请输入${props.title}`" />
    </div>
    <template #footer>
      <div class="footer-btn center">
        <el-button color="#F2F3F5" @click="modelShow = false">取消</el-button>
        <el-button color="#197CFA" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  const props = defineProps({
    title: {
      type: String,
      default: '备注信息',
    },
    flag: {
      type: String,
      default: 'normal',
    },
  });
  import { updateFolderApi, updateFileApi, updateHistoryVer } from '@/api/file';
  import { ElLoading } from 'element-plus';
  import { getIsFolder } from '@/utils/util';

  const emits = defineEmits(['detailRefresh']);
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const remark = ref('');
  const folderQuery = inject('folderQuery');
  const folderId = ref('');

  const fileType = ref('folder');

  const modelShow = ref(false);
  const handleOpen = (content, id, extension) => {
    console.log(extension);
    fileType.value = getIsFolder(extension) ? 'folder' : 'file';
    remark.value = content || '';
    folderId.value = id;
    modelShow.value = true;
  };
  const handleConfirm = async () => {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
      if (!remark.value) {
        throw new Error(`请输入${props.flag == 'normal' ? '说明信息' : '备注信息'}`);
      }

      const data = {
        folder_category_id: folderQuery.value.folder_category_id,
        remark: remark.value,
        id: folderId.value,
      };
      if (props.flag != 'normal') {
        delete data.folder_category_id;
      }
      const api = fileType.value == 'folder' ? updateFolderApi : props.flag == 'normal' ? updateFileApi : updateHistoryVer;
      const res = await api(data);
      loading.close();
      console.log(res);
      modelShow.value = false;
      emits('detailRefresh');
    } catch (err) {
      loading.close();
      console.log(err);
      $message.error(err?.msg || err?.message);
    }
  };

  defineExpose({
    handleOpen,
  });
</script>
<style lang="less" scoped>
  .box-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
