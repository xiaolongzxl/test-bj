<template>
  <el-dialog v-model="modelShow" class="self-dialog" title="上传证书" width="500" center>
    <div class="box-wrapper">
      <el-form :model="form" label-width="auto">
        <el-form-item label="到期时间："> <el-date-picker v-model="form.expiration_time" type="date" placeholder="请选择到期时间" /> </el-form-item>
        <el-form-item label="文件选择：">
          <div class="upload-file-box">
            <el-upload
              multiple
              :on-change="handleChange"
              :auto-upload="false"
              :file-list="form.files"
              :show-file-list="false"
              class="upload-file-uploader"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
            <!-- 文件列表 -->
            <transition-group class="upload-list-wrapper" name="el-fade-in-linear" tag="ul">
              <li :key="file.uid" class="upload-item" v-for="(file, index) in form.files">
                <img :src="$getAssetsImages('file/icon-uploadWord.png')" />
                <el-link :underline="false" target="_blank" class="upload-name">
                  <div class="el-icon-document"> {{ file.name }} </div>
                </el-link>
                <div class="upload-del">
                  <el-link :underline="false" @click="handleDelete(index)" type="info">
                    <el-icon><Delete /></el-icon>
                    删除</el-link
                  >
                </div>
              </li>
            </transition-group>
          </div>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button color="#F2F3F5" @click="modelShow = false">取消</el-button>
        <el-button color="#197CFA" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  const modelShow = ref(false);
  import { fileUpload } from '@/utils/util';
  import { ElLoading } from 'element-plus';
  const folderQuery = inject('folderQuery');
  const emits = defineEmits(['listRefresh']);

  const form = ref({
    expiration_time: '',
    files: [],
  });
  const handleOpen = () => {
    form.value = { expiration_time: '', files: [] };
    modelShow.value = true;
  };
  const handleChange = (e) => {
    const { name, raw } = e;
    form.value.files.push({ name, raw });
  };
  const handleDelete = (idx) => {
    form.value.files.splice(idx, 1);
  };
  const handleConfirm = async () => {
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    const query = {
      folder_category_id: folderQuery.value.folder_category_id,
      folder_id: folderQuery.value.parent_id,
      type: 2,
      expiration_time: form.value.expiration_time,
    };
    const files = form.value.files.map((e) => e.raw);
    const res = await fileUpload(files, query);

    let flag = 'success';
    loading.close();
    if (res.length) {
      res.forEach((element) => {
        if (element.status == 'error') {
          $message.error(element.error);
        }
        if (element.status != 'success') {
          flag = 'error';
        }
      });
      if (flag == 'success') {
        $message.success('上传成功');
      }
      emits('listRefresh');
      handleClose();
    }
    console.log(form.value);
  };
  const handleClose = () => {
    form.value = {};
    modelShow.value = false;
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
    .upload-file-box {
      flex: 1;
    }
    .upload-list-wrapper {
      margin-top: 10px;
    }
    .upload-item {
      line-height: 2;

      position: relative;
      display: flex;

      align-items: center;
    }
    .upload-name {
      margin-left: 10px;
      display: inline-block;
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #197cfa;
      flex: auto;
    }
  }
</style>
