<template>
  <el-dialog
    v-model="modelShow"
    class="self-dialog"
    append-to-body
    :title="`${isAdd ? '新增' : '修改'}${fileType == 'folder' ? '文件夹' : '文件'}`"
    width="500"
    center
  >
    <div class="box-wrapper px-30">
      <el-form-item :label="fileType == 'folder' ? '文件夹名称：' : '文件名称：'">
        <el-input v-model="name" style="width: 300px" placeholder="请输入文件夹名称" />
      </el-form-item>
      <el-form-item label="到期时间：" v-if="isExpireTime">
        <el-date-picker v-model="expiration_time" type="date" placeholder="请选择到期时间" />
      </el-form-item>
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
  import { addFolderApi, updateFolderApi, updateFileApi } from '@/api/file';
  import { ElLoading } from 'element-plus';
  const emits = defineEmits(['listRefresh']);
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const modelShow = ref(false);
  const name = ref('');
  const isExpireTime = ref(false);
  const expiration_time = ref('');
  const folderQuery = inject('folderQuery');
  const folderId = ref('');
  const isAdd = ref(true);
  const fileType = ref('folder');
  const handleConfirm = async () => {
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    try {
      if (!name.value) {
        throw new Error(`请输入${fileType == 'folder' ? '文件夹名称：' : '文件名称：'}`);
      }
      if (isExpireTime.value && !expiration_time.value) {
        throw new Error(`请选择文件的到期时间`);
      }
      const api = isAdd.value ? addFolderApi : fileType.value == 'folder' ? updateFolderApi : updateFileApi;
      const data = {
        ...folderQuery.value,
        name: name.value,
      };
      if (isExpireTime.value) {
        data.expiration_time = expiration_time.value;
      }
      if (!isAdd.value) {
        data.id = folderId.value;
        delete data.parent_id;
      }
      const res = await api(data);
      loading.close();
      console.log(res);
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      $message.success(isAdd.value ? '创建成功' : '修改成功');
      emits('listRefresh');
      modelShow.value = false;
    } catch (err) {
      loading.close();
      console.log(err);
      $message.error(err.message);
    }
  };
  const open = (data = {}, type = 'folder', _isExpireTime) => {
    const { name: _name, id: _id, expiration_time: _expiration_time = '' } = data;
    if (_name && _id) {
      name.value = _name;
      folderId.value = _id;
      isAdd.value = false;
      fileType.value = type;
      expiration_time.value = _expiration_time;
    } else {
      name.value = '';
      folderId.value = '';
      isAdd.value = true;
    }
    isExpireTime.value = type != 'folder' && _isExpireTime;
    modelShow.value = true;
  };
  defineExpose({
    open,
  });
</script>
