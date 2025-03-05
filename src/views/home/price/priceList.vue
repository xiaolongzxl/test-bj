<template>
  <el-drawer v-model="drawerPriseList" direction="rtl" :with-header="false" size="1280">
    <template #default>
      <div class="drawer-content">
        <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="closeDialog" />
        <div class="drawer-title pt-24 pb-34">
          <img :src="$getAssetsImages('price/icon-title2.png')" alt="" class="mr-10" />
          <span>报价记录</span>
        </div>
        <div class="px-40 pb-64 search-box" style="height: calc(100% - 84px)">
          <div class="card-label mb-24"> 条件筛选： </div>
          <div class="mb-30 flex">
            <div class="label">关键字查询：</div>
            <el-input v-model="listKeyword" placeholder="请输入关键字进行查询...">
              <template #suffix> <img :src="$getAssetsImages('price/icon-search2.png')" alt="" class="mr-4" /> <span>搜索</span></template>
            </el-input>
            <div class="label ml-40">日期筛选： </div>
            <el-date-picker v-model="listTime" style="width: 340px" type="date" placeholder="请选择日期" clearable> </el-date-picker>
          </div>
          <div class="card-label mb-24"> 报价记录列表： </div>
          <div class="list-card mb-34" style="height: calc(100% - 220px)">
            <el-table :data="ListData" style="width: 100%" height="100%" ref="tableRef" table-layout="fixed" :cell-style="{ 'text-align': 'center' }">
              <el-table-column label="金额">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="客户名称" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="订单编号" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="报价人" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="报价时间" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template #default="scope">
                  <div class="table-btn flex-center">
                    <div class="ml-4" @click="showDetail(scope.row)">详情</div>
                    <div class="ml-4" @click="resetPrice(scope.row)">重新报价</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex-center"> <el-pagination background layout="prev, pager, next" :total="1000" /> </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const drawerPriseList = defineModel('drawerPriseList');
  const emit = defineEmits(['reset-price-by-id', 'show-detail-drawer']);

  function closeDialog() {
    drawerPriseList.value = false;
  }
  const listKeyword = ref<any>(null);
  const listTime = ref<any>(null);
  const ListData = ref<any>([
    {
      id: 1,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 2,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 3,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 4,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 5,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 6,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 7,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 8,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 9,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 10,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 11,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 12,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 13,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 14,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 15,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 16,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 17,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 18,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 19,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 20,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
  ]);
  function showDetail(item) {
    emit('show-detail-drawer', item.id);
  }
  function resetPrice(item) {
    emit('reset-price-by-id', item.id);
  }
</script>

<style lang="less" scoped>
  .drawer-content {
    position: relative;
    border-radius: 12px 12px 12px 12px;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
    background: linear-gradient(180deg, #e7f0fc 0%, #fff 56px, #fff 56px);
    .close {
      position: absolute;
      top: 24px;
      right: 20px;
      cursor: pointer;
    }
    .drawer-title {
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 22px;
      color: #162445;
      line-height: 21px;
      text-align: center;
    }
    .card-label {
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #1a202c;
      line-height: 20px;
    }
    .label {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 32px;
    }
    .value {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 32px;
    }
    :deep(.search-box .el-input) {
      width: 500px;
      height: 32px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #e9e9e9 !important;
    }
    .table-bottom {
      height: 50px;
      background: #f4f5f7;
      border-radius: 0px 0px 0px 0px;
      .label1 {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
      .label2 {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
      }
      .value2 {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 16px;
        color: #ff0003;
      }
    }
    .export-btn {
      min-width: 120px;
      height: 40px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ececec;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
