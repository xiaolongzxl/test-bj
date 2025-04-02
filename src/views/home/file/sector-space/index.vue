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
          <BreadCrumbs :activeBread="activeBread" @routeChange="routeChange" />
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
        @dbClick="dblclick"
        v-model:dataList="dataList"
        :fileShowType="fileShowType"
        @listRefresh="handleRefresh"
      />
    </div>
    <div class="contain-right"><FileDetail :file="clickFile" /> </div>
  </div>
</template>
<script setup name="SectorSpaceCategory">
  import SelfTable from '@/views/home/file/components/selfTable.vue';

  import Search from '@/views/home/file/components/search.vue';
  import BreadCrumbs from '@/views/home/file/components/breadCrumbs.vue';
  import FileShow from '@/views/home/file/components/changeFileShowType.vue';
  import FileDetail from '@/views/home/file/components/fileDetail/index.vue';
  import { fileType } from '@/utils/util';
  import { getFileListApi } from '@/api/file';

  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  const fileShowType = ref('ggst');
  const input1 = ref('');
  const loading = ref(false);
  const dataList = ref([]);
  const checkedList = ref([]);
  const clickFile = ref({});
  const route = useRoute();
  const router = useRouter();
  const tableLoading = ref(false);

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

  const folderQuery = ref({
    folder_category_id: null,
    parent_id: '0',
  });
  const activeBread = computed(() => {
    if (folderQuery.value.parent_id == '0') {
      return folderQuery.value.folder_category_id;
    } else {
      return folderQuery.value.parent_id;
    }
  });
  const btnCheckedList = computed({
    get: () => {
      return dataList.value.filter((e) => checkedList.value.includes(e.open)).map((e) => ({ name: e.name, extension: e.extension, id: e.id }));
    },
    set: (vals) => {
      checkedList.value = vals.map((e) => e.open) || [];
    },
  });

  watch(
    () => route.params,
    (n) => {
      nextTick(() => {
        folderQuery.value.folder_category_id = route.params.cateId;
        folderQuery.value.parent_id = route.params.folderId;
        handleRefresh();
      });
    },
    {
      deep: true,
    }
  );
  const activeRouteValue = computed(() => {
    return fileMenuStore().allRoutes.find((e) => e.meta.id == folderQuery.value.folder_category_id);
  });
  const init = () => {
    fileShowType.value = 'ggst';
    input1.value = '';
    dataList.value = [];
    checkedList.value = [];
    clickFile.value = {};
    getFileList();
  };
  const handleRefresh = () => {
    input1.value = '';
    checkedList.value = [];
    clickFile.value = {
      id: folderQuery.value.parent_id,
      extension: '1',
    };
    dataList.value = [];
    getFileList();
  };

  const getFileList = async () => {
    try {
      tableLoading.value = true;
      const res = await getFileListApi(folderQuery.value);
      tableLoading.value = false;

      if (res.code != 200) {
        throw new Error(res.msg);
      } else {
        dataList.value = res.data.map((e) => {
          return {
            ...e,

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
    clickFile.value = item;
  };
  const dblclick = (item) => {
    if (item) {
      routeChange({ type: 1, id: item.id });
    }
  };
  const routeChange = (item) => {
    if (item.type == 2) {
      folderQuery.value.parent_id = 0;
    } else {
      folderQuery.value.parent_id = item.id;
    }
    let path = route.meta.route;
    router.push(`${path}/${folderQuery.value.folder_category_id}/${folderQuery.value.parent_id}`);
  };
  onMounted(() => {
    folderQuery.value.folder_category_id = route.params.cateId;
    folderQuery.value.parent_id = route.params.folderId;
    init();
  });
  provide('checkedList', checkedList);
  provide('folderQuery', folderQuery);
</script>
<style lang="less" scoped>
  @import '../components/common.less';
</style>
