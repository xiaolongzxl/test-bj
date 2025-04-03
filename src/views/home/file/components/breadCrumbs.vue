<template>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in levelList" :key="item.id" @click="handlePush(item)">
      <span class="breadCrumb-text cursor-pointer" :class="{ active: props.activeBread == item.id, none: item.type == 3 }">
        {{ item.name }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
  import { getNavigation } from '@/api/file';

  const routeList = ref([]);
  const folderQuery = inject('folderQuery');
  const props = defineProps({
    activeBread: {
      type: [String, Number],
      default: '',
    },
    flag: {
      type: String,
      default: 'normal',
    },
  });
  const emits = defineEmits(['routeChange']);
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const levelList = ref([]);
  const getBreadcrumb = async () => {
    try {
      if (!folderQuery.value.folder_category_id) return;
      const res = await getNavigation(folderQuery.value);

      if (res.code != 200) {
        throw new Error(res.msg);
      }
      levelList.value = res.data;
      fileMenuStore().setBreadCrumb(res.data);
    } catch (err) {
      $message.error(err?.msg || err?.message);
    }
  };
  watch(
    () => folderQuery.value,
    () => {
      if (props.flag == 'normal') {
        getBreadcrumb();
      }
    },
    { immediate: true, deep: true }
  );
  watch(
    () => props.activeBread,
    () => {
      if (props.flag != 'normal') {
        getBreadcrumb();
      }
    },
    { immediate: true, deep: true }
  );
  const handlePush = (item) => {
    if (item.type != '3') {
      emits('routeChange', item);
    }
  };
</script>
<style lang="less" scoped>
  .breadCrumb-text {
    &.active {
      color: #000;
      font-weight: bold;
      cursor: not-allowed;
    }
    &.none {
      cursor: not-allowed;
    }
  }
</style>
