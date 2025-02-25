<template>
  <div class="left-navbar">
    <div class="top-navbar-self flex-between pl-15 pr-11 cursor-pointer" @click="showCategoryBox">
      <div>电力金具</div>
      <img :src="$getAssetsImages('price/icon-more.png')" alt="" />
      <div class="level-box" v-if="showCategory">
        <div class="level-one px-8">Action 1</div>
        <div class="level-one px-8">Action 2 </div>
        <div class="level-one px-8 active">Action 3</div>
        <div class="level-one px-8">Action 4</div>
        <div class="level-one px-8">Action 5</div>
      </div>
    </div>
    <div class="level-box-bg" v-if="showCategory" @click="closeCategoryBox"> </div>

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
        <el-input placeholder="" v-model="keyword" clearable>
          <template #prefix>
            <img :src="$getAssetsImages('price/icon-search.png')" alt="" />
          </template>
        </el-input>
      </div>
      <div class="select-box flex-between">
        <el-dropdown trigger="click">
          <div class="select-gg flex-between px-14 cursor-pointer el-dropdown-link">
            <span class="text-over-1">阿三大苏打实打实啊实打实的全部</span>
            <img :src="$getAssetsImages('price/icon-shaixuan.png')" alt="" />
          </div>
          <template #dropdown>
            <el-dropdown-menu style="width: 210px">
              <el-dropdown-item class="select-type">Action 1</el-dropdown-item>
              <el-dropdown-item class="select-type">Action 2 </el-dropdown-item>
              <el-dropdown-item class="select-type active">Action 3</el-dropdown-item>
              <el-dropdown-item class="select-type">Action 4</el-dropdown-item>
              <el-dropdown-item class="select-type">Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="select-btn flex-between cursor-pointer">
          <img :src="$getAssetsImages('price/icon-pltj.png')" alt="" />
          <span mx-6>批量添加</span>
          <span class="num">99</span>
        </div>
      </div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>铁附件</el-breadcrumb-item>
        <el-breadcrumb-item>铁附件</el-breadcrumb-item>
        <el-breadcrumb-item>耐张横担</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTableRef">
          <el-table-column type="selection" :selectable="selectable" width="55" /> <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
    </div>
    <div class="add-content"></div>
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const showCategory = ref<boolean>(false);
  function showCategoryBox() {
    showCategory.value = true;
  }
  function closeCategoryBox() {
    showCategory.value = false;
  }
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
  const expandedKeys = ref([3, 4]); // 默认展开 id 为 1 的节点
  const handleNodeClick = (data: any) => {
    console.log(data);
  };
  const keyword = ref<any>(null);
  const tableData = ref<any>([
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-08',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-06',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-07',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]);
  const selectable = (row: any) => ![1, 2].includes(row.id);
  const multipleTableRef = ref<any>();
  const multipleSelection = ref<any>([]);
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val;
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
  .level-box-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    top: 0;
    left: 0;
    z-index: 9;
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
  .search {
    margin: 8px 0 22px;
    :deep(.el-icon) {
      font-size: 18px;
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
    border-radius: 8px 8px 0px 0px;
    border: 1px solid #ececec;
    thead {
      tr .el-table__cell {
        height: 52px;
        background: #f4f5f7;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #31373d;
        /**
          text-align: center;
          */
      }
    }
  }
</style>
