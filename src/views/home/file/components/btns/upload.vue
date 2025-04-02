<template>
  <el-popover popper-class="btn-popover" placement="bottom" trigger="click" key="upload">
    <template #reference>
      <el-button text bg size="large"
        >上传<el-icon class="ml-4"><CaretBottom /></el-icon
      ></el-button>
    </template>
    <div class="popover-wrapper uploadPopover">
      <div class="popover-top">上传</div>
      <div class="popover-line" v-for="item in uploadBtns" :key="item.line">
        <div class="popover-line-item" v-for="iitem in item.data" :key="iitem.type" @click="handleUploadBtnClick(iitem)">
          <img :src="$getAssetsImages(fileType(iitem.type))" />
          <div class="popover-line-item-text">{{ iitem.name }}</div>
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
  import { fileType } from '@/utils/util';
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  const emits = defineEmits(['listRefresh']);
  import { ElLoading } from 'element-plus';
  const uploadBtns = ref([
    {
      line: 1,
      data: [
        // {
        //   type: 'wjj',
        //   name: '文件夹',
        // },
        {
          type: 'any',
          name: '文件',
        },
      ],
    },
  ]);
  import { fileUpload } from '@/utils/util';
  const uploadRef = ref(null);
  const folderQuery = inject('folderQuery');

  const handleUploadBtnClick = (item) => {
    const query = {
      folder_category_id: folderQuery.value.folder_category_id,
      folder_id: folderQuery.value.parent_id,
      type: 1,
    };

    console.log('点击了上传', item);
    // 创建隐藏的 input 元素
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    // 监听文件选择完成事件
    input.addEventListener('change', async (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        const loading = ElLoading.service({
          text: '请稍等...',
          lock: true,
          background: 'rgba(0, 0, 0, 0.4)',
        });
        const res = await fileUpload(files, query);

        let flag = 'success';
        loading.close();
        if (res.length) {
          res.forEach((element) => {
            if (element.status == 'error') {
              $message.error(element.error);
            }
            if (element.status != 'success') {
              flag = 'error';
            }
          });
          if (flag == 'success') {
            $message.success('上传成功');
          }
          emits('listRefresh');
          input.remove();
        }
      }
    });

    // 触发文件选择窗口
    input.click();
  };
</script>
<style lang="less" scoped>
  .popover {
    &-wrapper {
      background: #ffffff;
      box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
      border-radius: 12px 12px 12px 12px;
      padding: 20px 40px;
    }
    &-top {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #000000;
      line-height: 20px;
      margin-bottom: 14px;
    }
    &-line {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      &-item {
        cursor: pointer;
        border-radius: 6px 6px 6px 6px;
        flex-basis: 33%;
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        &-text {
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          line-height: 16px;
          margin-top: 10px;
          white-space: nowrap;
        }
        &:hover {
          background: #f3f4f9;
        }
      }
    }
  }
  .noneUpload {
    display: none;
  }
</style>
