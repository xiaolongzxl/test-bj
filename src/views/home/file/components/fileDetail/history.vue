<template>
  <div class="history-wrapper" v-loading="loading">
    <div class="history-btn">
      <el-button @click="handleUpload"
        ><el-icon color="#017FFD"><Plus /></el-icon>上传新版本</el-button
      >
    </div>
    <div class="history-list">
      <div class="history-item" v-for="(item, index) in historyList" :key="item.id">
        <div class="history-title">
          <div class="history-title-text">{{ item.name }}</div>
          <div class="history-btns">
            <div class="effect-btn" @click="remarkModelRef.handleOpen(item.remark, item.id, 'file')">
              <svg-icon name="edit"></svg-icon>
            </div>
            <div class="effect-btn" :class="index == 0 ? 'noallowed blueColor' : ''" @click="index != 0 && handleTop(item)">
              <svg-icon name="reupload"></svg-icon>
            </div>
            <div class="effect-btn" @click="handleDownload">
              <svg-icon name="download"></svg-icon>
            </div>
            <div
              class="effect-btn"
              @click="
                () => {
                  historyList.length > 1 && handleDel(item);
                }
              "
              :class="historyList.length <= 1 ? 'noallowed' : ''"
            >
              <svg-icon name="del"></svg-icon>
            </div>
          </div>
        </div>
        <div class="history-info"> {{ item.create_time }} {{ item.size }} </div>
        <div class="history-tip">备注：{{ item.remark || '' }} </div>
      </div>
    </div>
    <RemarkModel ref="remarkModelRef" flag="history" @detailRefresh="getList" />
    <DelModel flag="history" ref="delModelRef" @listRefresh="getList" />
  </div>
</template>
<script setup>
  import { getHistoryVer, topHistoryVer } from '@/api/file';
  import RemarkModel from './remarksModel.vue';
  import DelModel from '../btns/delModel.vue';
  import { fileUpload, getAllPath } from '@/utils/util';
  const remarkModelRef = ref(null);
  const delModelRef = ref(null);
  const emits = defineEmits(['listRefresh']);
  const props = defineProps({
    file: {
      type: Object,
      default: () => ({}),
    },
  });

  const historyList = ref([]);
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const folderQuery = inject('folderQuery');
  const loading = ref(false);
  const getList = async () => {
    loading.value = true;
    try {
      const res = await getHistoryVer({
        folder_category_id: folderQuery.value.folder_category_id,
        id: props.file.id,
      });
      loading.value = false;
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      historyList.value = res.data;
    } catch (err) {
      loading.value = false;
      // $message.error(err?.msg || err?.message);
    }
  };
  const handleTop = async (item) => {
    loading.value = true;
    try {
      const res = await topHistoryVer({ file_id: props.file.id, id: item.id });
      loading.value = false;
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      getList();
      emits('listRefresh', item);
    } catch (err) {
      loading.value = false;
      $message.error(err?.msg || err?.message);
    }
  };
  const handleDel = (item) => {
    delModelRef.value.open([item]);
  };
  const handleUpload = () => {
    const query = {
      folder_category_id: folderQuery.value.folder_category_id,
      file_id: props.file.id,
    };

    // 创建隐藏的 input 元素
    const input = document.createElement('input');
    input.type = 'file';

    // 监听文件选择完成事件
    input.addEventListener('change', async (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        loading.value = true;
        const res = await fileUpload(files, query, 'history');

        let flag = 'success';
        loading.value = false;
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
          getList();
          emits('listRefresh', props.file);
          input.remove();
        }
      }
    });

    // 触发文件选择窗口
    input.click();
  };
  const handleDownload = () => {
    const url = getAllPath(props.file.path);

    // 创建隐藏的 <a> 标签并模拟点击
    const link = document.createElement('a');
    link.href = url;
    console.log(props.file.name);
    link.setAttribute('download', props.file.name); // 设置下载文件名
    link.style.display = 'none';
    document.body.appendChild(link);
    console.log(link);
    link.click();

    // 清理资源
    document.body.removeChild(link);
  };
  watch(
    () => props.file,
    (val) => {
      getList();
    },
    {
      immediate: true,
    }
  );
  onMounted(() => {
    getList();
  });
</script>
<style lang="less" scoped>
  .history {
    &-wrapper {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 0 30px;
    }
    &-btn {
      flex: none;
      width: 100%;
      .el-button {
        width: 100%;
        height: 44px;
        border-style: dashed;
      }
    }
    &-list {
      margin-top: 30px;
      flex: auto;
      overflow: auto;
    }
    &-btns {
      display: none;
      align-items: center;
      .effect-btn.noallowed {
        color: #c4c4c4;
        cursor: not-allowed;
        &.blueColor {
          color: #409eff;
        }
      }
    }
    &-item {
      margin-bottom: 10px;
      &:hover {
        .history-btns {
          display: flex;
        }
      }
    }
    &-title {
      display: flex;
      align-items: center;
      &-text {
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #31373d;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: auto;
        margin-right: 10px;
      }
    }
    &-info {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      margin: 14px 0 10px;
    }
    &-tip {
      padding: 15px;
      background: #f5f6f9;
      border-radius: 4px 4px 4px 4px;
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #31373d;
    }
  }
</style>
