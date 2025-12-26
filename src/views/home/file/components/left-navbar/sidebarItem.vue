<template>
  <div v-if="!item.meta?.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <RouterLink draggable="true" class="routerlink" :to="resolvePath(oneChild.path)" @dragstart="(e) => onDragStart(e, resolvePath(oneChild.path))">
        <el-menu-item :index="resolvePath(oneChild.path)">
          <div class="flex flex-center menuitem">
            <img v-if="oneChild.meta?.icon" class="menuitem-icon" :src="$getAssetsImages(imgIcon)" />
            <!-- <div class="menuitem-icon" v-else></div> -->
            <div class="menuitem-text">{{ oneChild.meta?.title }}</div>
          </div>
        </el-menu-item>
      </RouterLink>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template #title>
        <div class="flex flex-center menuitem">
          <img class="menuitem-icon" :src="$getAssetsImages(imgIcon)" />
          <div class="menuitem-text">{{ item.meta?.title }}</div>
        </div>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :isChangePath="child.isChangePath"
        :changePathData="{
          ...child,
        }"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
  import { da } from 'element-plus/es/locale/index.mjs';
  import SidebarItem from './sidebarItem.vue';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const isDragging = ref(false);
  const dragData = ref({});
  const wasDraggedOutside = ref(false);
  const props = defineProps({
    isChangePath: {
      type: Boolean,
      default: false,
    },
    changePathData: {
      type: Object,
      default: () => {},
    },
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  });
  const oneChild = ref([]);
  const activeMenu = inject('activeMenu');
  const imgIcon = computed(() => {
    let imgIcon = `file/menu/menu-${oneChild.meta?.icon || props.item?.meta?.icon}.png`;
    return imgIcon;
    // if (activeMenu.value === props.item.path) {
    //   return imgIcon + '-ac.png';
    // } else {
    //   return imgIcon + '.png';
    // }
  });
  const hasOneShowingChild = (children = [], parent) => {
    if (!children) {
      children = [];
    }

    const showingChildren = children.filter((item) => {
      if (item.hidden) {
        return false;
      } else {
        // Temp set(will be used if only has one showing child)
        oneChild.value = item;
        return true;
      }
    });

    // When there is only one child router, the child router is displayed by default
    // if (showingChildren.length === 1) {
    //   return true;
    // }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
      oneChild.value = { ...parent, path: '', noShowingChildren: true };

      return true;
    }

    return false;
  };
  const resolvePath = (routePath, routeQuery) => {
    return getPath(props.basePath + '/' + routePath);
  };
  const pathClick = (item) => {};
  const getPath = (p) => {
    if (p.length === 0 || !p || p == 'undefined') {
      return p;
    }
    let res = p.replace('//', '/');
    let resArr = res.split('/');

    if (res[res.length - 1] === '/') {
      return res.slice(0, res.length - 1);
    }

    return res;
  };

  const onDragStart = (e, path) => {
    if (!window.electronAPI) return;
    const dt = e.dataTransfer;
    if (!dt) return;

    // 👇 关键1：设置无效数据 + 禁用拖放效果
    dt.setData('text/plain', ''); // 设为空
    dt.effectAllowed = 'copyMove';

    dragData.value = path;
    isDragging.value = true;

    startDragTracking();
  };

  const startDragTracking = () => {
    const handleDragOver = (e) => {
      if (!isDragging.value || !dragData.value) return;

      const bounds = window.electronAPI?.getWindowBounds?.();
      if (!bounds) return;
      const { height, width } = bounds;
      // 获取当前窗口可视区域尺寸
      const { clientWidth, clientHeight } = document.documentElement;
      const mouseX = e.screenX; // 相对于浏览器 viewport 左上角
      const mouseY = e.screenY;

      // 判断是否在 viewport 外（留 5px 容差）

      const outside =
        mouseX < clientWidth - 10 || mouseX > clientWidth + width + 10 || mouseY < clientHeight - 10 || mouseY > clientHeight + height + 10;

      if (outside) {
        wasDraggedOutside.value = true;
      }
    };

    const handleDragEnd = () => {
      // 👇 核心逻辑：只有拖出过 + 松手，才创建窗口
      if (wasDraggedOutside.value) {
        window.electronAPI?.createDetachedWindow(dragData.value);
      }

      cleanup();
    };
    const cleanup = () => {
      isDragging.value = false;
      dragData.value = null;
      window.removeEventListener('dragover', handleDragOver, true);
      window.removeEventListener('dragend', handleDragEnd, true);
    };
    window.addEventListener('dragover', handleDragOver, true);
    window.addEventListener('dragend', handleDragEnd, true);
  };
</script>
<style scoped lang="less">
  .el-menu-item,
  .el-sub-menu {
    transition:
      background 0.3s,
      color 0.3s;
    .menuitem {
      padding: 20px 0;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 20px;
      &-icon {
        margin-right: 14px;
        width: 18px;
        height: 18px;
      }
    }
    &.is-active {
      background: #e9efff;
      .menuitem {
        color: #000;
      }
    }
  }
  .el-sub-menu {
    .el-menu-item {
      --el-menu-level-padding: 32px;
      .menuitem {
        font-size: 15px;
      }
    }
  }
</style>
