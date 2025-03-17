<template>
  <div v-if="!item.meta?.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <RouterLink :to="resolvePath(oneChild.path)">
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
  import SidebarItem from './sidebarItem.vue';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;

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
    if (showingChildren.length === 1) {
      return true;
    }

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
