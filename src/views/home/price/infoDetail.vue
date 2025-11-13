<template>
  <el-dialog v-model="dialogInfoVisible" width="1000" class="dialog-self dialog-self2" :show-close="false" align-center>
    <img :src="$getAssetsImages('price/icon-clos.png')" alt="" class="close2" @click="dialogInfoVisible = false" />
    <div class="dialog-title2 pt-24 pb-24">产品详情</div>
    <div class="px-46" style="height: calc(100% - 120px)">
      <div class="mb-30 flex">
        <div>
          <div class="big-img cursor-pointer">
            <img :src="activeImage" alt="" @click="previewImg" />
          </div>
          <div class="flex mt-18">
            <div class="left-btn flex-center cursor-pointer mr-7" @click="prevImageList">
              <img :src="$getAssetsImages('price/left-gray.png')" alt="" />
            </div>
            <div style="flex: 0 0 374px" class="flex">
              <img :src="img" alt="" class="img-item mr-7" v-for="img of imageList[activeImageIndex]" :key="img" @click="activeImage = img" />
            </div>
            <div class="right-btn flex-center cursor-pointer" @click="nextImageList">
              <img :src="$getAssetsImages('price/right-gray.png')" alt="" />
            </div>
          </div>
        </div>
        <div class="ml-24 info">
          <div class="info-title mb-16"
            >{{ detailInfo.name }}
            <span class="cursor-pointer" @click="handleCopy(detailInfo.copy_name)"
              ><img :src="$getAssetsImages('price/icon-copy.png')" alt="" class="w-17px h-16px" /> 一键复制</span
            >
          </div>
          <div class="self-scroll-auto" style="max-width: 480px; margin-bottom: 8px">
            <div class="cate flex mb-7" v-if="detailInfo.float_list.length > 0">
              <div
                class="cate-item"
                v-for="(item, index) of detailInfo.float_list"
                :key="item.id"
                :class="{ active: activePriceIndex == index }"
                @click="changePrice(index, item)"
                >{{ item.name }}</div
              >
              <div style="flex: 0 0 10px"></div>
            </div>
          </div>
          <div class="price-box flex-between items-center px-20">
            <div class="text-center">
              <span>单价：</span>
              <span>{{ activePrice.spec_price }}</span>
            </div>
            <div class="text-center">
              <span>专票：</span>
              <span>{{ activePrice.spec_price_tax }}</span>
            </div>
            <div class="text-center">
              <span>普票：</span>
              <span>{{ activePrice.spec_price_tax_ordinary }}</span>
            </div>
          </div>
          <div
            class="price-box flex-between items-center px-20"
            v-if="activePrice.weight_spec_price || activePrice.weight_spec_price_tax || activePrice.weight_spec_price_tax_ordinary"
          >
            <div class="text-center">
              <span>公斤单价：</span>
              <span>{{ activePrice.weight_spec_price }}</span>
            </div>
            <div class="text-center">
              <span>公斤专票单价：</span>
              <span>{{ activePrice.weight_spec_price_tax }}</span>
            </div>
            <div class="text-center">
              <span>公斤普票单价：</span>
              <span>{{ activePrice.weight_spec_price_tax_ordinary }}</span>
            </div>
          </div>
          <!-- <div class="price-box flex-between items-center px-20">
            <div class="text-center">
              <span>短米浮动公斤单价：</span>
              <span>{{ activePrice.weight_spec_price }}</span>
            </div>
            <div class="text-center">
              <span>短米浮动公斤专票单价：</span>
              <span>{{ activePrice.weight_spec_price_tax }}</span>
            </div>
            <div class="text-center">
              <span>短米浮动公斤普票单价：</span>
              <span>{{ activePrice.weight_spec_price_tax_ordinary }}</span>
            </div>
          </div> -->
          <div class="info-unit flex flex-wrap mt-20">
            <div v-for="(item, index) of detailInfo.accurate" :key="index">
              <span class="label">{{ item.attribute }}：</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </div>
          <div class="mt-20">
            <div class="ml-20 dialog-num flex items-center">
              <span>数量：</span>
              <el-input placeholder="请输入" v-model="quantity" type="number" class="quantity-input">
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
      <el-scrollbar height=" calc(100% - 360px)" :always="true" v-if="activeTab == 1">
        <div class="card-list">
          <div class="flex my-24" v-for="(item, index) of detailInfo.refer" :key="index">
            <span class="label">{{ item.attribute }}</span>
            <span v-if="typeof item.value == 'string'" class="value">{{ item.value }}</span>
            <span class="files" v-else>
              <div class="mb-14" v-for="(file, ind) of item.value" :key="ind" @click="showPdfLink(file.files)">
                <img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" />
                <span>{{ file.display_name }}</span>
              </div>
            </span>
          </div>
        </div>
      </el-scrollbar>
      <el-table :data="dialogTableData" style="width: 100%" center height=" calc(100% - 360px)" v-else class="table-center">
        <el-table-column prop="shop_name" label="公司名称" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="profile" label="备注信息" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ElLoading } from 'element-plus';
  import { seriesSpecInfo } from '@/api/price.ts';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const $viewerApi: any = getCurrentInstance()?.appContext.config.globalProperties.$viewerApi;
  const dialogInfoVisible: any = defineModel('dialogInfoVisible');
  const emit = defineEmits(['append-item-to-price', 'show-preview-pdf']);
  const props = defineProps({
    infoDetailId: [Number, String],
  });

  onMounted(() => {
    getDetail();
  });
  const detailInfo = ref<any>({
    id: null,
    name: null,
    type_id: null,
    image_arr: [null],
    spec_price: null,
    spec_price_tax: null,
    spec_price_tax_ordinary: null,
    accurate: [],
    refer: [],
    float_list: [],
    shop: [],
  });

  const dialogTableData = ref<any>([]);
  const activeTab = ref<number>(1);
  async function getDetail() {
    let loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.4)',
    });
    let res = await seriesSpecInfo({
      spec_id: props.infoDetailId,
    });
    loadingInstance.close();
    if (res.code == 200) {
      detailInfo.value = res.data;
      dialogTableData.value = res.data.shop;
      activeImage.value = res.data.image_arr[0] || '';
      activePrice.value = {
        spec_price: res.data.spec_price,
        spec_price_tax: res.data.spec_price_tax,
        spec_price_tax_ordinary: res.data.spec_price_tax_ordinary,
        weight_spec_price: res.data.weight_spec_price,
        weight_spec_price_tax: res.data.weight_spec_price_tax,
        weight_spec_price_tax_ordinary: res.data.weight_spec_price_tax_ordinary,
      };
      let images = JSON.parse(JSON.stringify(res.data.image_arr));
      const result = [];
      for (let i = 0; i < images.length; i += 5) {
        result.push(images.slice(i, i + 5));
      }
      imageList.value = result;
    } else {
      detailInfo.value = {
        id: null,
        name: null,
        type_id: null,
        image_arr: [null],
        spec_price: null,
        spec_price_tax: null,
        spec_price_tax_ordinary: null,
        accurate: [],
        refer: [],
        float_list: [],
        shop: [],
      };
    }
  }
  const imageList = ref<any>([]);
  const activeImageIndex = ref<any>(0);
  const activeImage = ref<any>('');

  function prevImageList() {
    if (activeImageIndex.value > 0) {
      activeImageIndex.value -= 1;
    }
  }
  function nextImageList() {
    if (activeImageIndex.value < imageList.value.length - 1) {
      activeImageIndex.value += 1;
    }
  }

  const activePriceIndex = ref<any>(0);
  const activePrice = ref<any>({
    spec_price: '',
    spec_price_tax: '',
    spec_price_tax_ordinary: '',
    weight_spec_price: '',
    weight_spec_price_tax: '',
    weight_spec_price_tax_ordinary: '',
  });
  function changePrice(index: any, item: any) {
    activePriceIndex.value = index;
    activePrice.value = {
      spec_price: item.spec_price,
      spec_price_tax: item.spec_price_tax,
      spec_price_tax_ordinary: item.spec_price_tax_ordinary,
      weight_spec_price: item.weight_spec_price,
      weight_spec_price_tax: item.weight_spec_price_tax,
      weight_spec_price_tax_ordinary: item.weight_spec_price_tax_ordinary,
    };
  }

  // 复制
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
  // 点击pdf预览
  function showPdfLink(link: any) {
    emit('show-preview-pdf', link);
  }
  // 查看图片
  function previewImg() {
    let activeIndex = 0;
    let list = detailInfo.value.image_arr.map((item: any, index: any) => {
      if (item == activeImage.value) {
        activeIndex = index;
      }
      return { src: item, name: '' };
    });
    $viewerApi({
      images: list,
    }).view(activeIndex);
  }
  // 数量
  const quantity = ref<any>(1);
  function changDialogNum(type: any) {
    if (type == '+') {
      quantity.value = Number(quantity.value) + 1;
    } else {
      quantity.value = Number(quantity.value) - 1;
      if (quantity.value < 1) {
        quantity.value = 1;
      }
    }
  }
  // 加入报价单
  const timer = ref<any>(null);
  function appendToPrice() {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
      let data = {
        spec_id: detailInfo.value.id,
        quantity: quantity.value,
      };
      emit('append-item-to-price', data);
    }, 300);
  }
</script>

<style lang="less" scoped>
  .dialog-self {
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
      width: 420px;
      height: 224px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .img-item {
      width: 68px;
      height: 43px;
      border: 1px solid #ddd;
      border-radius: 2px;
      object-fit: contain;
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
        width: 100%;
        height: 22px;
        line-height: 22px;
        .cate-item {
          margin-right: 30px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #666666;
          text-align: center;
          font-style: normal;
          text-transform: none;
          white-space: nowrap;
          cursor: pointer;
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
          min-width: 65px;
          max-width: 100px;
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
