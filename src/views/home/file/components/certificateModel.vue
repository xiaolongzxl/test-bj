<template>
  <el-dialog v-model="modelShow" class="self-dialog" title="上传证书" width="500" center>
    <div class="box-wrapper">
      <el-form :model="form" label-width="auto">
        <el-form-item label="到期时间："> <el-date-picker v-model="form.time" type="date" placeholder="请选择到期时间" /> </el-form-item>
        <el-form-item label="文件选择：">
          <div class="upload-file-box">
            <el-upload
              multiple
              :action="uploadFileUrl"
              :before-upload="handleBeforeUpload"
              :file-list="form.files"
              :on-error="handleUploadError"
              :on-exceed="handleExceed"
              :on-success="handleUploadSuccess"
              :show-file-list="false"
              :headers="headers"
              class="upload-file-uploader"
              ref="fileUpload"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
            <!-- 文件列表 -->
            <transition-group class="upload-list-wrapper" name="el-fade-in-linear" tag="ul">
              <li :key="file.uid" class="upload-item" v-for="(file, index) in form.files">
                <img :src="$getAssetsImages('file/icon-uploadWord.png')" />
                <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank" class="upload-name">
                  <div class="el-icon-document"> {{ getFileName(file.name) }} </div>
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
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const modelShow = ref(false);
  const uploadFileUrl = ref('');
  const headers = ref({});
  const form = ref({
    time: '',
    files: [
      {
        id: 132,
        url: 'ascoboaisc',
        name: 'asjuic',
      },
      {
        id: 13452,
        url: 'ascoboaisc',
        name: 'asjuic',
      },
    ],
  });
  const handleConfirm = () => {};
  const handleBeforeUpload = () => {};
  const handleUploadSuccess = () => {};
  const handleUploadError = () => {};
  const handleDelete = () => {};
  // 获取文件名称
  function getFileName(name) {
    // 如果是url那么取最后的名字 如果不是直接返回
    if (name.lastIndexOf('/') > -1) {
      return name.slice(name.lastIndexOf('/') + 1);
    } else {
      return name;
    }
  }
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
