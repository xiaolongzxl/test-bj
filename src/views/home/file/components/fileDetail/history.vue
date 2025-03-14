<template>
  <div class="history-wrapper">
    <div class="history-btn">
      <el-button
        ><el-icon color="#017FFD"><Plus /></el-icon>上传新版本</el-button
      >
    </div>
    <div class="history-list">
      <div class="history-item">
        <div class="history-title">
          <div class="history-title-text">证书名称2025030502.word</div>
          <div class="history-btns">
            <div class="effect-btn" @click="remarkModelRef.handleOpen">
              <svg-icon name="edit"></svg-icon>
            </div>
            <div class="effect-btn">
              <svg-icon name="reupload"></svg-icon>
            </div>
            <div class="effect-btn">
              <svg-icon name="download"></svg-icon>
            </div>
            <div class="effect-btn">
              <svg-icon name="del"></svg-icon>
            </div>
          </div>
        </div>
        <div class="history-info"> 02-25 17:14 管理员 524KB </div>
        <div class="history-tip">备注：此处为备注内容 </div>
      </div>
    </div>
    <RemarkModel ref="remarkModelRef" />
  </div>
</template>
<script setup>
  import RemarkModel from './remarksModel.vue';
  const remarkModelRef = ref(null);
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
