<template>
  <el-button class="tableBtn" size="large" @click="handleOpenModel">属性</el-button>

  <el-dialog key="property" append-to-body class="self-dialog" title="属性" v-model="modelShow" width="500" center>
    <div class="model-wrapper">
      <div class="model-info" v-for="item in showInfo" :key="item.key">
        <div class="model-lebel">{{ item.label }}</div>
        <div class="model-value">{{ rowData[item.key] }}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  import { getIsFolder } from '@/utils/util';
  import { getFolderDetailApi } from '@/api/file';
  const props = defineProps({
    lineRow: {
      type: Object,
      default: () => ({
        name: '',
        size: '',
        create_time: '',
        update_time: '',
      }),
    },
  });
  const rowData = ref({ ...props.lineRow });
  const modelShow = ref(false);
  const showInfo = ref([
    {
      label: '名称：',
      key: 'name',
    },
    {
      label: '大小：',
      key: 'size',
    },
    {
      label: '创建时间（创建人）：',
      key: 'create_time',
    },
    {
      label: '修改时间（创建人）：',
      key: 'update_time',
    },
  ]);
  const getFolderDetail = async () => {
    try {
      const res = await getFolderDetailApi({ folder_category_id: rowData.value?.folder_category_id, id: rowData.value.id });
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      rowData.value = { ...rowData, ...res.data };
    } catch (err) {}
  };
  const handleOpenModel = () => {
    rowData.value = { ...props.lineRow };
    if (getIsFolder(rowData.value.extension)) {
      getFolderDetail();
    }
    modelShow.value = true;
  };
</script>

<style lang="less" scoped>
  .model {
    &-wrapper {
      padding: 0 40px 25px;
    }
    &-title {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      line-height: 14px;
    }
    &-info {
      display: flex;
      align-items: center;
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;

      line-height: 14px;
      margin: 16px 0;
    }

    &-label {
      color: #666666;
      flex: none;
      margin-right: 6px;
    }
    &-value {
      flex: auto;
      color: #000000;
    }
  }
</style>
