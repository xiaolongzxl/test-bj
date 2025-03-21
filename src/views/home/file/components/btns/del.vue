<template>
  <el-button text bg size="large" @click="handleOpenDel" :disabled="!checkFiles?.length">删除</el-button>

  <el-dialog class="self-dialog" title="提示" v-model="delShow" width="500" center>
    <div class="del-wrapper">
      <div class="del-title">你确定要将“研究报告.docx”删除吗？</div>
      <div class="del-tip">删除后文件(夹）将在回收站保留30天</div>
      <div class="del-btns footer-btn">
        <el-button color="#F2F3F5" @click="delShow = false">下次再说</el-button>
        <el-button type="danger" @click="handleDel">删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  const checkFiles = inject('checkedList');
  const delShow = ref(false);
  const handleOpenDel = () => {
    delShow.value = true;
  };
  const handleDel = () => {
    console.log('删除');
  };
</script>

<style lang="less" scoped>
  .del {
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
    &-tip {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #999999;
      line-height: 14px;
      margin-top: 24px;
    }
    &-btns {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
