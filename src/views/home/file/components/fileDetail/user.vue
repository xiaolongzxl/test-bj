<template>
  <div class="user-list-wrapper">
    <div class="user-list">
      <div class="user-item" v-for="item in userList" :key="item.id">
        <div class="user-item-avatar" :style="'background-color:' + getColor()">{{ item.firstName }}</div>
        <div class="user-item-info">
          <div class="user-item-name">{{ item.name }}</div>
          <div class="user-item-phone">{{ item.phone }}</div>
        </div>
        <div class="user-item-icon effect-btn"><svg-icon name="del" /></div>
      </div>
    </div>
    <div class="user-list-fixed" @click="userModelRef.handleShow()"> <img />成员管理 </div>
  </div>
  <userModel ref="userModelRef" />
</template>
<script setup>
  import userModel from './user-manage.vue';
  const userModelRef = ref(null);
  import { getColor } from '@/utils/util';
  const userList = ref([
    {
      name: '管理员（我）',
      avatar: '',
      phone: '13513549160',
      firstName: '霍',
      id: 1,
    },
    {
      name: '李丽萍',
      avatar: '',
      phone: '18003469106',
      firstName: '李',
      id: 2,
    },
    {
      name: '赵雪霞',
      avatar: '',
      phone: '13569856234',
      firstName: '李',
      id: 3,
    },
    {
      name: '王晨光',
      avatar: '',
      phone: '15896874521',
      firstName: '李',
      id: 4,
    },
    {
      name: '刘 洋',
      avatar: '',
      phone: '18269874563',
      firstName: '李',
      id: 5,
    },
  ]);
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
