<template>
  <el-dialog
    key="preview"
    class="self-dialog"
    append-to-body
    title="预览"
    v-model="showModel"
    :width="['word', 'excel', 'ppt', 'pdf', 'video'].includes(rowType) && row.is_see == 1 ? 1100 : 600"
    center
    destroy-on-close
  >
    <div class="preview-wrapper">
      <div v-if="loading">加载中...</div>
      <div v-else-if="error">加载失败：{{ errorMessage }}</div>
      <div v-else class="file-preview-container">
        <template v-if="['word', 'excel', 'ppt', 'pdf'].includes(rowType)">
          <!-- Office文件预览 -->
          <iframe v-if="row.is_see == 1" frameborder="0" style="width: 100%; height: 100%" :src="previewUrl" class="office-preview" />
          <!-- 不支持预览的格式 -->
          <div v-else class="unsupported">
            <div>文件过大，请下载后查看<br /><br /></div>
            <el-button @click="handleDownload">下载文件</el-button>
          </div>
        </template>

        <div class="flex-center" style="overflow: hidden" ref="containerRef" v-else-if="rowType === 'image'">
          <img
            class="img-preview"
            :style="imageStyle"
            ref="imgRef"
            draggable="false"
            :src="previewUrl"
            @mousedown="handleMouseDown"
            @wheel.prevent="handleWheel"
          />
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
  import { fileType, getIsFolder, downLoadSingle, getAllPath } from '@/utils/util';
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
  const containerRef = ref(null);
  const imgRef = ref(null);
  const imgScale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  // 拖拽状态
  const isDragging = ref(false);
  let startX = 0;
  let startY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;

  const previewUrl = computed(() => {
    // let path = `http://dlwz.souxianlan.com${row.value.path}`;
    let path = row.value.path;
    if (['word', 'excel', 'ppt'].includes(rowType.value)) {
      // return `https://view.xdocin.com/view?src=${encodeURIComponent(path)}`;
      return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(path)}`;
    }

    return path;
  });
  // 计算图片样式
  const imageStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${imgScale.value})`,
    // transition: isDragging.value ? 'none' : 'transform 0.2s ease',
    // cursor: isDragging.value ? 'grabbing' : 'grab',
  }));
  const open = (data, folder_category_id) => {
    row.value = { ...data, folder_category_id };

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
  // 滚轮缩放
  const handleWheel = (e) => {
    if (!imgRef.value || !containerRef.value) return;

    const delta = e.deltaY > 0 ? -0.1 : 0.1; // 向下滚缩小，向上滚放大
    const newScale = Math.min(Math.max(imgScale.value + delta, 0.1), 5);

    // 获取鼠标相对于容器的位置（作为缩放中心）
    const rect = containerRef.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 当前图片在容器中的中心偏移
    const currentCenterX = -translateX.value + containerRef.value.offsetWidth / 2;
    const currentCenterY = -translateY.value + containerRef.value.offsetHeight / 2;

    // 计算缩放后的新偏移，使鼠标位置保持不变
    const ratio = newScale / imgScale.value;
    translateX.value = mouseX - (mouseX - translateX.value) * ratio;
    translateY.value = mouseY - (mouseY - translateY.value) * ratio;

    imgScale.value = newScale;
  };
  // 鼠标按下（开始拖动）
  const handleMouseDown = (e) => {
    console.log(0);
    if (e.button !== 0) return; // 只响应左键
    if (!containerRef.value) return;
    /* 阻止默认行为 */
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = true;
    /* 初始位置 */
    startX = e.clientX;
    startY = e.clientY;
    startTranslateX = translateX.value;
    startTranslateY = translateY.value;

    containerRef.value.style.cursor = 'grabbing';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 鼠标移动（拖动中）
  const handleMouseMove = (e) => {
    if (!isDragging.value) return;

    /* 获取偏移量 */
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    translateX.value = startTranslateX + dx;
    translateY.value = startTranslateY + dy;
  };

  // 鼠标松开
  const handleMouseUp = () => {
    isDragging.value = false;
    if (containerRef.value) {
      containerRef.value.style.cursor = '';
    }
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  const handleDownload = () => {
    // 创建隐藏的 <a> 标签并模拟点击
    // const link = document.createElement('a');
    // link.href = row.value.path;
    // link.setAttribute('download', `${row.value.name}`); // 设置下载文件名
    // document.body.appendChild(link);
    // link.click();

    // document.body.removeChild(link);

    downLoadSingle([row.value], row.value.folder_category_id, row.value.name);
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
      transform: scale(1);
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
