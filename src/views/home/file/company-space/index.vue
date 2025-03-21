<template>
  <div class="contain">
    <div class="contain-left">
      <div class="btns">
        <div class="btns-left">
          <FileBtns :btnType="['add', 'upload']" />
        </div>
        <div class="btns-right">
          <FileBtns :btnType="['download', 'move', 'copy', 'del']" />
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
      <SelfTable :row="row" v-model:checkedList="checkedList" @clickFile="handleClickFile" v-model:dataList="dataList" :fileShowType="fileShowType" />
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
  const activeBread = ref('电缆项目1-文件夹');
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const fileShowType = ref('ggst');
  const input1 = ref('');
  const loading = ref(false);
  const addLevel = ref([{ name: '电缆项目1-文件夹', id: 2, path: '456' }]);
  const dataList = ref([
    { name: 'name1', creatby: '姓名', updateTime: '1', size: '2', id: 1, type: 'wjj' },
    { name: 'name2', creatby: '姓名', updateTime: '2', size: '3', id: 2, type: 'word' },
    { name: 'name3', creatby: '姓名', updateTime: '3', size: '4', id: 3, type: 'ppt' },
    { name: 'name4', creatby: '姓名', updateTime: '3', size: '4', id: 4, type: 'excel' },
  ]);
  const checkedList = ref([1, 2]);
  const clickFile = ref({});
  const route = useRoute();
  import fileMenuStore from '@/store/fileMenu';
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
    },
    {
      key: 'creatby',
      prop: 'creatby',
      label: '创建人',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'updateTime',
      prop: 'updateTime',
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
      minWidth: 160,
      align: 'center',
    },
  ]);

  watch(
    () => route.params.cateId,
    (n) => {
      nextTick(() => {
        routeCateId.value = route.params.cateId;
        init();
      });
    },
    {
      immediate: true,
    }
  );
  const init = () => {
    fileShowType.value = 'dlb';
    input1.value = '';
    activeBread.value = '';
    addLevel.value = [];
    // dataList.value = [];
    checkedList.value = [];
    clickFile.value = {};
    getFileList();
  };

  const dblclick = () => {};
  const getFileList = () => {};
  const handleClickFile = (item) => {
    console.log(item);
    clickFile.value = item;
  };
  const routeChange = (item) => {};
  provide('checkedList', checkedList.value);
</script>
<style lang="less" scoped>
  @import '../components/common.less';
</style>
