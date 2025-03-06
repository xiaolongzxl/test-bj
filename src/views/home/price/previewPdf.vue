<template>
  <el-dialog v-model="dialogPreviewPdf" class="dialog-self dialog-self2 dialog-self3" :show-close="false" align-center fullscreen>
    <img :src="$getAssetsImages('price/icon-clos.png')" alt="" class="close2" @click="dialogPreviewPdf = false" />
    <div class="dialog-title2 pt-24 pb-24">PDF预览</div>
    <div style="height: calc(100% - 78px)">
      <iframe :src="props.pdfFileUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  const dialogPreviewPdf: any = defineModel('dialogPreviewPdf');
  const props = defineProps({
    pdfFileUrl: String,
  });
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
      width: 486px;
      height: 258px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .img-item {
      width: 81px;
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
