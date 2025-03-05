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
              <div class="add-btn cursor-pointer ml-20" @click="appendToPrice">加入报价单</div>
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
  const emit = defineEmits(['append-item-to-price']);

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
  function appendToPrice() {
    let data = {};
    emit('append-item-to-price', data);
  }
</script>

<style lang="less" scoped>
  .dialog-self {
    height: 349px;
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
  .dialog-self2 {
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
    .tab-card {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #666666;
      line-height: 28px;
      cursor: pointer;
      .active {
        font-weight: bold;
        color: #121212;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          bottom: -7px;
          left: 0;
          height: 3px;
          background: linear-gradient(177deg, #5398ff 0%, #3563e9 100%);
          border-radius: 3px 3px 3px 3px;
        }
      }
    }
    .card-list {
      cursor: default;
      .label {
        flex: 0 0 100px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        line-height: 20px;
      }
      .value {
        flex: 0 0 calc(100% - 100px);
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }
      .files {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #197cfa;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
</style>
