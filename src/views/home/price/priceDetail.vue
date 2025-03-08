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
            <div class="value">{{ detailInfo.project_name }}</div>
          </div>
          <div style="height: 1px; background: #ececec; border-radius: 4px 4px 4px 4px" class="my-20"></div>
          <div class="mb-30 flex">
            <div style="flex: 0 0 30%" flex>
              <div class="label">客户名称：</div>
              <div class="value">{{ detailInfo.customer_name }}</div>
            </div>
            <div style="flex: 0 0 25%" flex>
              <div class="label">订单编号：</div>
              <div class="value">{{ detailInfo.generation_sn }}</div>
            </div>
            <div style="flex: 0 0 25%" flex>
              <div class="label">报价日期：</div>
              <div class="value">{{ detailInfo.generation_time }}</div>
            </div>
            <div style="flex: 0 0 20%" flex>
              <div class="label">报价人：</div>
              <div class="value">{{ detailInfo.nickname }}</div>
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
                  <div class="table-name" :class="scope.row.name.color">{{ scope.row.name.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="型号规格">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_name.color">{{ scope.row.spec_name.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.quantity.color">{{ scope.row.quantity.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="单价" v-if="detailInfo.is_unit_price == 1">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_price.color">{{ scope.row.spec_price.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="合计总价" v-if="detailInfo.is_unit_price == 1">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_amount.color">{{ scope.row.spec_amount.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="专票" v-if="detailInfo.is_special_ticket == 1">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_price_tax.color">{{ scope.row.spec_price_tax.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="含税总价" v-if="detailInfo.is_special_ticket == 1">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_amount_tax.color">{{ scope.row.spec_amount_tax.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="普票" v-if="detailInfo.is_special_invoice == 1">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_price_tax_ordinary.color">{{ scope.row.spec_price_tax_ordinary.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="含税总价" v-if="detailInfo.is_special_invoice == 1">
                <template #default="scope">
                  <div class="table-name" :class="scope.row.spec_amount_tax_ordinary.color">{{ scope.row.spec_amount_tax_ordinary.content }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-bottom flex-between px-46 mb-20">
            <div class="flex">
              <div class="flex mr-36">
                <span class="label1">铜价:</span>
                <span class="label2 ml-6">{{ detailInfo.generation_copper_price }}元/吨</span>
              </div>
              <div class="flex">
                <span class="label1">铝价:</span>
                <span class="label2 ml-6">{{ detailInfo.generation_aluminum_price }}元/吨</span>
              </div>
            </div>
            <div class="flex">
              <div class="flex mr-36" v-if="detailInfo.is_unit_price == 1">
                <span class="label2">合计总价:</span>
                <span class="value2 ml-6">￥{{ detailInfo.generation_amount }}</span>
                <!-- 合计总价 报价未税金额 -->
              </div>
              <div class="flex mr-36" v-if="detailInfo.is_special_ticket == 1">
                <span class="label2">含税总价:</span>
                <span class="value2 ml-6">￥{{ detailInfo.generation_tax_amount }}</span>
                <!-- 含税总价 报价专票金额 -->
              </div>
              <div class="flex" v-if="detailInfo.is_special_invoice == 1">
                <span class="label2">含税总价：</span>
                <span class="value2 ml-6">￥{{ detailInfo.generation_tax_ordinary_amount }}</span>
                <!-- 合计总价 报价普票金额 -->
              </div>
            </div>
          </div>
          <div class="flex-end">
            <div class="export-btn flex-center px-10 ml-12" @click="resetPrice" style="background: #197cfa; color: #ffffff">
              <span>重新报价</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12" @click="previewImg(detailInfo.image_path)">
              <img :src="$getAssetsImages('price/icon-bjdyl.png')" alt="" class="mr-8" />
              <span>报价单预览</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12" @click="exportFile(detailInfo.image_path)">
              <img :src="$getAssetsImages('price/icon-bjdyl.png')" alt="" class="mr-8" />
              <span>导出图片</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12" @click="exportFile(detailInfo.pdf_path)">
              <img :src="$getAssetsImages('price/icon-pdf.png')" alt="" class="mr-8" />
              <span>导出pdf</span>
            </div>
            <div class="export-btn flex-center px-10 ml-12" @click="exportFile(detailInfo.excel_path)">
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
  import { ElLoading } from 'element-plus';
  import { getProjectFile } from '@/api/index.ts';
  import { recordDetails } from '@/api/price.ts';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $viewerApi: any = getCurrentInstance()?.appContext.config.globalProperties.$viewerApi;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const drawerPriseDetail: any = defineModel('drawerPriseDetail');
  const emit = defineEmits(['reset-price-by-id']);
  const props = defineProps({
    priseDetailId: [Number, String],
  });
  const detailInfo = ref<any>({});
  const detailList = ref<any>();
  onMounted(() => {
    getRecordDetails();
  });
  async function getRecordDetails() {
    let loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.4)',
    });
    let res = await recordDetails({
      quotation_id: props.priseDetailId,
    });
    loadingInstance.close();
    if (res.code == 200) {
      detailInfo.value = res.data;
      detailList.value = res.data.spec_list.map((item: any, index: any) => {
        item.index = index + 1;
        return item;
      });
    } else {
      detailInfo.value = {
        id: '',
        customer_name: '',
        project_name: '',
        generation_time: '',
        generation_sn: '',
        generation_copper_price: '',
        generation_aluminum_price: '',
        excel_path: '',
        pdf_path: '',
        image_path: '',
        is_unit_price: 1,
        is_special_ticket: 0,
        is_special_invoice: 0,
        nickname: '',
        generation_amount: '',
        generation_tax_amount: '',
        generation_tax_ordinary_amount: '',
        generation_user_name: '',
        filename: '',
      };
      detailList.value = [];
    }
  }
  function closeDrawer() {
    drawerPriseDetail.value = false;
  }
  function resetPrice() {
    emit('reset-price-by-id', detailInfo.value.id);
  }
  // 预览图片
  function previewImg(image_path: any) {
    $viewerApi({
      images: [{ name: detailInfo.value.filename, src: image_path }],
    });
  }
  // 下载
  async function exportFile(fileUrl: any) {
    let list = fileUrl.split('.');
    let loadingInstance: any = null;
    try {
      loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.4)',
      });
      const fileName = detailInfo.value.filename + '.' + list[list.length - 1];
      const xhr = new XMLHttpRequest();
      xhr.open('get', fileUrl);
      xhr.responseType = 'blob';
      xhr.send();
      xhr.onload = function () {
        if (this.status === 200 || this.status === 304) {
          const url = URL.createObjectURL(this.response);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      };
      loadingInstance.close();
    } catch (error) {
      $message({
        message: '下载失败',
        type: 'error',
      });
      if (loadingInstance) {
        loadingInstance.close();
      }
    }
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
      min-width: 70px;
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
  .table-name {
    line-height: 22px;
    cursor: default;
  }
</style>
