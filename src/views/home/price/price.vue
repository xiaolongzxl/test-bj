<template>
  <div class="left-navbar">
    <div class="top-navbar-self">
      <div @click="showCategoryBox" class="flex-between pl-15 pr-11 cursor-pointer w-100% h-100%">
        <div>电力金具</div>
        <img :src="$getAssetsImages('price/icon-more.png')" alt="" />
      </div>
      <div class="level-box scroll-none" v-if="showCategory" @click="closeCategoryBox">
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8 active">电力金具 </div>
        <div class="level-one px-8">变压器</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
      </div>
      <div class="popup-box-bg z-99" v-if="showCategory" @click="closeCategoryBox"> </div>
    </div>
    <div>
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
        highlight-current
        :default-expanded-keys="expandedKeys"
        node-key="id"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="label" :class="data.children && data.children.length > 0 ? 'level1' : ''">{{ node.label }} </div>
            <div v-if="data.children && data.children.length > 0" class="pr-20">
              <img class="xiala" :src="$getAssetsImages('price/icon-xiala.png')" alt="" />
              <img class="huishou" :src="$getAssetsImages('price/icon-huishou.png')" alt="" />
            </div>
          </div> </template
      ></el-tree>
    </div>
  </div>
  <div class="right-content flex">
    <div class="list mr-10">
      <div class="search">
        <el-input placeholder="" v-model="keyword" clearable @focus="showSearchTable = true" style="position: relative; z-index: 88">
          <template #prefix>
            <img :src="$getAssetsImages('price/icon-search.png')" alt="" />
          </template>
        </el-input>
        <div class="search-table" v-if="showSearchTable">
          <div class="table-head flex-center">
            <div class="f-48 pl-30">产品名称</div>
            <div class="xian f-26 pl-8">型号</div>
            <div class="xian f-26 pl-8">规格</div>
          </div>
          <div class="table-body scroll-none">
            <div v-for="item of 210" :key="item" class="table-tr flex-center">
              <div class="f-48 pl-30">{{ item }}低压铜芯电缆</div>
              <div class="f-26 pl-8">YJV</div>
              <div class="f-26 pl-8">3×16+1×10</div>
            </div>
          </div>
        </div>
        <div class="popup-box-bg z-66" v-if="showSearchTable" @click="closeSearchTable"> </div>

        <!-- <el-autocomplete v-model="keyword" clearable popper-class="my-autocomplete" :fetch-suggestions="querySearch" @select="handleSelect">
          <template #prefix>
            <img :src="$getAssetsImages('price/icon-search.png')" alt="" />
          </template>
          <template #default="{ item }">
            <div class="value">{{ item.value }}</div>
            <span class="link">{{ item.link }}</span>
          </template>
        </el-autocomplete> -->
      </div>
      <div class="select-box flex-between">
        <el-dropdown trigger="click">
          <div class="select-gg flex-between px-14 cursor-pointer el-dropdown-link">
            <span class="text-over-1">全部</span>
            <img :src="$getAssetsImages('price/icon-shaixuan.png')" alt="" />
          </div>
          <template #dropdown>
            <el-dropdown-menu style="width: 210px">
              <el-dropdown-item class="select-type">全部</el-dropdown-item>
              <el-dropdown-item class="select-type">3+1芯</el-dropdown-item>
              <el-dropdown-item class="select-type active">3+2芯</el-dropdown-item>
              <el-dropdown-item class="select-type">4+1芯</el-dropdown-item>
              <el-dropdown-item class="select-type">5芯</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="select-btn flex-between cursor-pointer">
          <img :src="$getAssetsImages('price/icon-pltj.png')" alt="" />
          <span mx-6>批量添加</span>
          <div class="num">{{ multipleSelection.length ? multipleSelection.length : '' }}</div>
        </div>
      </div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>铁附件</el-breadcrumb-item>
        <el-breadcrumb-item>铁附件</el-breadcrumb-item>
        <el-breadcrumb-item>耐张横担</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="calc(100% - 216px)"
        ref="tableRef"
        table-layout="fixed"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column label="产品名称">
          <template #default="scope">
            <div class="table-name">{{ scope.row.name }}</div>
          </template>
        </el-table-column>

        <el-table-column label="单价" prop="price" width="90">
          <template #default="scope">
            <div class="flex-center">
              <div v-if="scope.row.isChange">{{ scope.row.price }}</div>
              <el-input class="table-input" v-model="scope.row.price" style="width: 60px" placeholder="1" v-else />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="number" width="90">
          <template #default="scope">
            <div class="flex-center">
              <el-input class="table-input" v-model="scope.row.number" style="width: 60px" placeholder="1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div class="table-btn flex-center">
              <div @click="handleCopy(scope)" class="flex-center">
                <img :src="$getAssetsImages('price/icon-copy.png')" alt="" />
              </div>
              <div class="ml-4">加入报价单</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="add-content"></div> -->
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  // 一级分类
  const showCategory = ref<boolean>(false);
  function showCategoryBox() {
    showCategory.value = true;
  }
  function closeCategoryBox() {
    showCategory.value = false;
  }
  // 二级分类
  const data = ref<any>([
    {
      id: 1,
      label: '铁附件',
      children: [
        {
          id: 121,
          label: '铁附件21',
        },
      ],
    },
    {
      id: 2,
      label: '抱箍',
      children: [
        {
          id: 11,
          label: '抱箍21',
        },
        {
          id: 12,
          label: '抱箍22',
        },
      ],
    },
    {
      id: 3,
      label: '横担',
      children: [
        {
          id: 4,
          label: '引线横担',
        },
        {
          id: 5,
          label: '避雷器横担',
        },
        {
          id: 6,
          label: '跌落横担（联板）',
        },
        {
          id: 7,
          label: '刀闸横担（联板）',
        },
        {
          id: 8,
          label: '双杆横担',
        },
      ],
    },
  ]);
  const defaultProps = {
    children: 'children',
    label: 'label',
  };
  const expandedKeys = ref([3, 4]);
  const handleNodeClick = (data: any) => {
    console.log(data);
  };
  // 搜索
  const keyword = ref<any>(null);
  const showSearchTable = ref<boolean>(false);
  function closeSearchTable() {
    showSearchTable.value = false;
  }
  // 表格
  const tableData = ref<any>([
    {
      id: 1,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 2,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 3,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 4,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 5,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 6,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 7,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
  ]);
  const tableRef = ref<any>();
  const multipleSelection = ref<any>([]);
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val;
  };
  const currentRow = ref<any>();
  const handleCurrentChange = (val: any) => {
    currentRow.value = val;
  };
  const handleCopy = (scope: any) => {
    console.log(scope);
  };
