<template>
  <div class="search-box" v-click-outside="onClickOutside">
    <el-input
      @focus="showSearchResult"
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
    <div class="show-search-result" v-if="isVisible">
      <el-input
        ref="inpRef"
        :style="{ width: props.width ? props.width : '' }"
        :class="[searchType == 'topbar' ? 'topbar-search' : 'page-search', 'show-search-inp']"
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
      <div class="search-result">
        <template v-if="false && searchResult.length">
          <div class="search-item" v-for="item in searchResult" :key="item.id">
            <img class="search-item-img" :src="$getAssetsImages(fileType(item.extension))" />
            <div class="search-item-name" v-html="formatSearchName(item.name)"> </div>
          </div>
        </template>
        <template v-else>
          <el-empty description="暂无搜索结果" :image="$getAssetsImages('file/emptyimg.png')" :image-size="100" />
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
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
  import { ClickOutside as vClickOutside } from 'element-plus';
  import { fileType } from '@/utils/util';
  const searchInp = ref('');

  const inpRef = ref(null);
  const isVisible = ref(false);
  const emits = defineEmits(['searchTrigger']);
  const popoverRef = ref(null);

  const searchResult = ref([
    { name: '文件夹1', extension: 1, id: 1 },
    { name: '图片1', extension: 'jpg', id: 2 },
  ]);
  const formatSearchName = (name) => {
    let _name = '';
    if (name && searchInp.value) {
      let names = name.split(searchInp.value);
      names.forEach((e) => {
        if (names.indexOf(e) == names.length - 1) {
          _name += `<span>${e}</span>`;
        } else {
          _name += `<span>${e}</span><span style="background-color:#fff9a9;">${searchInp.value}</span>`;
        }
      });
    } else {
      return name;
    }
    return _name;
  };
  const showSearchResult = () => {
    isVisible.value = true;
    nextTick(() => {
      inpRef.value.focus();
    });
  };
  const onClickOutside = () => {
    isVisible.value = false;
  };
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
  .search-box {
    height: 100%;
    background: transparent;
    padding: 10px 30px;
    position: relative;
    .show-search-result {
      position: absolute;
      max-height: 300px;
      min-height: 100px;
      z-index: 9999;
      top: 0;
      left: 0;
      padding: 10px 30px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 6px 0 rgba(117, 117, 117, 0.4);
      display: flex;
      flex-direction: column;
    }
    .search {
      &-result {
        flex: auto;
        width: 100%;
        padding: 0 10px;

        overflow: auto;
        .emptySearch {
          text-align: center;
        }
      }
      &-item {
        display: flex;
        align-items: center;
        margin-top: 18px;
        cursor: pointer;

        &-name {
          font-size: 14px;
          margin-left: 6px;
          color: #31373d;
          line-height: 14px;
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          .select-text-bg {
            background: #fff9a9;
          }
        }
      }
    }
  }
  .search-right {
    display: flex;
    align-items: center;
  }
</style>
