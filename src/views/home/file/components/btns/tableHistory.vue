<template>
  <el-popover popper-class="btn-popover" placement="bottom" key="tableHistory">
    <template #reference>
      <el-button class="tableBtn" @click="historyDrawerShow = true">历史版本</el-button>
    </template>
    <div class="popover-wrapper">
      <div class="history-item" v-for="item in history" :key="item.id">
        <div class="history-line">
          <div class="column">
            <span class="column-label">{{ item.key }}：</span>
            <span class="column-value">{{ item.last }}</span>
          </div>
          <el-icon color="#337FFF" class="mx-10"><Right /></el-icon>
          <div class="column">
            <span class="column-label">{{ item.key }}：</span>
            <span class="column-value">{{ item.new }}</span>
          </div>
        </div>
        <div class="history-man column-label mt-10"> {{ item.time }}({{ item.creatBy }}) </div>
      </div>
    </div>
  </el-popover>
  <HistoryDrawer v-model:show="historyDrawerShow" />
</template>
<script setup>
  import HistoryDrawer from '../historyModel.vue';
  const historyDrawerShow = ref(false);
  const props = defineProps({
    lineRow: {
      type: Object,
      default: () => {},
    },
  });
  const history = ref([
    {
      last: 'Admin123',
      new: 'Huoming458',
      key: '用户名',
      time: '5分钟',
      creatBy: '管理员',
      id: 1,
    },
    {
      last: 'Admin123',
      new: 'Huoming458',
      key: '用户名',
      time: '5分钟',
      creatBy: '管理员',
      id: 2,
    },
  ]);
</script>
<style lang="less" scoped>
  .popover {
    &-wrapper {
      background: #ffffff;
      box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
      border-radius: 12px 12px 12px 12px;
      padding: 20px;
      min-width: 350px;
    }
  }
  .history {
    &-item {
      margin: 10px 0;
    }
    &-line {
      flex-wrap: nowrap;
      display: flex;
      align-items: center;
    }
  }
  .column {
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
    font-family:
      Microsoft YaHei,
      Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    &-label {
      flex: none;
      color: #999999;
    }
    &-value {
      flex: none;
      color: #333333;
    }
  }
</style>
