<script setup name="RecycleBin">
  import Btns from '../components/btns/index.vue';
  import SelfTable from '../components/selfTable.vue';
  import { getFileListApi } from '@/api/file';
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  const route = useRoute();
  const folderQuery = ref({
    folder_category_id: null,
    parent_id: '0',
  });
  const activeTab = ref(1);
  const tableLoading = ref(false);
  const tab = ref([
    {
      label: '全部',
      id: 1,
    },
    {
      label: '我删除的',
      id: 2,
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
      minWidth: 200,
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
      custom: true,
      minWidth: 160,
      align: 'center',
    },
  ]);
  const dataList = ref([
    { name: 'name1', creatby: '姓名', updateTime: '1', size: '2', id: 1, type: 'wjj' },
    { name: 'name2', creatby: '姓名', updateTime: '2', size: '3', id: 2, type: 'word' },
    { name: 'name3', creatby: '姓名', updateTime: '3', size: '4', id: 3, type: 'ppt' },
    { name: 'name4', creatby: '姓名', updateTime: '3', size: '4', id: 4, type: 'excel' },
  ]);
  const checkedList = ref([]);
  const handleTab = (val) => {
    activeTab.value = val.id;
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
        <el-button text bg size="large">还原全部</el-button>
        <el-button text bg size="large">清空全部</el-button>
      </div>
      <SelfTable :loading="tableLoading" fileShowType="dlb" :dataList="dataList" :row="row">
        <template #handleCustom="{ row }">
          <Btns :btnType="['tableProperty']" :lineRow="row" />
        </template>
      </SelfTable>
    </div>
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
</style>
