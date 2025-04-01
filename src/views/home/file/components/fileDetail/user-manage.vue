<template>
  <el-dialog append-to-body v-model="userModelShow" class="self-dialog" title="成员管理" width="800" center>
    <div class="box-wrapper">
      <div class="title">
        <div class="title-item"
          ><img class="title-item-icon mr-5" :src="$getAssetsImages('file/icon-people.png')" />所有成员列表（{{ userList.length || 0 }} )</div
        >
        <div></div>
        <div class="title-item"
          ><img class="title-item-icon mr-5" :src="$getAssetsImages('file/icon-people.png')" />当前已选择的成员（{{ checkList.length || 0 }} )</div
        >
      </div>
      <el-transfer class="self-transfer" :props="{ key: 'user_id' }" v-model="checkList" :data="props.users">
        <template #default="{ option }">
          <div class="transfer-item">
            <!-- {{ option }} -->
            <div class="transfer-item-avatar">
              <img :src="option?.avatar" />
            </div>
            <el-tooltip :content="`${option?.nickname || ''} ${option?.phone || ''}`" placement="top">
              <div class="flex flex-center">
                <div class="transfer-item-name">{{ option?.nickname }}</div>
                <div class="transfer-item-phone">{{ option?.phone }}</div>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-transfer>
      <div class="footer-btn">
        <el-button color="#F2F3F5" @click="userModelShow = false">取消</el-button>
        <el-button color="#197CFA" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import { getColor } from '@/utils/util';
  const props = defineProps({
    users: {
      type: Array,
      default: () => [],
    },
  });
  const userList = computed(() => {
    console.log(props.users);
    return Array.isArray(props.users) ? [...props.users] : [];
  });

  const userModelShow = ref(false);
  const checkList = ref([]);
  // const userlist = ref([
  //   {
  //     id: 1,
  //     label: '长大',
  //     firseName: '长',
  //     phone: '13513549160',
  //     color: getColor(),
  //   },
  //   {
  //     id: 2,
  //     label: '王二',
  //     firseName: '往',
  //     phone: '13513549160',
  //     color: getColor(),
  //   },
  //   {
  //     id: 3,
  //     label: '李三',
  //     firseName: '里',
  //     phone: '13513549160',
  //     color: getColor(),
  //   },
  //   {
  //     id: 4,
  //     label: '赵四',
  //     firseName: '找',
  //     phone: '13513549160',
  //     color: getColor(),
  //   },
  //   {
  //     id: 5,
  //     label: '孙⑤',
  //     firseName: '孙',
  //     phone: '13513549160',
  //     color: getColor(),
  //   },
  // ]);
  const handleConfirm = () => {
    console.log('选择成员');
  };
  const handleShow = () => {
    userModelShow.value = true;
  };
  defineExpose({
    handleShow,
  });
</script>
<style lang="less" scoped>
  .box-wrapper {
    padding: 0 50px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      display: grid;
      grid-template-columns: 264px 106px 264px;
      margin-bottom: 10px;
      &-item {
        display: flex;
        align-items: center;
      }
    }
    .transfer-item {
      display: flex;
      align-items: center;
      &-avatar {
        flex: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        overflow: hidden;
        text-align: center;
        line-height: 18px;
        font-family:
          Microsoft YaHei,
          Microsoft YaHei;
        font-weight: bold;
        font-size: 10px;
        color: #ffffff;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &-name {
        margin: 0 8px;
      }
    }
  }
</style>
