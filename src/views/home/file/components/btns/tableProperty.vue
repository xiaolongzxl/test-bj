<template>
  <el-button class="tableBtn" size="large" @click="handleOpenModel">属性</el-button>

  <el-dialog append-to-body class="self-dialog" title="属性" v-model="modelShow" width="500" center>
    <div class="model-wrapper">
      <div class="model-info" v-for="item in showInfo" :key="item.key">
        <div class="model-lebel">{{ item.label }}</div>
        <div class="model-value">{{ props.lineRow[item.key] }}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  const props = defineProps({
    lineRow: {
      type: Object,
      default: () => ({
        name: '',
        size: '',
        createTime: '',
        updateTime: '',
      }),
    },
  });
  const modelShow = ref(false);
  const showInfo = ref([
    {
      label: '名称',
      key: 'name',
    },
    {
      label: '大小',
      key: 'size',
    },
    {
      label: '创建时间（创建人）',
      key: 'createTime',
    },
    {
      label: '修改时间（创建人）',
      key: 'updateTime',
    },
  ]);
  const handleOpenModel = () => {
    console.log(123);
    modelShow.value = true;
  };
  const handleDel = () => {
    console.log('删除');
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
