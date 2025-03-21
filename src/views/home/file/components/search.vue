<template>
  <el-input
    :style="{ width: props.width ? props.width : '' }"
    :class="searchType == 'topbar' ? 'topbar-search' : 'page-search'"
    v-model="searchInp"
    :placeholder="props?.placeHolder ? props.placeHolder : searchType == 'topbar' ? '请输入关键词搜索相关文件...' : '搜索当前文件夹'"
  >
    <template #prefix v-if="searchType == 'topbar'">
      <img :src="$getAssetsImages('file/icon-search.png')" />
    </template>
    <template #suffix>
      <div class="search-right cursor-pointer" @click="handleSearch">
        <img v-if="searchType != 'topbar'" :src="$getAssetsImages('file/icon-search.png')" />
        <span>搜索</span>
      </div>
    </template>
  </el-input>
</template>
<script setup>
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const props = defineProps({
    searchType: {
      type: String,
      default: 'topbar',
    },
    width: {
      type: String,
    },
    placeHolder: {
      type: String,
    },
  });

  const searchInp = ref('');
  const emits = defineEmits(['searchTrigger']);

  const handleSearch = () => {
    emits('searchTrigger', searchInp.value);
  };
</script>

<style scoped lang="less">
  .topbar-search {
    width: 520px;
    --el-border-radius-base: 20px;
    --el-input-height: 38px;
    --el-fill-color-blank: #f5f5f5;
    --el-text-color-regular: #999999;
    --el-border-color: transparent;
    --el-border-color-hover: transparent;
  }
  .page-search {
    width: 212px;
    --el-border-radius-base: 4px;
    --el-input-height: 32px;
    --el-fill-color-blank: #f5f5f5;
    --el-text-color-regular: #999999;
    --el-border-color: transparent;
    --el-border-color-hover: transparent;
  }
  .search-right {
    display: flex;
    align-items: center;
  }
</style>
