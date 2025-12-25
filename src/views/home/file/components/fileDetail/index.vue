<template>
  <div ref="fileDetailEl" class="fileDetail" :style="`width:${rightWidth}px`" v-if="folderQuery?.folder_category_id">
    <div class="drag-handle" @mousedown="startResize"></div>
    <div class="file-info" v-loading="loading">
      <div class="file-title">
        <img class="flex-none" :src="$getAssetsImages(fileType(fileDetail?.extension))" />
        <span class="ml1 file-title-name">{{ fileDetail.name }}</span>
      </div>
      <div class="file-line tip" v-if="props.file.id != 0">
        <div class="file-line-label"> 说明： </div>
        <div class="file-line-value">{{ fileDetail.remark || '' }} </div>
        <div class="file-line-icon effect-btn" v-if="hasPremission(4)" @click="handleOpenRemark">
          <svg-icon name="edit"></svg-icon>
        </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 大小： </div>
        <div class="file-line-value"> {{ fileDetail.size }}</div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 创建时间： </div>
        <div class="file-line-value">{{ fileDetail.create_time }} </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 修改时间： </div>
        <div class="file-line-value">{{ fileDetail.update_time }} </div>
      </div>
    </div>
    <template v-if="isShowTab">
      <el-tabs v-model="activeTab" class="file-tabs" @tab-click="handleClick">
        <template v-for="item in tabs" :key="item.value">
          <el-tab-pane :label="item.label" :name="item.value" :key="item.value" v-if="!item.hidden"></el-tab-pane>
        </template>
      </el-tabs>
      <div class="file-other">
        <template v-if="activeTab == '1'">
          <User :file="file" />
        </template>
        <template v-else-if="activeTab == '2'">
          <History :file="file" @listRefresh="emits('listRefresh', props.file)" />
        </template>
        <template v-else-if="activeTab == '3'">
          <Dynamic :file="file" />
        </template>
      </div>
    </template>
  </div>
  <RemarkModel title="说明" @detailRefresh="handleGetDetail" ref="remarkModelRef" />
