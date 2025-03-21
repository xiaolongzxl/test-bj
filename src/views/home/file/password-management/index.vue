<script setup>
  import Search from '../components/search.vue';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import SelfTable from '../components/selfTable.vue';
  import Btns from '../components/btns/index.vue';
  const ColorBtn = ref('');
  const colorBtnItem = ref([
    {
      img: 'file/redColor.png',
      key: 'red',
    },
    {
      img: 'file/blueColor.png',
      ikeyd: 'blue',
    },
    {
      img: 'file/blackColor.png',
      key: 'black',
    },
  ]);
  const checkedList = ref([]);
  const dataList = ref([
    {
      id: 1,
      name: '123',
      wz: 'www.baidu.com',
      yhm: '123',
      cjr: '123',
      updateTime: '2022-03-01 12:00:00',
      bz: '123',
      handle: '123',
    },
    {
      id: 2,
      name: '123',
      wz: 'www.baidu.com',
      yhm: '123',
      cjr: '123',
      updateTime: '2022-03-01 12:00:00',
    },
  ]);
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
      type: 'index',
      minWidth: 40,
      align: 'center',
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
      key: 'wz',
      prop: 'wz',
      label: '网址',
      minWidth: 120,
      custom: true,
      align: 'center',
    },
    {
      key: 'yhm',
      prop: 'yhm',
      label: '用户名',
      minWidth: 120,
      custom: true,
      align: 'center',
    },
    {
      key: 'pwd',
      prop: 'pwd',
      label: '密码',
      minWidth: 120,
      custom: true,
      align: 'center',
    },
    {
      key: 'cjr',
      prop: 'cjr',
      label: '创建人',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'updateTime',
      prop: 'updateTime',

      label: '修改时间',
      minWidth: 120,
      align: 'center',
    },
    {
      key: 'bz',
      prop: 'bz',
      label: '备注',
      minWidth: 120,
      custom: true,
      align: 'center',
    },
    {
      key: 'handle',
      custom: true,
      label: '操作',
      minWidth: 200,
      align: 'center',
    },
  ]);
  const handleBtnTrigger = (type, item) => {
    console.log(type, item);
  };
</script>
<template>
  <div class="contain">
    <div class="search">
      <Search searchType="pageSearch" width="281px" placeHolder="关键字搜索" />
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
        <el-button size="large" class="btnBorder"> <svg-icon class="mr2 svgicon" name="del" />批量删除 </el-button>
        <el-button size="large" class="btnBorder"> <svg-icon class="mr2 svgicon" name="people" />成员管理 </el-button>
      </div>
    </div>
    <SelfTable
      :isCurrentRow="true"
      class="mt-10 contain-table-wrapper"
      :row="row"
      v-model:checkedList="checkedList"
      @clickFile="handleClickFile"
      v-model:dataList="dataList"
      fileShowType="dlb"
      tableBorder
    >
      <template #nameCustom="{ row }">
        <el-input @focus="setColor(row)" :class="row?.name?.color || ''" v-model="row.name" />
      </template>
      <template #wzCustom="{ row }">
        <el-input @focus="setColor(row)" :class="row?.wz?.color || ''" v-model="row.wz" />
      </template>
      <template #yhmCustom="{ row }">
        <el-input @focus="setColor(row)" :class="row?.yhm?.color || ''" v-model="row.yhm" />
      </template>
      <template #pwdCustom="{ row }">
        <el-input @focus="setColor(row)" :class="row?.pwd?.color || ''" v-model="row.pwd" />
      </template>
      <template #bzCustom="{ row }">
        <el-input @focus="setColor(row)" :class="row?.bz?.color || ''" v-model="row.bz" />
      </template>
      <template #handleCustom="{ row }">
        <Btns :lineRow="row" :btnType="['tableCopy', 'tableHistory', 'tableDel']" @btnClickTrigger="handleBtnTrigger" />
      </template>
    </SelfTable>
  </div>
</template>
<style lang="less" scoped>
  .contain {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 30px;
  }
  .search {
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
