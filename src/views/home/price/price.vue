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
              <div @click="handleCopy(scope.row.name)" class="flex-center">
                <img :src="$getAssetsImages('price/icon-copy.png')" alt="" />
              </div>
              <div class="ml-4">加入报价单</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add-content"></div>
    <el-dialog v-model="dialogTableVisible" width="375" class="dialog-self" :show-close="false" align-center>
      <img :src="$getAssetsImages('price/icon-close.png')" alt="" class="close" />
      <div class="dialog-title pt-27 pb-26">价格调整</div>
      <div class="px-46 mb-40">
        <div class="flex mb-20">
          <div class="text1">调价1：</div>
          <div class="flex-between operator-box mx-8">
            <img v-if="adjustPriceFrom.type1 == 1" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
            <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type1 = 1" />
            <img v-if="adjustPriceFrom.type1 == 0" :src="$getAssetsImages('price/chu-select.png')" alt="" />
            <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type1 = 0" />
          </div>
          <el-input v-model="adjustPriceFrom.number1" class="adjust-input" placeholder="请输入调价系数"> </el-input>
        </div>
        <div class="flex mb-20">
          <div class="text1">调价2：</div>
          <div class="flex-between operator-box mx-8">
            <img v-if="adjustPriceFrom.type2 == 1" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
            <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type2 = 1" />
            <img v-if="adjustPriceFrom.type2 == 0" :src="$getAssetsImages('price/chu-select.png')" alt="" />
            <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type2 = 0" />
          </div>
          <el-input v-model="adjustPriceFrom.number2" class="adjust-input" placeholder="请输入调价系数"> </el-input>
        </div>
        <div class="flex">
          <div class="text1">调价3：</div>
          <div class="flex-between operator-box mx-8">
            <img v-if="adjustPriceFrom.type3 == 1" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
            <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type3 = 1" />
            <img v-if="adjustPriceFrom.type3 == 0" :src="$getAssetsImages('price/chu-select.png')" alt="" />
            <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type3 = 0" />
          </div>
          <el-input v-model="adjustPriceFrom.number3" class="adjust-input" placeholder="请输入调价系数"> </el-input>
        </div>
      </div>
      <div class="flex-center">
        <div class="dialog-btn mr-20">取消</div>
        <div class="dialog-btn confirm-btn">确定</div>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogInfoVisible" width="1138" class="dialog-self dialog-self2" :show-close="false" align-center>
      <img :src="$getAssetsImages('price/icon-clos.png')" alt="" class="close2" />
      <div class="dialog-title2 pt-24 pb-24">产品详情</div>
      <div class="px-46 mb-40 flex">
        <div>
          <div class="big-img">
            <img :src="$getAssetsImages('price/image-01.png')" alt="" />
          </div>
          <div class="flex mt-18">
            <div class="left-btn flex-center cursor-pointer mr-7">
              <img :src="$getAssetsImages('price/left-gray.png')" alt="" />
            </div>
            <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
            <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
            <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
            <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
            <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
            <div class="right-btn flex-center cursor-pointer">
              <img :src="$getAssetsImages('price/right-gray.png')" alt="" />
            </div>
          </div>
        </div>
        <div class="ml-24 info">
          <div class="info-title mb-16"
            >铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆铜芯交联聚乙烯 绝缘聚氯乙烯护套电力电缆
            <span class="cursor-pointer" @click="handleCopy('铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆铜芯交联聚乙烯 绝缘聚氯乙烯护套电力电缆')"
              ><img :src="$getAssetsImages('price/icon-copy.png')" alt="" /> 一键复制</span
            >
          </div>
          <div class="cate flex mb-7">
            <div class="cate-item active">123</div>
            <div class="cate-item">123</div>
            <div class="cate-item">123</div>
            <div class="cate-item">123</div>
          </div>
          <div class="price-box flex-between items-center px-20 mb-20">
            <div class="text-center">
              <span>单价：</span>
              <span>7.2</span>
            </div>
            <div class="text-center">
              <span>专票：</span>
              <span>7.2</span>
            </div>
            <div class="text-center">
              <span>普票：</span>
              <span>7.2</span>
            </div>
          </div>
          <div class="info-unit flex flex-wrap">
            <div>
              <span class="label">重量：</span>
              <span class="value">10.4kg/根</span>
              <span class="label">单位：</span>
              <span class="value">根</span>
            </div>
            <div>
              <span class="label">重量：</span>
              <span class="value">10.4kg/根</span>
              <span class="label">单位：</span>
              <span class="value">根</span>
            </div>
            <div>
              <span class="label">重量：</span>
              <span class="value">10.4kg/根</span>
              <span class="label">单位：</span>
              <span class="value">根</span>
            </div>
            <div>
              <span class="label">重量：</span>
              <span class="value">10.4kg/根</span>
              <span class="label">单位：</span>
              <span class="value">根</span>
            </div>
            <div>
              <span class="label">重量：</span>
              <span class="value">10.4kg/根</span>
              <span class="label">单位：</span>
              <span class="value">根</span>
            </div>
            <div>
              <span class="label">重量：</span>
              <span class="value">10.4kg/根</span>
              <span class="label">单位：</span>
              <span class="value">根</span>
            </div>
          </div>
          <div class="mt-20">
            <div class="ml-20 dialog-num flex items-center">
              <span>数量：</span>
              <el-input placeholder="请输入验证码" v-model="dialog_num">
                <template #suffix>
                  <div class="flex-center flex-columns" style="height: 100%">
                    <div @click="changDialogNum('+')" class="flex-center pt-4" style="flex: 0 0 50%" cursor-pointer>
                      <img :src="$getAssetsImages('price/icon-up.png')" alt="" />
                    </div>
                    <div @click="changDialogNum('-')" class="flex-center pb-4" style="flex: 0 0 50%" cursor-pointer>
                      <img :src="$getAssetsImages('price/icon-down.png')" alt="" />
                    </div>
                  </div>
                </template>
              </el-input>
              <div class="add-btn cursor-pointer ml-20">加入报价单</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
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
  function handleNodeClick(data: any) {
    console.log(data);
  }
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
  function handleSelectionChange(val: any) {
    multipleSelection.value = val;
  }
  const currentRow = ref<any>();
  function handleCurrentChange(val: any) {
    currentRow.value = val;
  }
  async function handleCopy(text: any) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      $message({
        message: '复制成功',
        type: 'success',
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      $message({
        message: '复制成功',
        type: 'success',
      });
    }
  }

  // 价格
  const dialogTableVisible = ref<boolean>(false);
  const adjustPriceFrom = ref<any>({
    number1: '',
    type1: 1,
    number2: '',
    type2: 1,
    number3: '',
    type3: 1,
  });
  // 详情
  const dialogInfoVisible = ref<boolean>(true);
  const dialog_num = ref<number>(0);
  function changDialogNum(type: any) {
    if (type == '+') {
      dialog_num.value += 1;
    } else {
      dialog_num.value -= 1;
      if (dialog_num.value < 0) {
        dialog_num.value = 0;
      }
    }
  }
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
  :deep(.el-dialog__header) {
    padding: 0;
    height: 0;
  }
  :deep(.dialog-self) {
    position: relative;
    padding: 0;
    border-radius: 12px 12px 12px 12px;
    height: 349px;
    background: #ffffff;
    box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
    background: linear-gradient(180deg, #e7f0fc 0%, #fff 56px, #fff 56px);
    .dialog-title {
      line-height: 44px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 22px;
      color: #0a1629;
      text-align: center;
      cursor: default;
    }

    .close {
      position: absolute;
      top: 27px;
      right: 23px;
      cursor: pointer;
    }

    .text1 {
      width: 54px;
      height: 30px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 30px;
      cursor: default;
    }
    .operator-box {
      padding: 2px;
      width: 54px;
      height: 30px;
      background: #eff2ff;
      border-radius: 6px 6px 6px 6px;
      cursor: pointer;
    }
    .adjust-input {
      width: 160px;
      height: 32px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #e9e9e9;
      box-shadow: none;
    }
    .dialog-btn {
      width: 120px;
      height: 42px;
      line-height: 42px;
      background: #f2f3f5;
      border-radius: 4px 4px 4px 4px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #717579;
      text-align: center;
      cursor: pointer;
    }
    .confirm-btn {
      color: #ffffff;
      background: #197cfa;
    }
  }
  :deep(.dialog-self2) {
    height: 80%;
    .dialog-title2 {
      line-height: 30px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 22px;
      color: #0a1629;
      text-align: center;
      cursor: default;
    }
    .close2 {
      position: absolute;
      top: 14px;
      right: 26px;
      cursor: pointer;
    }
    .right-btn,
    .left-btn {
      width: 19px;
      height: 43px;
      background: #eaeaea;
      border-radius: 0px 6px 6px 0px;
    }
    .left-btn {
      border-radius: 6px 0px 0px 6px;
    }
    .big-img {
      width: 486px;
      height: 258px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .img-item {
      width: 81px;
      height: 43px;
    }
    .info {
      width: 530px;
      .info-title {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #000000;
        line-height: 30px;
        cursor: default;
        span {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #2d6cff;
          vertical-align: middle;
        }
      }
      .cate {
        height: 22px;
        line-height: 22px;
        .cate-item {
          margin-right: 45px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #666666;
          text-align: center;
          font-style: normal;
          text-transform: none;
          &.active {
            position: relative;
            color: #2d6cff;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              bottom: -7px;
              left: 0;
              height: 2px;
              background: #2d6cff;
              border-radius: 4px 4px 4px 4px;
            }
          }
        }
      }
      .price-box {
        width: 100%;
        height: 56px;
        background: #f8f8f8;
        border-radius: 0px 0px 0px 0px;
        border-top: 1px solid #ececec;
        border-bottom: 1px solid #ececec;
        div {
          flex: 0 0 33%;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #666666;
          line-height: 14px;
          span:last-of-type {
            color: #121212;
          }
        }
      }
      .info-unit {
        div {
          line-height: 40px;
          position: relative;
          flex: 0 0 50%;
          &:nth-child(2n - 1):after {
            content: '';
            position: absolute;
            right: 8px;
            top: 0;
            width: 1px;
            height: 42px;
            background: #ececec;
          }
        }
        span {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }
        .label {
          padding-left: 20px;
        }
        .value {
          padding-left: 6px;
          color: #121212;
        }
      }
      .dialog-num {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        .el-input {
          width: 65px;
          height: 30px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #d4d6d9;
          .el-input__wrapper {
            padding: 0 8px;
            box-shadow: none;
          }
        }
      }
      .add-btn {
        width: 100px;
        height: 32px;
        line-height: 32px;
        background: linear-gradient(360deg, #ff4d00 0%, #ff7c44 100%);
        border-radius: 4px 4px 4px 4px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
      }
    }
  }

  :deep(.adjust-input .el-input__wrapper) {
    border: 0;
    box-shadow: none;
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
  :deep(.el-dialog) {
    padding: 0;
  }
  .el-dropdown:focus-visible,
  img:focus-visible {
    outline: none;
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
