<template>
  <el-dialog v-model="dialogInfoVisible" width="1138" class="dialog-self dialog-self2" :show-close="false" align-center>
    <img :src="$getAssetsImages('price/icon-clos.png')" alt="" class="close2" @click="dialogInfoVisible = false" />
    <div class="dialog-title2 pt-24 pb-24">产品详情</div>
    <div class="px-46" style="height: calc(100% - 120px)">
      <div class="mb-30 flex">
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
              <el-input placeholder="请输入" v-model="dialog_num">
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
      <div class="tab-card flex mb-18">
        <div class="mr-46" :class="{ active: activeTab == 1 }" @click="activeTab = 1">产品详情</div>
        <div :class="{ active: activeTab == 2 }" @click="activeTab = 2">供应商</div>
      </div>
      <el-scrollbar height=" calc(100% - 460px)" :always="true" v-if="activeTab == 1">
        <div class="card-list">
          <div class="flex my-24">
            <span class="label">产品名称</span>
            <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
          </div>
          <div class="flex mb-24">
            <span class="label">产品名称</span>
            <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
          </div>
          <div class="flex mb-24">
            <span class="label">产品名称</span>
            <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
          </div>
          <div class="flex mb-24">
            <span class="label">产品名称</span>
            <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
          </div>
          <div class="flex mb-24">
            <span class="label">产品名称</span>
            <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
          </div>
          <div class="flex mb-24">
            <span class="label">检验报告</span>
            <span class="files">
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
            </span>
          </div>
          <div class="flex mb-24">
            <span class="label">执行标准</span>
            <span class="files">
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div>
              <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div>
            </span>
          </div>
        </div>
      </el-scrollbar>
      <el-table :data="dialogTableData" style="width: 100%" center height=" calc(100% - 460px)" v-else class="table-center">
        <el-table-column prop="company" label="公司名称" />
        <el-table-column prop="name" label="负责人名称" width="120" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="remark" label="备注信息" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const dialogInfoVisible = defineModel('dialogInfoVisible');

  const activeTab = ref<number>(1);

  const dialogTableData = ref<any>([
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
  ]);

  const dialog_num = ref<any>(0);
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
</script>

<style lang="less" scoped></style>