</template>
<script setup>
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  import { getFolderDetailApi, getFileDetailApi, getMenuDetailApi, setRightWidth } from '@/api/file';
  const emits = defineEmits(['listRefresh']);

  import History from './history.vue';
  import User from './user.vue';
  import Dynamic from './dynamic.vue';
  import { fileType, getIsFolder } from '@/utils/util';
  import RemarkModel from './remarksModel.vue';
  const route = useRoute();

  const folderQuery = inject('folderQuery');
  const rightWidth = inject('rightBarWidth');
  const loading = ref(false);
  const remarkModelRef = ref(null);
  const hasPremission = fileMenuStore().hasPremission;
  const props = defineProps({
    file: {
      type: Object,
      default: () => ({ id: '0', extension: 1 }),
    },
  });
  const isZg = computed(() => {
    return fileMenuStore().allRoutes.find((e) => e?.meta.fullpath == route.path)?.meta?.roleId == 1 || false;
  });
  const tabs = computed(() => {
    return [
      {
        label: '成员列表',
        hidden: !getIsFolder(props.file.extension) || route.name == 'PersonalSpace' || !isZg.value,
        value: '1',
      },
      {
        label: '历史版本',
        value: '2',
        hidden: getIsFolder(props.file.extension),
      },
      {
        label: '动态',
        value: '3',
        hidden: getIsFolder(props.file.extension),
      },
    ];
  });
  const activeTab = ref('1');
  const isShowTab = computed(() => {
    return tabs.value.filter((e) => !e.hidden).length >= 1;
  });
  const fileDetail = ref({});
  const fileDetailEl = ref(null);
  const isResizing = ref(false);
  let removeMouseMove = null;
  let removeMouseUp = null;
  let startX = 0; // 鼠标按下时的 X 坐标
  let startWidth = 0; // 拖拽开始时的原始宽度
  const newWidth = ref(0);
  const startResize = (e) => {
    if (!fileDetailEl.value) return;
    isResizing.value = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    e.preventDefault();
    // ✅ 记录初始状态
    startX = e.clientX;
    startWidth = parseInt(getComputedStyle(fileDetailEl.value).width, 10);
    // 定义 move 和 up 回调
    const onMouseMove = (e) => {
      if (!isResizing.value) return;
      // ✅ 计算鼠标移动的距离
      const deltaX = e.clientX - startX;
      newWidth.value = startWidth - deltaX;

      // 限制范围（按需调整）
      const minWidth = 250;
      const maxWidth = 600;
      console.log(newWidth.value, deltaX, startWidth);
      newWidth.value = Math.max(minWidth, Math.min(maxWidth, newWidth.value));

      fileDetailEl.value.style.width = `${newWidth.value}px`;
    };

    const onMouseUp = () => {
      if (!isResizing.value) return;

      isResizing.value = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setRightWidth(newWidth.value + '');
      // 清理事件
      if (removeMouseMove) removeMouseMove();
      if (removeMouseUp) removeMouseUp();
      removeMouseMove = null;
      removeMouseUp = null;
    };

    // 添加全局监听，并保存移除函数
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    removeMouseMove = () => document.removeEventListener('mousemove', onMouseMove);
    removeMouseUp = () => document.removeEventListener('mouseup', onMouseUp);
  };
  const handleClick = () => {};
  const handleGetDetail = async () => {
    if (!folderQuery.value?.folder_category_id) return;
    const { id, extension } = props?.file;
    loading.value = true;
    try {
      const data = {
        folder_category_id: folderQuery.value.folder_category_id,
      };
      if (!['0', 0].includes(id)) {
        data.id = id;
      }

      const api = ['0', 0].includes(id) ? getMenuDetailApi : getIsFolder(extension) ? getFolderDetailApi : getFileDetailApi;
      const res = await api(data);
      loading.value = false;
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      fileDetail.value = { ...props.file, ...res.data };
    } catch (err) {
      loading.value = false;
      $message.error(err?.message || err?.msg);
    }
  };
  isZg.value;
  console.log(rightWidth.value);
  const handleOpenRemark = () => {
    const { remark, id, extension } = fileDetail.value;

    remarkModelRef.value.handleOpen(remark, id, extension);
  };
  watch(
    () => props.file,
    (val) => {
      nextTick(() => {
        if (tabs.value.find((e) => e.value == activeTab.value)?.hidden) {
          activeTab.value = tabs.value.filter((e) => !e.hidden)[0]?.value || 1;
        }
        handleGetDetail();
      });
    },
    {
      immediate: true,
    }
  );

  /* 修改说明 */
  const handleChangeRemark = (val) => {};
  // 组件卸载时清理（防止内存泄漏）
  onUnmounted(() => {
    if (removeMouseMove) removeMouseMove();
    if (removeMouseUp) removeMouseUp();
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
</script>

<style lang="less" scoped>
  .fileDetail {
    flex: none;
    height: 100%;
    width: 380px;
    // box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
    padding: 33px 0;
    display: flex;
    flex-direction: column;
    position: relative;
    .drag-handle {
      left: 0;
      top: 0;
      width: 2px;
      height: 100%;
      cursor: col-resize;
      position: absolute;
      background: rgba(72, 94, 132, 0.1);
      filter: blur(1px);
    }
    .file {
      &-info {
        flex: none;
        overflow: hidden;
        padding: 0 30px;
      }
      &-title {
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #495060;
        line-height: 20px;
        display: flex;
        align-items: flex-start;
        overflow: hidden;
        &-name {
          overflow-wrap: break-word;
          word-break: break-all;

          flex: auto;
        }
      }
      &-line {
        display: flex;
        align-items: center;
        margin-top: 20px;
        &-label {
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 16px;
        }
        &-value {
          flex: auto;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &-icon {
          color: #000;
        }
      }
      &-tabs {
        flex: none;
        margin-top: 40px;
        padding: 0 30px;
      }
      &-other {
        flex: auto;
        overflow: hidden;
      }
    }
  }
</style>
