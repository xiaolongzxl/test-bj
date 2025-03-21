<template>
  <el-popover popper-class="btn-popover" placement="bottom" key="tableCopy">
    <template #reference>
      <el-button class="tableBtn">一键复制</el-button>
    </template>
    <div class="popover-wrapper">
      <div class="copy-item" v-for="item in copyLines" :key="item.key">
        <div class="copy-label">{{ item.label }}</div>
        <div class="copy-value">
          <template v-if="item.key != 'wz'"> {{ props.lineRow[item.key] }}</template>
          <el-link v-else type="primary" :href="props.lineRow[item.key]">
            {{ props.lineRow[item.key] }}
          </el-link>
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
  import { fileType } from '@/utils/util';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  //   const emits = defineEmits(['addBtnClick']);
  const props = defineProps({
    lineRow: {
      type: Object,
      default: () => ({
        name: '',
        wz: '',
        yhm: '',
        pwd: '',
        zj: '',
        zjlx: '',
      }),
    },
  });
  const copyLines = ref([
    {
      label: '平台名称：',
      key: 'name',
    },
    {
      label: '网址：',
      key: 'wz',
    },
    {
      label: '用户名：',
      key: 'yhm',
    },
    {
      label: '密码：',
      key: 'pwd',
    },
  ]);
  const handleAddBtnClick = (item) => {};
</script>
<style lang="less" scoped>
  .popover {
    &-wrapper {
      background: #ffffff;
      box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
      border-radius: 12px 12px 12px 12px;
      padding: 10px;
    }
  }
  .copy-item {
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 6px 0;
    transition:
      color 0.3s,
      background 0.3s;
    &:hover {
      color: #0066ff;
      background: #f4f9ff;
    }
  }
</style>
