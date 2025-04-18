<template>
  <div class="search-box" :style="boxStyle" v-click-outside="onClickOutside">
    <el-input
      @focus="showSearchResult"
      :style="{ width: props.width ? props.width : '' }"
      :class="searchType == 'topbar' ? 'topbar-search' : 'page-search'"
      v-model="searchInp"
      @input="changeSearchInp"
      @keydown.enter="handleSearch"
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
    <div class="show-search-result" :style="boxStyle" v-if="isVisible">
      <el-input
        ref="inpRef"
        @keydown.enter="handleSearch"
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
      <div class="search-result" v-loading="loading">
        <template v-if="searchResult.length">
          <div class="search-item" v-for="item in searchResult" :key="item.open" @click="handleCheckItem(item)">
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
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  import { getFileListApi } from '@/api/file';
  const props = defineProps({
    searchVal: {
      type: String,
      default: '',
    },
    boxStyle: {
      type: Object,
    },
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
  const route = useRoute();
  const searchInp = ref('');
  const inpRef = ref(null);
  const isVisible = ref(false);
  const emits = defineEmits(['searchTrigger', 'update:searchVal', 'changeChecked']);
  const popoverRef = ref(null);
  const loading = ref(false);
  const emitQuery = props.searchType == 'pageSearch' && inject('folderQuery');
  const searchResult = ref([]);
  // const folderQuery =props.searchType == 'topbar' ? ref({}): inject('folderQuery');
  watch(
    () => props.searchVal,
    (val) => {
      searchInp.value = val;
    }
  );

  const folderQuery = computed(() => {
    const data = {
      folder_category_id: '',
      parent_id: '0',
    };
    if (props.searchType == 'topbar') {
      const { cateId, folderId } = route.params;
      data.folder_category_id = cateId;
      data.parent_id = folderId;
    } else {
      console.log(emitQuery);
      const { folder_category_id, parent_id } = emitQuery.value;
      data.folder_category_id = folder_category_id;
      data.parent_id = parent_id;
    }
    console.log(data);
    return data;
  });
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
    if (props.searchType == 'onlySearch') return;
    isVisible.value = true;
    nextTick(() => {
      inpRef.value.focus();
    });
  };
  const onClickOutside = () => {
    isVisible.value = false;
  };
  const handleSearch = () => {
    // if (!searchInp.value) return;
    if (props.searchType != 'onlySearch') {
      getSearchResult();
    }
    emits('searchTrigger', searchInp.value);
  };
  const getSearchResult = async () => {
    if (!searchInp.value) return;
    console.log(folderQuery.value);
    loading.value = true;
    try {
      const res = await getFileListApi({ ...folderQuery.value, type: props.searchType == 'topbar' ? '1' : '2', keyword: searchInp.value });
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      loading.value = false;
      searchResult.value = res.data.map((e) => {
        return {
          ...e,
          extension: e.extension ? e.extension : e.name.split('.')[e.name.split('.').length - 1],
        };
      });
    } catch (err) {
      searchResult.value = [];
      loading.value = false;
      $message.error(err?.msg || err?.message);
    }
  };
  const changeSearchInp = () => {
    if (searchInp.value == '') {
      searchResult.value = [];
    }
    emits('update:searchVal', searchInp.value);
  };
  const handleCheckItem = (item) => {
    emits('changeChecked', item);
    searchInp.value = '';
    searchResult.value = [];
    isVisible.value = false;
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
