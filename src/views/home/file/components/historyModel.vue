<script setup>
  //   const showModel = ref(false);
  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['update:show']);
  const modelShow = ref(props.show);
  watch(
    () => props.show,
    (newVal) => {
      modelShow.value = newVal;
    }
  );
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
<template>
  <el-drawer class="history-drawer-wrapper" append-to-body v-model="modelShow" :show-close="false" :before-close="() => emits('update:show', false)">
    <template #header>
      <div class="title">
        历史版本
        <div class="closeIcon cursor-pointer">
          <svg-icon name="close" @click="() => emits('update:show', false)" />
        </div>
      </div>
    </template>
    <div class="drawer-content">
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
  </el-drawer>
</template>
<style lang="less" scoped>
  .title {
    background: linear-gradient(360deg, #ffffff 0%, #e7f0fc 100%);
    display: flex;
    justify-content: center;
    padding: 26px;
    position: relative;
    font-family:
      Microsoft YaHei,
      Microsoft YaHei;
    font-weight: bold;
    font-size: 22px;
    color: #162445;
    .closeIcon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
    }
  }

  .history {
    &-item {
      margin: 30px 0;
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
      color: #31373d;
    }
  }
</style>
