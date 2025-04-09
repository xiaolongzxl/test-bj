<template>
  <div class="fileDetail" v-if="folderQuery?.folder_category_id">
    <div class="file-info" v-loading="loading">
      <div class="file-title">
        <img :src="$getAssetsImages(fileType(fileDetail?.extension))" />
        <span class="ml1">{{ fileDetail.name }}</span>
      </div>
      <div class="file-line tip" v-if="props.file.id != 0">
        <div class="file-line-label"> 说明： </div>
        <div class="file-line-value">{{ fileDetail.remark || '' }} </div>
        <div class="file-line-icon effect-btn" @click="handleOpenRemark">
          <svg-icon name="edit"></svg-icon>
        </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 大小： </div>
        <div class="file-line-value"> {{ fileDetail.size }}</div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 创建时间： </div>
        <div class="file-line-value">{{ fileDetail.create_time }} </div>
      </div>
      <div class="file-line">
        <div class="file-line-label"> 修改时间： </div>
        <div class="file-line-value">{{ fileDetail.update_time }} </div>
      </div>
    </div>
    <el-tabs v-model="activeTab" class="file-tabs" @tab-click="handleClick">
      <template v-for="item in tabs" :key="item.value">
        <el-tab-pane :label="item.label" :name="item.value" :key="item.value" v-if="!item.hidden"></el-tab-pane>
      </template>
    </el-tabs>
    <div class="file-other">
      <template v-if="activeTab == '1'">
        <User />
      </template>
      <template v-else-if="activeTab == '2'">
        <History :file="file" />
      </template>
      <template v-else-if="activeTab == '3'">
        <Dynamic />
      </template>
    </div>
  </div>
  <RemarkModel title="说明" @detailRefresh="handleGetDetail" ref="remarkModelRef" />
</template>
<script setup>
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  import { getFolderDetailApi, getFileDetailApi, getMenuDetailApi } from '@/api/file';

  import History from './history.vue';
  import User from './user.vue';
  import Dynamic from './dynamic.vue';
  import { fileType, getIsFolder } from '@/utils/util';
  import RemarkModel from './remarksModel.vue';

  const folderQuery = inject('folderQuery');
  const loading = ref(false);
  const remarkModelRef = ref(null);
  const props = defineProps({
    file: {
      type: Object,
      default: () => ({ id: '0', extension: 1 }),
    },
  });
  const tabs = computed(() => {
    return [
      {
        label: '成员列表',
        hidden: !getIsFolder(props.file.extension),
        value: '1',
      },
      {
        label: '历史版本',
        value: '2',
        hidden: getIsFolder(props.file.extension),
      },
      {
        label: '动态',
        value: '3',
      },
    ];
  });
  const activeTab = ref('1');
  const fileDetail = ref({});
  const handleClick = () => {};
  const handleGetDetail = async () => {
    if (!folderQuery.value?.folder_category_id) return;
    const { id, extension } = props?.file;
    loading.value = true;
    try {
      const data = {
        folder_category_id: folderQuery.value.folder_category_id,
      };
      if (!['0', 0].includes(id)) {
        data.id = id;
      }

      const api = ['0', 0].includes(id) ? getMenuDetailApi : getIsFolder(extension) ? getFolderDetailApi : getFileDetailApi;
      const res = await api(data);
      loading.value = false;
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      fileDetail.value = { ...props.file, ...res.data };
    } catch (err) {
      loading.value = false;
      $message.error(err?.message || err?.msg);
    }
  };
  const handleOpenRemark = () => {
    const { remark, id, extension } = fileDetail.value;
    console.log(remark, id, extension);
    remarkModelRef.value.handleOpen(remark, id, extension);
  };
  watch(
    () => props.file,
    (val) => {
      if (tabs.value.find((e) => e.value == activeTab.value)?.hidden) {
        activeTab.value = tabs.value.filter((e) => !e.hidden)[0].value;
      }

      handleGetDetail();
    },
    {
      immediate: true,
    }
  );

  /* 修改说明 */
  const handleChangeRemark = (val) => {};
</script>

<style lang="less" scoped>
  .fileDetail {
    flex: none;
    height: 100%;
    width: 380px;
    box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
    padding: 33px 0;
    display: flex;
    flex-direction: column;
    .file {
      &-info {
        flex: none;
        overflow: hidden;
        padding: 0 30px;
      }
      &-title {
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #495060;
        line-height: 20px;
      }
      &-line {
        display: flex;
        align-items: center;
        margin-top: 20px;
        &-label {
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 16px;
        }
        &-value {
          flex: auto;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &-icon {
          color: #000;
        }
      }
      &-tabs {
        flex: none;
        margin-top: 40px;
        padding: 0 30px;
      }
      &-other {
        flex: auto;
        overflow: hidden;
      }
    }
  }
</style>
