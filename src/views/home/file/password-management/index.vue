<script setup name="PasswordManagement">
  import Search from '../components/search.vue';
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  import SelfTable from '../components/selfTable.vue';
  import Btns from '../components/btns/index.vue';

  import { pwdListApi, updatePwdApi, addPwdApi, delPwdApi, PwdSetColorApi } from '@/api/file';
  import { ElMessageBox } from 'element-plus';
  import { uniqueId } from '@/utils/util';
  const loading = ref(false);
  const clickFile = ref({});
  const route = useRoute();

  const addFlag = ref(false);
  const ColorBtn = ref('');
  const colorList = ref([
    { name: '平台名称', key: 'name' },
    { name: '网址', key: 'website' },
    { name: '用户名', key: 'username' },
    { name: '密码', key: 'password' },
    { name: '备注', key: 'remark' },
  ]);
  const colorBtnItem = ref([
    {
      img: 'file/redColor.png',
      key: 'red',
    },
    {
      img: 'file/blueColor.png',
      key: 'blue',
    },
    {
      img: 'file/blackColor.png',
      key: 'black',
    },
  ]);
  const checkedList = ref([]);
  const searchInp = ref('');
  const dataList = ref([]);
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
      key: 'index',
      label: '序号',

      minWidth: 60,
      align: 'center',
      custom: true,
    },
    {
      key: 'name',
      prop: 'name',
      custom: true,
      label: '平台名称',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'website',
      prop: 'website',
      label: '网址',
      minWidth: 120,
      custom: true,
      align: 'center',
    },
    {
      key: 'username',
      prop: 'username',
      label: '用户名',
      minWidth: 120,
      custom: true,
      align: 'center',
    },
    {
      key: 'password',
      prop: 'password',
      label: '密码',
      minWidth: 120,
      custom: true,
      align: 'center',
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

      label: '修改时间',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'remark',
      prop: 'remark',
      label: '备注',
      minWidth: 120,
      custom: true,
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
  const handleRefresh = () => {
    checkedList.value = [];
    clickFile.value = {
      id: folderQuery.value.parent_id,
      extension: '1',
    };
    dataList.value = [];
    getList();
  };
  const getList = async () => {
    try {
      loading.value = true;
      const res = await pwdListApi({
        keyword: searchInp.value,
      });
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      dataList.value = res.data.map((e) => {
        colorList.value.forEach((el) => {
          e[el.key] = {
            color: e.color.find((color) => color.field_name == el.key)?.color || '#000',
            val: e[el.key] || '',
          };
        });
        return e;
      });

      loading.value = false;
    } catch (err) {
      $message.error(err?.msg || err?.message);
      loading.value = false;
    }
  };

  const handleChangeChecked = (e) => {
    checkedList.value = [e.open];
    clickFile.value = e;
  };
  const handleBtnTrigger = ({ type, item }) => {
    if (type == 'tableDel') {
      handleDel(item.id);
    }
  };

  const changeValue = async (row, data) => {
    if (row.isAdd) return;
    loading.value = true;
    try {
      const res = await updatePwdApi(data);
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      // $message.success('修改成功');
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
      // $message.error(err?.message || err?.msg);
    }
  };
  const setColor = async (row, data) => {
    if (!ColorBtn.value || row.isAdd) return;
    loading.value = true;
    try {
      data.color = ColorBtn.value;
      const res = await PwdSetColorApi(data);
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      row[data.field_name].color = ColorBtn.value;
      $message.success('修改成功');
      loading.value = false;
    } catch (err) {
      $message.error(err?.message || err?.msg);
      loading.value = false;
    }
  };
  const handleDel = (id) => {
    const text = id == 'mutli' ? '真的要删除所选记录吗？' : '真的要删除该条记录吗？';
    ElMessageBox.confirm(text, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
      type: 'warning',
    })
      .then(async () => {
        loading.value = true;
        const res = await delPwdApi({ id: id == 'mutli' ? checkedList.value.map((item) => item.id).join(',') : id });
        if (res.code != 200) {
          throw new Error(res.msg);
        }
        loading.value = false;
        handleRefresh();
        $message.success('删除成功');
      })
      .catch((err) => {
        if (err == 'cancel') return;

        loading.value = false;
        $message.error(err?.msg || err?.message);
      });
  };
  const handleDelAll = () => {
    if (!checkedList.value.length) return;
    handleDel('mutli');
  };
  const handleAdd = () => {
    if (addFlag.value) return;
    dataList.value.unshift({
      isAdd: true,
      id: uniqueId(),
      name: { color: '#000', val: '' },
      password: { color: '#000', val: '' },
      remark: { color: '#000', val: '' },
      website: { color: '#000', val: '' },
      username: { color: '#000', val: '' },
      nickname: '',
      update_time: '',
    });
    addFlag.value = true;
  };
  const handleAddSub = async (row) => {
    try {
      loading.value = true;
      const res = await addPwdApi({
        name: row.name.val,
        website: row.website.val,
        username: row.username.val,
        password: row.password.val,
        remark: row.remark.val,
      });
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      $message.success('添加成功');
      addFlag.value = false;
      getList();
    } catch (err) {
      loading.value = false;
      $message.error(err?.message || err?.msg);
    }
  };
  const handleCancelAdd = (idx) => {
    dataList.value.splice(idx, 1);
    addFlag.value = false;
  };

  onMounted(() => {
    handleRefresh();
  });
  provide('checkedList', checkedList);
  provide('folderQuery', folderQuery);