</script>

<style scoped lang="less">
  .left-navbar {
    flex: 0 0 260px;
    max-width: 260px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(128, 128, 128, 0.2);
    border-radius: 0px 0px 0px 0px;
    .top-navbar-self {
      position: relative;
      margin: 11px;
      width: 238px;
      height: 38px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #cccccc;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      .level-box {
        max-height: 668px;
        padding: 6px;
        position: absolute;
        right: -220px;
        top: 0;
        background: #cccccc;
        width: 200px;
        height: 668px;
        background: #ffffff;
        box-shadow:
          0px 5px 5px -3px rgba(0, 0, 0, 0.1),
          0px 8px 10px 1px rgba(0, 0, 0, 0.06),
          0px 3px 14px 2px rgba(0, 0, 0, 0.05);
        border-radius: 6px 6px 6px 6px;
        border: 1px solid #dcdcdc;
        z-index: 999;
        .level-one {
          height: 45px;
          line-height: 45px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          border-radius: 3px 3px 3px 3px;
          cursor: pointer;
          &.active {
            background: #f2f5ff;
          }
        }
      }
    }
    .text {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
  }
  .popup-box-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    top: 0;
    left: 0;
  }
  .search {
    position: relative;
    margin: 8px 0 22px;
    :deep(.el-icon) {
      font-size: 18px;
    }
  }
  .search-table {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    max-height: 463px;
    overflow: hidden;
    background: #ffffff;
    box-shadow:
      0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.08),
      0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px 6px 6px 6px;
    z-index: 991;
    .table-head {
      width: 100%;
      height: 37px;
      background: #f3f3f3;
      border-radius: 6px 6px 0px 0px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 12px;
      color: #333333;
      cursor: default;
      .xian {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 14px;
          width: 1px;
          background-color: #999;
        }
      }
    }
    .table-body {
      max-height: 426px;
      overflow: hidden;
      .table-tr {
        height: 28px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        cursor: pointer;
        color: #333333;
        &:hover {
          color: #0066ff;
          background: #f2f5ff;
        }
      }
    }
    .f-48 {
      flex: 0 0 48%;
    }
    .f-26 {
      flex: 0 0 26%;
    }
  }
  .custom-tree-node {
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      flex: 0 0 200px;
      text-wrap: wrap;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
    .level1 {
      font-size: 16px;
    }
  }
  :deep(.el-tree-node__content) {
    padding-left: 26px !important;
    height: 45px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
  }
  :deep(.el-tree-node__expand-icon),
  :deep(.el-tree-node__leaf-icon) {
    display: none !important;
  }
  .huishou {
    display: none;
  }
  .xiala {
    display: block;
  }
  :deep(.is-expanded) {
    .huishou {
      display: block;
    }
    .xiala {
      display: none;
    }
  }
  :deep(.el-tree-node:focus > .el-tree-node__content) {
    background: rgba(0, 0, 0, 0);
  }
  :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background: rgba(0, 0, 0, 0);
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    .el-tree-node__label {
      font-size: 16px;
      color: #333333;
    }
  }
  :deep(.el-tree--highlight-current .el-tree-node__children .el-tree-node.is-current > .el-tree-node__content) {
    background: #f4f9ff;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    border-right: 2px solid #0066ff;
    .el-tree-node__label {
      font-size: 14px;
      color: #0066ff;
    }
  }
  .right-content {
    padding: 20px;
    flex: 0 0 calc(100% - 260px);
    .list {
      padding: 16px;
      flex: 0 0 calc(42% - 10px);
      min-width: 680px;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
      border-radius: 8px 8px 8px 8px;
    }
    .add-content {
      flex: 0 0 58%;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
      border-radius: 8px 8px 8px 8px;
    }
  }

  .select-box {
    .select-gg {
      width: 210px;
      height: 32px;
      background: #ffffff;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #cccccc;

      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 16px;
      span {
        max-width: 160px;
      }
    }
    .select-btn {
      padding: 0 14px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ececec;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 12px;
      span,
      img {
        vertical-align: middle;
      }
      .num {
        color: #2d6cff;
      }
    }
  }

  :deep(.search .el-input__wrapper) {
    padding-left: 0;
    height: 34px;
    border-bottom: 1px solid #cccccc;
    box-shadow: none !important;
    border-radius: 0;
  }
  .table-input {
    :deep(.el-input__wrapper) {
      width: 60px;
      height: 32px;
      background: #ffffff;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #dcdcdc;
      box-shadow: none;
    }
    :deep(.el-input__inner) {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
      text-align: center;
    }
  }
  .table-name {
    line-height: 22px;
  }
  :deep(.el-table-column--selection) {
    text-align: center;
  }
  :deep(.el-checkbox__input .el-checkbox__inner) {
    width: 17px;
    height: 17px;
    content: '';
    border: 0;
    size: 0;
    background-color: transparent;
    background: url('@/assets/images/price/Vector.png');
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
    display: none;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: url('@/assets/images/price/Vector1.png');
  }
</style>
<style>
  .select-type {
    width: 210px;
    height: 32px;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    line-height: 22px;
    &.active {
      background: #f2f5ff !important;
    }
  }
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background: #f2f5ff;
    color: #333;
  }
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #fff;
    color: #333;
  }
  .el-breadcrumb {
    margin: 15px 0 14px;
    height: 22px;
    .el-breadcrumb__inner,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      line-height: 22px;
      cursor: default;
    }
  }
  .el-table {
    border-radius: 8px;
    border: 1px solid #ececec;
    thead {
      tr .el-table__cell {
        height: 52px;
        background: #f4f5f7;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #31373d;
        text-align: center;
      }
    }
    tbody tr {
      width: 644px;
      height: 50px;
      border: 1px solid #ececec;
      .el-table__cell {
        background: #ffffff;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #31373d;
        line-height: 14px;
      }
    }
  }
  .table-btn {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #2d6cff;
    cursor: pointer;
  }
  .active-row {
    background: rgba(233, 239, 255, 0.6);
    border: 1px solid #ececec;
  }
  .table-input input::placeholder {
    font-size: 12px !important;
    color: #333333 !important;
  }
</style>
