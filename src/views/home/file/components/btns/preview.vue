<template>
  <el-dialog
    key="preview"
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
        <video v-else-if="rowType === 'video'" :src="previewUrl" controls class="video-preview" :class="videoType" />
        <audio v-else-if="rowType === 'audio'" :src="previewUrl" controls class="media-preview" />

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
  import { fileType, getIsFolder, downLoadFile, getAllPath } from '@/utils/util';
  const loading = ref(false);
  const error = ref(false);
  const row = ref();
  const showModel = ref(false);
  const videoType = ref('');
  const rowType = computed(() => {
    const type = fileType(row.value?.extension, null, 'type');
    if (type == 'video') {
      getVideoType();
    }
    return type;
  });
  const previewUrl = computed(() => {
    // let path = `http://dlwz.souxianlan.com${row.value.path}`;
    let path = row.value.path;
    if (['word', 'excel', 'ppt'].includes(rowType.value)) {
      return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(path)}`;
    }

    return path;
  });
  const open = (data) => {
    row.value = data;

    showModel.value = true;
  };
  const getVideoType = async () => {
    const video = document.createElement('video');
    video.preload = 'metadata'; // 关键优化：只加载元数据
    video.src = row.value.path;

    // 将video元素移出可视区域（避免布局抖动）
    video.style.position = 'fixed';
    video.style.left = '-9999px';

    document.body.appendChild(video);

    try {
      // 等待元数据加载完成
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = () => reject(new Error('加载失败'));
        setTimeout(() => reject(new Error('超时')), 5000); // 5秒超时
      });

      const { videoWidth: w, videoHeight: h } = video;
      videoType.value = w > h ? 'landscape' : 'portrait';
    } finally {
      video.remove(); // 清理资源
      video.src = ''; // 中断可能进行的加载
    }
  };
  const init = () => {
    // let path = getAllPath(props.lineRow.path);
    let path = props.lineRow.path;
  };

  defineExpose({
    open,
  });
</script>
<style lang="less" scoped>
  .preview-wrapper {
    padding: 10px 30px;
    .file-preview-container {
      text-align: center;
    }
    .office-preview {
      min-height: 650px;
    }
    .img-preview {
      min-height: 140px;
      max-width: 100%;
    }
    .media-preview {
      width: 100%;
    }
    .video-preview {
      max-width: 50%;
      &.landscape {
        width: 100%;
        max-width: 100%;
      }
      &.portrait {
        max-width: 50%;
      }
    }
    .unsupported {
      text-align: center;
    }
  }
</style>
