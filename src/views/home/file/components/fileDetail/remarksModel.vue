<template>
  <el-dialog v-model="modelShow" class="self-dialog" title="备注信息" width="500" center>
    <div class="box-wrapper">
      <el-input v-model="textarea1" style="width: 400px" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" placeholder="请输入备注" />
    </div>
    <template #footer>
      <div class="footer-btn center">
        <el-button color="#F2F3F5" @click="modelShow = false">取消</el-button>
        <el-button color="#197CFA" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  const modelShow = ref(false);
  const handleOpen = () => {
    modelShow.value = true;
  };
  const handleConfirm = () => {};

  defineExpose({
    handleOpen,
  });
</script>
<style lang="less" scoped>
  .box-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
