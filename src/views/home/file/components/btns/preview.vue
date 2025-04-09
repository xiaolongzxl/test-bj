<template>
  <el-dialog
    class="self-dialog"
    append-to-body
    title="预览"
    v-model="showModel"
    :width="['word', 'excel', 'ppt', 'pdf', 'video'].includes(rowType) ? 1100 : 600"
    center
    destroy-on-close
  >
    <div class="preview-wrapper">
      <div v-if="loading">加载中...</div>
      <div v-else-if="error">加载失败：{{ errorMessage }}</div>
      <div v-else class="file-preview-container">
        <!-- Office文件预览 -->
        <iframe
          frameborder="0"
          style="width: 100%; height: 100%"
          v-if="['word', 'excel', 'ppt', 'pdf'].includes(rowType)"
          :src="previewUrl"
          class="office-preview"
        />
        <div class="flex-center" v-else-if="rowType === 'image'">
          <img class="img-preview" :src="previewUrl" />
        </div>
        <!-- 媒体文件预览 -->
        <video v-else-if="rowType === 'video'" controls class="media-preview" />
        <audio v-else-if="rowType === 'audio'" controls class="media-preview" />

        <!-- 不支持预览的格式 -->
        <div v-else class="unsupported">
          该格式不支持预览，请下载查看
          <!-- <button @click="handleDownload">下载文件</button> -->
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  import { fileType, getIsFolder, downLoadFile } from '@/utils/util';
  const loading = ref(false);
  const error = ref(false);
  const row = ref();
  const showModel = ref(false);
  const rowType = computed(() => {
    return fileType(row.value?.extension, null, 'type');
  });
  const previewUrl = computed(() => {
    let path = `http://dlwz.souxianlan.com${row.value.path}`;
    if (['word', 'excel', 'ppt'].includes(rowType.value)) {
      return `https://view.officeapps.live.com/op/view.aspx?src=${decodeURIComponent(path)}`;
    }
    return path;
  });
  const open = (data) => {
    row.value = data;
    showModel.value = true;
  };
  const init = () => {
    let path = `http://dlwz.souxianlan.com${props.lineRow.path}`;
  };

  defineExpose({
    open,
  });
</script>
<style lang="less" scoped>
  .preview-wrapper {
    padding: 10px 30px;
    .office-preview {
      min-height: 650px;
    }
    .img-preview {
      min-height: 140px;
    }
  }
</style>
