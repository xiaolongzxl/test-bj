<template>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in levelList" :key="item.path" @click="handlePush(item)">
      <span class="breadCrumb-text cursor-pointer" :class="active == (item.type == 'route' ? item.meta.title : item.name) ? 'active' : ''">
        {{ item.type == 'route' ? item.meta.title : item.name }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
  const route = useRoute();
  const router = useRouter();
  const routeList = ref([]);

  const props = defineProps({
    addLevel: {
      type: Object,
      default: () => [],
    },
  });
  const active = ref('二级分类1');
  const handlePush = (item) => {
    if (item.type != 'route') {
      console.log(item);
    }
  };
  const getBreadcrumb = () => {
    // only show routes with meta.title
    const matched = route.matched.filter((item) => item.meta && item.meta.title);
    const first = matched[0];

    if (!first) {
      return [];
    }

    routeList.value = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false).map((e) => ({ ...e, type: 'route' }));
  };
  getBreadcrumb();
  const levelList = computed(() => {
    if (props.addLevel.length) {
      return routeList.value.concat(props.addLevel);
    }
  });
</script>
<style lang="less" scoped>
  .breadCrumb-text {
    &.active {
      color: #000;
      font-weight: bold;
    }
  }
</style>
