<template>
  <el-button text bg size="large" @click="handleOpenMove" :disabled="!checkFiles?.length">移动</el-button>

  <el-dialog class="self-dialog" append-to-body :title="title" v-model="moveShow" width="830" center>
    <div class="move-wrapper">
      <div class="move-top">
        <div class="move-top-left">
          <div class="move-back"
            ><el-icon><Back /></el-icon
          ></div>
          <div class="move-breadCrumbs">
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.id" @click="handleChangeFolder(item)">
                <span class="breadcrumb-item" :class="activeFolder == item.id ? 'active' : ''">{{ item.label }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="move-top-right">
          <Search searchType="move" />
        </div>
      </div>
      <div class="move-bottom">
        <div class="move-bottom-left">
          <div class="move-menu" v-for="item in leftMenus" :key="item.id">
            <img :src="$getAssetsImages(item.icon)" class="mr-10" />
            {{ item.label }}
          </div>
        </div>
        <div class="move-bottom-right">
          <div class="move-fileList">
            <div class="move-fileItem" :class="item.isAdd ? 'add' : ''" v-for="(item, index) in rightMenus" :key="item.id">
              <img :src="$getAssetsImages(fileType(item.icon))" />
              <div class="move-fileItem-center">
                <div class="move-fileItem-text" v-if="!item.isAdd"> {{ item.label }}</div>
                <el-input v-model="item.label" v-else />
              </div>
              <div class="move-fileItem-btns" v-if="item.isAdd">
                <div class="mr-10 cursor-pointer" @click="handleCheckAdd(item)">
                  <el-icon color="#0D85FD"><Select /></el-icon>
                </div>
                <div class="cursor-pointer" @click="handleDelAdd(index)">
                  <el-icon color="#676E87"><CloseBold /></el-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="addBtn cursor-pointer" :class="isAdd ? 'disabled' : ''" @click="handleAddFolder"
            ><el-icon class="mr-10"><Plus /></el-icon>新建文件夹</div
          >
        </div>
      </div>
      <div class="footer-btn">
        <el-button color="#F2F3F5" @click="moveShow = false">取消</el-button>
        <el-button type="primary" @click="handleMove">移动</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  const checkFiles = inject('checkedList');
  import { fileType, uniqueId } from '@/utils/util';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import { ArrowRight } from '@element-plus/icons-vue';
  import Search from '../search.vue';
  const emits = defineEmits(['listRefresh']);
  // console.log(checkFiles.value);
  const title = ref('123');
  const moveShow = ref(false);
  const breadcrumbs = ref([
    {
      label: '个人空间',
      id: 1,
    },
    {
      label: '2025文件整理',
      id: 2,
    },
  ]);
  const activeFolder = ref(1);
  const leftMenus = ref([
    {
      label: '项目空间',
      id: 1,
      icon: 'file/menu/menu-gskj.png',
    },
    {
      label: '个人空间',
      id: 2,
      icon: 'file/menu/menu-grkj.png',
    },
  ]);
  const rightMenus = ref([
    {
      label: '20250108新建文件夹',
      id: 1,
      type: 'folder',
      icon: 'wjj',
      isAdd: true,
    },
    {
      label: '20250108新建文件夹',
      id: 2,
      type: 'document',
      icon: 'any',
    },
  ]);
  const isAdd = ref(true);
  const handleOpenMove = () => {
    moveShow.value = true;
  };
  const handleMove = () => {
    console.log('移动');
  };
  const handleCheckAdd = (item) => {
    item.isAdd = false;
    isAdd.value = false;
    /* 掉接口创建  */
  };
  const handleDelAdd = (index) => {
    rightMenus.value.splice(index, 1);
    isAdd.value = false;
  };
  const handleChangeFolder = (item) => {
    activeFolder.value = item.id;
  };

  const handleAddFolder = () => {
    if (isAdd.value) return;
    rightMenus.value.unshift({
      label: '新建文件夹',
      id: uniqueId(),
      type: 'folder',
      icon: 'wjj',
      isAdd: true,
    });
  };
</script>

<style lang="less" scoped>
  .move {
    &-wrapper {
    }
    &-top {
      border-top: 1px solid #ececec;
      border-bottom: 1px solid #ececec;
      display: flex;
      align-items: center;
      padding: 20px;
      &-left {
        display: flex;
        align-items: center;
      }
      &-right {
        margin-left: auto;
      }
    }
    &-back {
      cursor: pointer;
      color: #000;
      font-size: 18px;
      padding-right: 20px;
      margin-right: 20px;
      &.disabled {
        color: #7991ad;
      }
      border-right: 1px solid #ececec;
    }
    &-breadCrumbs {
      .breadcrumb-item {
        color: #999999;
        cursor: pointer;
        &.active {
          cursor: not-allowed;
          color: #000;
        }
      }
    }
    &-bottom {
      border-bottom: 1px solid #ececec;
      display: flex;
      &-left {
        border-right: 1px solid #ececec;
        width: 260px;
        flex: none;
      }
      &-right {
        display: flex;
        flex-direction: column;
        padding: 20px 40px;
        max-height: 500px;
        overflow: hidden;
        flex: auto;
        .addBtn {
          flex: none;
          font-family:
            Microsoft YaHei,
            Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
          &:hover {
            color: var(--el-color-primary);
          }
          &.disabled {
            color: #999999;
            cursor: not-allowed;
          }
        }
      }
    }
    &-menu {
      padding: 20px 22px;
      display: flex;
      align-items: center;
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 19px;
      &:hover {
        background: #e9efff;
      }
      &.active {
        background: #e1e9ff;
      }
    }
    &-fileList {
      flex: auto;
      overflow: auto;
    }
    &-fileItem {
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 14px;
      color: #31373d;
      line-height: 14px;
      border-bottom: 1px solid #d8dbe2;
      padding-bottom: 8px;
      &.add {
        // border-bottom: 1px solid #d8dbe2;

        :deep(.el-input__wrapper) {
          box-shadow: none !important;
        }
      }
      &-center {
        margin-left: 10px;
        flex: auto;
        overflow: hidden;
        margin-right: 30px;
      }
      &-text {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-btns {
        font-size: 18px;
        margin-left: auto;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
