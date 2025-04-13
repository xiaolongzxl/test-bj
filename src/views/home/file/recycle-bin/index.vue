<script setup name="RecycleBin">
  import Btns from '../components/btns/index.vue';
  import SelfTable from '../components/selfTable.vue';
  import { recycleList, recycleRestore, recycleDelete } from '@/api/file';
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  import { getIsFolder } from '@/utils/util';

  import { ElLoading } from 'element-plus';
  const route = useRoute();
  const folderQuery = ref({
    folder_category_id: null,
    parent_id: '0',
  });
  const activeTab = ref(0);
  const tableLoading = ref(false);
  const restoreShow = ref(false);
  const removeShow = ref(false);

  const reStoreQuery = ref({
    type: '0',
    user_type: '0',
    data: [],
  });
  const removeQuery = ref({
    type: '0',
    user_type: '0',
    data: [],
  });
  const tab = ref([
    {
      label: '全部',
      id: 0,
    },
    {
      label: '我删除的',
      id: 1,
    },
  ]);
  const row = ref([
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
      minWidth: 180,
      align: 'center',
      'show-overflow-tooltip': true,
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
      custom: true,
      minWidth: 160,
      align: 'center',
    },
  ]);
  const dataList = ref([]);
  const checkedList = ref([]);
  const handleTab = (val) => {
    activeTab.value = val.id;
    checkedList.value = [];
    getFileList();
  };
  const btnCheckedList = computed(() => {
    let data = [];
    if (checkedList.value.length) {
      data = dataList.value
        .filter((e) => checkedList.value.includes(e.open))
        .map((e) => ({ name: e.name, extension: e.extension, id: e.id, open: e.open }));
    } else {
      data = dataList.value.map((e) => ({ name: e.name, extension: e.extension, id: e.id, open: e.open }));
    }
    return data;
  });

  const getFileList = async () => {
    try {
      tableLoading.value = true;
      const res = await recycleList({ type: activeTab.value });
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
  const handleClickTrigger = ({ item, type }) => {
    if (type == 'tableRestore') {
      openRestore('1', [item]);
    } else {
      openRemove('1', [item]);
    }
  };
  const openRestore = (type, list) => {
    if (type == '0' && list.length > 0) {
      type = '1';
    }
    reStoreQuery.value = {
      user_type: activeTab.value,
      type,
    };
    if (type == '1') {
      reStoreQuery.value.data = list.map((e) => ({ id: e.id, type: getIsFolder(e.extension) ? 1 : 2 }));
    }
    restoreShow.value = true;
  };
  const openRemove = (type, list) => {
    if (type == '0' && list.length > 0) {
      type = '1';
    }
    removeQuery.value = {
      user_type: activeTab.value,
      type,
    };

    if (type == '1') {
      removeQuery.value.data = list.map((e) => ({ id: e.id, type: getIsFolder(e.extension) ? 1 : 2 }));
    }
    removeShow.value = true;
  };
  const handleConfirm = async (type) => {
    let api = type == 'reStore' ? recycleRestore : recycleDelete;
    let query = type == 'reStore' ? { ...reStoreQuery.value } : { ...removeQuery.value };

    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    try {
      const res = await api(query);
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      loading.close();
      $message.success(type == 'reStore' ? '还原成功' : '删除成功');
      const fc = type == 'reStore' ? restoreShow : removeShow;
      fc.value = false;
      init();
    } catch (err) {
      loading.close();
      $message.error(err?.msg || err?.message);
    }
  };
  const init = () => {
    dataList.value = [];
    checkedList.value = [];

    getFileList();
  };
  onMounted(() => {
    folderQuery.value.folder_category_id = route.params.cateId;
    folderQuery.value.parent_id = route.params.folderId;
    init();
  });
  provide('checkedList', checkedList);
  provide('folderQuery', folderQuery);
</script>
<template>
  <div class="contain" style="height: 100%">
    <div class="contain-tab">
      <div class="contain-tab-item" :class="activeTab == item.id ? 'activeTab' : ''" @click="handleTab(item)" v-for="item in tab" :key="item.id">{{
        item.label
      }}</div>
    </div>
    <div class="contain-bottom flex-auto">
      <div class="contain-btns">
        <el-button text bg size="large" @click="openRestore('0', btnCheckedList)">{{ checkedList.length ? '还原' : '还原全部' }}</el-button>
        <el-button text bg size="large" @click="openRemove('0', btnCheckedList)">{{ checkedList.length ? '清空' : '清空全部' }}</el-button>
      </div>
      <SelfTable
        :isRecycle="true"
        :row="row"
        :loading="tableLoading"
        fileShowType="dlb"
        v-model:checkedList="checkedList"
        v-model:dataList="dataList"
      >
        <template #handleCustom="{ row }">
          <Btns :btnType="['tableRestore', 'tableAlwaysRemove', 'tableProperty']" :lineRow="row" @btnClickTrigger="handleClickTrigger" />
        </template>
      </SelfTable>
    </div>
    <el-dialog width="500px" append-to-body center title="还原" v-model="restoreShow" class="self-dialog" key="restore">
      <div class="model-content"> 是否还原{{ reStoreQuery.type == '1' ? '选中的' : '全部' }}文件（夹）？ </div>
      <template #footer>
        <div class="footer-btn">
          <el-button color="#F2F3F5" @click="modelShow = false">取消</el-button>
          <el-button color="#197CFA" @click="handleConfirm('reStore')">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog width="500px" append-to-body center title="彻底删除" v-model="removeShow" class="self-dialog" key="remove">
      <div class="model-content"> 是否彻底删除{{ removeQuery.type == '1' ? '选中的' : '全部' }}文件（夹）？ </div>
      <template #footer>
        <div class="footer-btn">
          <el-button color="#F2F3F5" @click="modelShow = false">取消</el-button>
          <el-button color="#197CFA" @click="handleConfirm('remove')">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  @import '../components/common.less';
  .contain {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    &-tab {
      flex: none;
      width: 100%;
      height: 60px;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(128, 128, 128, 0.2);
      border-radius: 8px 8px 0px 0px;
      display: flex;
      align-items: center;
      &-item {
        cursor: pointer;
        height: 100%;
        display: flex;
        align-items: center;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        margin-left: 46px;
        &.activeTab {
          color: #333333;
          font-weight: bold;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(130deg, #3796ff 0%, #005eff 100%);
            border-radius: 4px 4px 4px 4px;
          }
        }
      }
    }
    &-bottom {
      padding: 30px;
      display: flex;
      flex-direction: column;
    }
    &-btns {
      flex: none;
      margin-bottom: 22px;
    }
    .btns {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .effect-btn {
      user-select: none;

      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      .svgicon {
        font-size: 18px;
      }
    }
    .btnBorder {
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ececec;
      padding: 10px;
      margin: 0 8px;
      cursor: pointer;
    }
  }
  .model-content {
    padding: 30px;
    min-height: 100px;
    font-family:
      Microsoft YaHei,
      Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #333333;
    line-height: 14px;
  }
</style>
