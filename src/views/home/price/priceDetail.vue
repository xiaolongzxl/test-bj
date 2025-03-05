<template>
  <el-drawer v-model="drawerPriseDetail" direction="rtl" :with-header="false" size="1280">
    <template #default>
      <div class="drawer-content">
        <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="closeDrawer" />
        <div class="drawer-title pt-24 pb-34">
          <img :src="$getAssetsImages('price/icon-title2.png')" alt="" class="mr-10" />
          <span>报价记录详情</span>
        </div>
        <div class="px-40 pb-64 search-box" style="height: calc(100% - 84px)">
          <div class="flex">
            <div class="label">项目名称：</div>
            <div class="value">这里是项目名称这里是项目名称这里是项目名称这里是项目名称这里是项目名称</div>
          </div>
          <div style="height: 1px; background: #ececec; border-radius: 4px 4px 4px 4px" class="my-20"></div>
          <div class="mb-30 flex">
            <div style="flex: 0 0 30%" flex>
              <div class="label">客户名称：</div>
              <div class="value">这里是客户名称这里是客户名称</div>
            </div>
            <div style="flex: 0 0 25%" flex>
              <div class="label">订单编号：</div>
              <div class="value">WDDL-20241218-0001</div>
            </div>
            <div style="flex: 0 0 25%" flex>
              <div class="label">报价日期：</div>
              <div class="value">2024-01-13 15:48:56</div>
            </div>
            <div style="flex: 0 0 20%" flex>
              <div class="label">报价人：</div>
              <div class="value">李晨光</div>
            </div>
          </div>
          <div style="height: calc(100% - 220px)">
            <el-table
              :data="detailList"
              style="width: 100%; border-radius: 8px 8px 0px 0px"
              height="100%"
              ref="tableRef"
              table-layout="fixed"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="序号">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.index }}</div>
                </template>
              </el-table-column>
              <el-table-column label="产品名称">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="型号规格">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.specs }}</div>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.num }}</div>
                </template>
              </el-table-column>
              <el-table-column label="单价">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.price }}</div>
                </template>
              </el-table-column>
              <el-table-column label="合计总价">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.total }}</div>
                </template>
              </el-table-column>

              <!-- <el-table-column label="专票" >
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="含税总价" >
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
          <div class="table-bottom flex-between px-46 mb-20">
            <div class="flex">
              <div class="flex mr-36">
                <span class="label1">铜价:</span>
                <span class="label2 ml-6">7624.00元/吨</span>
              </div>
              <div class="flex">
                <span class="label1">铝价:</span>
                <span class="label2 ml-6">19800.00元/吨</span>
              </div>
            </div>
            <div class="flex">
              <div class="flex mr-36">
                <span class="label2">含税总价:</span>
                <span class="value2 ml-6">￥18568</span>
              </div>
              <div class="flex">
                <span class="label2">合计总价：</span>
                <span class="value2 ml-6">￥167668</span>
              </div>
            </div>
          </div>
          <div class="flex-end">
            <div class="export-btn flex-center px-10 ml-12">
              <img :src="$getAssetsImages('price/icon-bjdyl.png')" alt="" class="mr-8" />
              <span>报价单预览</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12">
              <img :src="$getAssetsImages('price/icon-bjdyl.png')" alt="" class="mr-8" />
              <span>导出图片</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12">
              <img :src="$getAssetsImages('price/icon-pdf.png')" alt="" class="mr-8" />
              <span>导出pdf</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12">
              <img :src="$getAssetsImages('price/icon-excel.png')" alt="" class="mr-8" />
              <span>导出excel</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  // const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const drawerPriseDetail: any = defineModel('drawerPriseDetail');
  const props = defineProps({
    priseDetailId: [Number, String],
  });

  function closeDrawer() {
    drawerPriseDetail.value = false;
  }
  const detailList = ref<any>([
    {
      id: 1,
      index: 1,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 2,
      index: 2,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 3,
      index: 3,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 4,
      index: 4,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 5,
      index: 5,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 6,
      index: 6,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 7,
      index: 7,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 8,
      index: 8,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 9,
      index: 9,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 10,
      index: 10,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 11,
      index: 11,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 12,
      index: 12,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 13,
      index: 13,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 14,
      index: 14,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 15,
      index: 15,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 16,
      index: 16,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 17,
      index: 17,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 18,
      index: 18,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 19,
      index: 19,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 20,
      index: 20,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
  ]);
  onMounted(() => {
    console.log('priseDetailId', props.priseDetailId);
  });
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
