<template>
  <div class="user-list-wrapper" v-loading="loading">
    <div class="user-list">
      <div class="user-item" v-for="item in userList" :key="item.user_id">
        <div class="user-item-avatar" :style="'background-color:' + getColor()">
          <img :src="item.avatar" />
        </div>
        <div class="user-item-info">
          <div class="user-item-name">{{ item.nickname }}</div>
          <div class="user-item-phone">{{ item.phone }}</div>
        </div>
        <div class="user-item-icon effect-btn"><svg-icon name="del" /></div>
      </div>
    </div>
    <div class="user-list-fixed" @click="userModelRef.handleShow()"> <img />成员管理 </div>
  </div>
  <userModel ref="userModelRef" :users="userList" />
</template>
<script setup>
  import userModel from './user-manage.vue';
  import { memberListApi } from '@/api/file';
  import { getColor } from '@/utils/util';
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;

  const folderQuery = inject('folderQuery');

  const loading = ref(false);
  const userModelRef = ref(null);

  const userList = ref([]);
  const getMemberList = async () => {
    loading.value = true;
    try {
      const res = await memberListApi({
        folder_category_id: folderQuery.value.folder_category_id,
      });
      console.log(res);
      if (res.code != 200) {
        throw new Error(err?.msg);
      }
      userList.value = res.data;
      loading.value = false;
    } catch (err) {
      $message.error(err?.msg || err?.message);
      loading.value = false;
    }
  };
  onMounted(() => {
    getMemberList();
  });
</script>
<style lang="less" scoped>
  .user {
    &-list-wrapper {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    &-list {
      flex: auto;
      overflow: auto;
      margin-bottom: 10px;

      &-fixed {
        margin-top: auto;
        flex: none;
        text-align: center;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #999999;
        line-height: 12px;
        cursor: pointer;
      }
    }
    &-item {
      padding: 18px 30px;
      display: flex;
      align-items: center;
      transition: background-color 0.3s ease;
      &-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        flex: none;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &-info {
        flex: auto;
        margin: 0 12px;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
      }
      &-name {
        color: #333333;
      }
      &-phone {
        margin-top: 10px;
        color: #999999;
      }
      &-icon {
        display: none;
      }
      &:hover {
        background-color: #f3f4f9;
        .user-item-icon {
          display: block;
        }
      }
    }
  }
</style>
