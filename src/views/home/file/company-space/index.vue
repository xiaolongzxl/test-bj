<template>
  <div class="contain">
    <div class="contain-left">
      <div class="btns">
        <div class="btns-left">
          <FileBtns :btnType="['add', 'upload']" @listRefresh="handleRefresh" />
        </div>
        <div class="btns-right">
          <FileBtns v-model:checkedFiles="btnCheckedList" :btnType="['download', 'move', 'copy', 'del']" @listRefresh="handleRefresh" />
        </div>
      </div>
      <div class="search">
        <div class="search-left">
          <BreadCrumbs :addLevel="addLevel" :activeBread="activeBread" @routeChange="routeChange" />
        </div>
        <div class="search-right">
          <Search searchType="pageSearch" />
          <FileShow v-model:fileShowType="fileShowType" />
        </div>
      </div>
      <SelfTable
        :row="row"
        :loading="tableLoading"
        v-model:checkedList="checkedList"
        @clickFile="handleClickFile"
        v-model:dataList="dataList"
        :fileShowType="fileShowType"
        @listRefresh="handleRefresh"
      />
    </div>
    <div class="contain-right"><FileDetail :file="clickFile" /> </div>
    <UploadCeri />
  </div>
</template>
<script setup>
  import SelfTable from '@/views/home/file/components/selfTable.vue';
  import UploadCeri from '../components/certificateModel.vue';
  import Search from '@/views/home/file/components/search.vue';
  import BreadCrumbs from '@/views/home/file/components/breadCrumbs.vue';
  import FileShow from '@/views/home/file/components/changeFileShowType.vue';
  import FileDetail from '@/views/home/file/components/fileDetail/index.vue';
  import { fileType } from '@/utils/util';
  import { getFileListApi } from '@/api/file';
  const activeBread = ref('电缆项目1-文件夹');
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const fileShowType = ref('ggst');
  const input1 = ref('');
  const loading = ref(false);
  const addLevel = ref([{ name: '电缆项目1-文件夹', id: 2, path: '456' }]);
  const dataList = ref([
    // { name: 'name1', creatby: '姓名', updateTime: '1', size: '2', id: 1, type: 'wjj' },
    // { name: 'name2', creatby: '姓名', updateTime: '2', size: '3', id: 2, type: 'word' },
    // { name: 'name3', creatby: '姓名', updateTime: '3', size: '4', id: 3, type: 'ppt' },
    // { name: 'name4', creatby: '姓名', updateTime: '3', size: '4', id: 4, type: 'excel' },
  ]);
  const checkedList = ref([]);
  const clickFile = ref({});
  const route = useRoute();

  const tableLoading = ref(false);
  const routeCateId = ref('');
  const row = ref([
    {
      key: 'drag',
      label: '',
      minWidth: 40,
      align: 'center',
    },
    {
      key: 'select',
      label: '',
      minWidth: 40,
      align: 'center',
    },
    {
      isSort: true,
      key: 'name',
      prop: 'name',
      addType: true,
      label: '文件名称',
      minWidth: 120,
      align: 'center',
      'show-overflow-tooltip': true,
    },
    {
      key: 'nickname',
      prop: 'nickname',
      label: '创建人',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'update_time',
      prop: 'update_time',
      isSort: true,
      label: '修改时间',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'size',
      prop: 'size',
      isSort: true,
      label: '文件大小',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'handle',
      label: '操作',
      minWidth: 200,
      align: 'center',
    },
  ]);

  const pageFolderId = ref('0');
  const folderQuery = ref({
    folder_category_id: null,
    parent_id: '0',
  });
  const btnCheckedList = computed({
    get: () => {
      // ({ name, extension, id })
      return dataList.value.filter((e) => checkedList.value.includes(e.open)).map((e) => ({ name: e.name, extension: e.extension, id: e.id }));
    },
    set: (vals) => {
      checkedList.value = vals.map((e) => e.open) || [];
    },
  });
  watch(
    () => route.params.cateId,
    (n) => {
      nextTick(() => {
        folderQuery.value.folder_category_id = route.params.cateId;
        init();
      });
    },
    {
      immediate: true,
    }
  );
  const activeRouteValue = computed(() => {
    return fileMenuStore().allRoutes.find((e) => e.meta.id == folderQuery.value.folder_category_id);
  });

  const init = () => {
    fileShowType.value = 'ggst';
    input1.value = '';
    activeBread.value = '';
    addLevel.value = [];
    // dataList.value = [];
    checkedList.value = [];
    clickFile.value = {};
    console.log(activeRouteValue.value);
    getFileList();
  };
  const handleRefresh = () => {
    input1.value = '';
    activeBread.value = '';
    addLevel.value = [];
    // dataList.value = [];
    checkedList.value = [];
    clickFile.value = {};
    console.log(activeRouteValue.value);
    getFileList();
  };

  const dblclick = () => {};
  const getFileList = async () => {
    try {
      tableLoading.value = true;
      const res = await getFileListApi(folderQuery.value);
      tableLoading.value = false;
      console.log(res);
      if (res.code != 200) {
        throw new Error(res.msg);
      } else {
        dataList.value = res.data.map((e) => {
          return {
            ...e,
            open: e.open ? e.open : `wj_${e.id}`,
            extension: e.extension ? e.extension : e.name.split('.')[e.name.split('.').length - 1],
          };
        });
      }
    } catch (err) {
      tableLoading.value = false;
      $message.error(err.message);
      console.log(err);
    }
  };
  const handleClickFile = (item) => {
    console.log(item);
    clickFile.value = item;
  };
  const routeChange = (item) => {};
  provide('checkedList', checkedList);
  provide('folderQuery', folderQuery);
</script>
<style lang="less" scoped>
  @import '../components/common.less';
</style>
