<template>
  <div>
    <div class="left-navbar">
      <div class="top-navbar"></div>
    </div>
    <div class="right-content"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
  .left-navbar {
    flex: 260px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(128, 128, 128, 0.2);
    border-radius: 0px 0px 0px 0px;
  }
  .right-content {
    flex: 0 0 calc(100% - 260px);
  }
</style>
