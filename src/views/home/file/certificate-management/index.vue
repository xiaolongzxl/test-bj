<template>
  <div class="contain">
    <div class="contain-left">
      <div class="btns">
        <div class="btns-left">
          <FileBtns @btnClickTrigger="handleTrigger" :isTriggerUpload="true" :btnType="['add', 'upload']" @listRefresh="handleRefresh" />
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
          <Search searchType="pageSearch" @changeChecked="handleChangeChecked" />
          <FileShow v-model:fileShowType="fileShowType" />
        </div>
      </div>
      <SelfTable
        :isCustomCardMore="true"
        :row="row"
        :loading="tableLoading"
        v-model:checkedList="checkedList"
        @clickFile="handleClickFile"
        @dbClick="dblclick"
        v-model:dataList="dataList"
        :fileShowType="fileShowType"
        @listRefresh="handleRefresh"
      >
        <template #handleCustom="{ row }">
          <Btns
            :isExpireTime="true"
            :btnType="['tableDownload', 'tableMore', getIsFolder(row.extension) ? '' : 'tablePreview']"
            :lineRow="row"
            @listRefresh="handleRefresh"
          />
        </template>
        <template #cardMore="{ row }">
          <Btns
            :isExpireTime="true"
            :btnType="['tableDownload', 'tableMore', getIsFolder(row.extension) ? '' : 'tablePreview']"
            :lineRow="row"
            @listRefresh="handleRefresh"
          />
        </template>
      </SelfTable>
    </div>
    <div class="contain-right"><FileDetail :file="clickFile" /> </div>
    <UploadModel ref="uploadModelRef" @listRefresh="handleRefresh" />
  </div>
</template>
<script setup name="CertificateManagement">
  import Btns from '@/views/home/file/components/btns/index.vue';
  import SelfTable from '@/views/home/file/components/selfTable.vue';
  import Search from '@/views/home/file/components/search.vue';
  import BreadCrumbs from '@/views/home/file/components/breadCrumbs.vue';
  import FileShow from '@/views/home/file/components/changeFileShowType.vue';
  import FileDetail from '@/views/home/file/components/fileDetail/index.vue';
  import UploadModel from '@/views/home/file/components/certificateModel.vue';
  import { fileType, getIsFolder } from '@/utils/util';
  import { getFileListApi } from '@/api/file';

  const props = defineProps({
    topbarSearchChecked: {
      type: Object,
      default: () => ({}),
    },
  });
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  const fileShowType = ref('dlb');

  const loading = ref(false);
  const dataList = ref([]);
  const checkedList = ref([]);
  const clickFile = ref({});
  const route = useRoute();
  const router = useRouter();
  const tableLoading = ref(false);
  const uploadModelRef = ref(null);

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
      key: 'expiration_time',
      prop: 'expiration_time',
      label: '到期时间',
      isSort: true,
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'update_time',
      prop: 'update_time',
      isSort: true,
      label: '修改时间',
      minWidth: 160,
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
      custom: true,
      label: '操作',
      minWidth: 240,
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
      return dataList.value
        .filter((e) => checkedList.value.includes(e.open))
        .map((e) => ({ name: e.name, extension: e.extension, id: e.id, open: e.open }));
    },
    set: (vals) => {
      checkedList.value = vals.map((e) => e.open) || [];
    },
  });

  watch(
    () => route.params,
    (n) => {
      nextTick(async () => {
        folderQuery.value.folder_category_id = route.params.cateId;
        folderQuery.value.parent_id = route.params.folderId;
        await handleRefresh();
        if (fileMenuStore().temporaryChecked && fileMenuStore().temporaryChecked.parent_id == route.params.folderId) {
          handleChangeChecked(fileMenuStore().temporaryChecked);
          fileMenuStore().clearTemporaryChecked();
        }
      });
    },
    {
      deep: true,
    }
  );

  const init = () => {
    fileShowType.value = 'dlb';

    dataList.value = [];
    checkedList.value = [];
    clickFile.value = {
      id: folderQuery.value.parent_id,
      extension: '1',
    };
    getFileList();
  };
  const handleRefresh = () => {
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
  const handleSearch = (e) => {
    searchResult.value = dataList.value
      .filter((el) => el.name.includes(e))
      .map((el) => ({ id: el.id, name: el.name, open: el.open, extension: el.extension }));
  };
  const handleChangeChecked = (e) => {
    if (!folderQuery.value.parent_id) return;
    if (e?.parent_id != folderQuery.value.parent_id) {
      folderQuery.value.parent_id = e?.parent_id;
      let path = route.meta.route;
      router.push(`${path}/${folderQuery.value.folder_category_id}/${folderQuery.value.parent_id}?search`);
      fileMenuStore().setTemporaryChecked(e);
    } else {
      checkedList.value = [e.open];
      clickFile.value = e;
    }
  };
  const handleTrigger = ({ type }) => {
    if (type == 'upload') {
      uploadModelRef.value.handleOpen();
    }
  };
  watch(
    () => props.topbarSearchChecked,
    (val, old) => {
      console.log(val, old);
      if (!val?.parent_id) return;
      handleChangeChecked(val);
    },
    { deep: true, immediate: true }
  );
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