</script>
<template>
  <div class="contain">
    <div class="search">
      <Search searchType="onlySearch" v-model:searchVal="searchInp" width="281px" placeHolder="关键字搜索" @searchTrigger="getList" />
      <div class="search-right">
        <div class="color-btn">
          <div
            @click="ColorBtn = ColorBtn == item.key ? '' : item.key"
            v-for="item in colorBtnItem"
            :key="item.key"
            :class="['color-item', 'btnBorder', ColorBtn == item.key ? 'activeColor' : '']"
          >
            <img :src="$getAssetsImages(item.img)" />
          </div>
        </div>
        <el-button size="large" class="btnBorder" :class="{ disabled: !checkedList.length }" @click="handleDelAll">
          <svg-icon class="mr2 svgicon" name="del" />批量删除
        </el-button>
        <el-button size="large" class="btnBorder"> <svg-icon class="mr2 svgicon" name="people" />成员管理 </el-button>
      </div>
    </div>
    <SelfTable
      :isRecycle="true"
      :loading="loading"
      rowKey="id"
      :isCurrentRow="true"
      class="mt-10 mx-30 contain-table-wrapper"
      :row="row"
      v-model:checkedList="checkedList"
      v-model:dataList="dataList"
      fileShowType="dlb"
      tableBorder
    >
      <template v-for="item in colorList" #[`${item.key}Custom`]="{ row }" :key="item.key">
        <el-input
          @change="(val) => changeValue(row, { id: row.id, field: item.key, field_name: item.name, value: val })"
          @focus="setColor(row, { id: row.id, field_name: item.key })"
          :style="{ '--el-input-text-color': row[item.key]?.color }"
          v-model="row[item.key].val"
        />
      </template>
      <template #indexCustom="{ index }">
        {{ index + 1 }}
      </template>
      <template #handleCustom="{ row, index }">
        <template v-if="row.isAdd">
          <el-button @click="handleCancelAdd(index)">取消</el-button>
          <el-button @click="handleAddSub(row)">确认</el-button>
        </template>
        <Btns v-else :lineRow="row" :btnType="['tableCopy', 'tableHistory', 'tableDel']" @btnClickTrigger="handleBtnTrigger" />
      </template>
    </SelfTable>
    <div class="ml-30 mt-20">
      <el-button :disabled="addFlag" @click="handleAdd"
        ><el-icon><Plus /></el-icon>新增空白数据</el-button
      >
    </div>
  </div>
</template>
<style lang="less" scoped>
  .contain {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
    // padding: 30px;
    padding-bottom: 30px;
  }
  .search {
    padding: 20px 30px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-right {
      display: flex;
      align-items: center;
    }
  }
  .color-btn {
    display: flex;
    align-items: center;
  }
  .btnBorder {
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ececec;
    padding: 10px;
    margin: 0 8px;
    cursor: pointer;
    color: #000000;
    &.disabled {
      color: #b3aeae;
      cursor: not-allowed;
    }
  }
  .color-item {
    cursor: pointer;
    opacity: 0.5;
    &.activeColor {
      opacity: 1;
    }
    &:hover {
      opacity: 1;
    }
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
  .contain-table-wrapper {
    :deep(.el-table__row) {
      .el-input__wrapper {
        box-shadow: none;
        .el-input__inner {
          text-align: center;
        }
      }
      &.current-row,
      &:hover {
        .el-input {
          border: 1px solid #dcdcdc;
          border-radius: 3px 3px 3px 3px;
        }
      }
    }
  }
</style>
