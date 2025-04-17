<template>
  <el-dialog key="copyMove" class="self-dialog" append-to-body :title="title" v-model="moveShow" width="830" center>
    <div class="move-wrapper">
      <div class="move-top">
        <div class="move-top-left">
          <div class="move-back"
            ><el-icon><Back /></el-icon
          ></div>
          <div class="move-breadCrumbs">
            <Breadcrumbs :activeBread="breadFolderQuery.parent_id" @routeChange="changeFolder" />
          </div>
        </div>
        <div class="move-top-right">
          <Search searchType="move" />
        </div>
      </div>
      <div class="move-bottom">
        <div class="move-bottom-left">
          <el-scrollbar>
            <el-menu @select="changeFolder" :default-active="breadFolderQuery.folder_category_id" :unique-opened="true" mode="vertical">
              <template v-for="menu in leftMenus" :key="menu.id">
                <el-sub-menu :index="menu.id" v-if="menu.children">
                  <template #title>
                    <div class="menuitem">
                      <img class="mr-10" :src="$getAssetsImages(`file/menu/menu-${menu.icon}.png`)" />
                      {{ menu.label }}
                    </div>
                  </template>
                  <el-menu-item :index="tmenu.id" v-for="tmenu in menu.children" :key="tmenu.id">
                    <div class="menuitem">
                      {{ tmenu.label }}
                    </div>
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="menu.id">
                  <div class="menuitem">
                    <img class="mr-10" :src="$getAssetsImages(`file/menu/menu-${menu.icon}.png`)" />
                    {{ menu.label }}
                  </div>
                </el-menu-item>
              </template>
            </el-menu>
          </el-scrollbar>
        </div>
        <div class="move-bottom-right" v-loading="tableLoading">
          <div class="move-fileList">
            <div class="move-fileItem" :class="item.isAdd ? 'add' : ''" v-for="(item, index) in rightMenus" :key="item.open">
              <img :src="$getAssetsImages(fileType(item.extension))" />
              <div class="move-fileItem-center">
                <div
                  @dblclick="handledblClick(item)"
                  class="move-fileItem-text"
                  :class="getIsFolder(item.extension) ? 'cursor-pointer' : ''"
                  v-if="!item.isAdd"
                >
                  {{ item.name }}</div
                >
                <el-input v-model="item.name" v-else />
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
        <el-button type="primary" @click="handleSubmit">{{ flag == 'move' ? '移动' : '复制' }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  import { fileType, uniqueId, getIsFolder } from '@/utils/util';
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  import { getFileListApi, addFolderApi, copyApi } from '@/api/file';
  import { ArrowRight } from '@element-plus/icons-vue';
  import { ElLoading } from 'element-plus';
  import Search from '../search.vue';
  import Breadcrumbs from '../breadCrumbs.vue';
  const route = useRoute();
  const emits = defineEmits(['listRefresh']);
  const folderQuery = inject('folderQuery');
  const breadFolderQuery = ref({
    folder_category_id: 0,
    parent_id: 0,
  });

  const filterOneMenu = ['/file/password-management', '/file/recycle-bin'];
  const moveShow = ref(false);

  const activeFolder = ref('');
  const activeMenu = ref('');
  const tableLoading = ref(false);

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
  const isAdd = ref(false);
  const flag = ref('move');
  const originFiles = ref([]);
  const leftMenus = computed(() => {
    let allRou = fileMenuStore().routes;
    if (flag.value == 'move') {
      allRou = allRou.filter((e) => route.fullPath.includes(e.meta.route));
    } else {
      allRou = allRou.filter((e) => !filterOneMenu.includes(e.meta.route));
    }
    return allRou.map((e) => ({
      label: e.meta.title,
      id: e.meta.id.toString(),
      icon: e.meta.icon,
      children:
        Array.isArray(e?.children) &&
        e?.children.map((el) => ({
          label: el.meta.title,
          id: el.meta.id.toString(),
          icon: el.meta.icon,
        })),
    }));
  });
  const title = computed(() => {
    let front = flag.value == 'move' ? '移动' : '复制';
    return `${front}-${originFiles.value.length}个文件（夹）`;
  });
  const open = (_originFiles, _flag) => {
    flag.value = _flag;

    originFiles.value = _originFiles;
    breadFolderQuery.value = {
      ...folderQuery.value,
    };

    getFileList();
    moveShow.value = true;
  };
  /* 点击面包屑和左侧菜单 */
  const changeFolder = (item) => {
    if (item?.type) {
      if (item.type == 1) {
        breadFolderQuery.value.parent_id = item.id.toString();
      } else {
        breadFolderQuery.value.parent_id = '0';
      }
    } else {
      breadFolderQuery.value.folder_category_id = item.toString();
      breadFolderQuery.value.parent_id = '0';
    }
    getFileList();
  };

  /* 双击右边文件夹 */
  const handledblClick = (item) => {
    if (getIsFolder(item.extension)) {
      changeFolder({ type: 1, id: item.id });
    }
  };
  /* 查询文件列表 */
  const getFileList = async () => {
    try {
      tableLoading.value = true;

      const res = await getFileListApi(breadFolderQuery.value);
      tableLoading.value = false;

      if (res.code != 200) {
        throw new Error(res.msg);
      } else {
        rightMenus.value = res.data
          .filter((e) => !originFiles.value.map((el) => el.open).includes(e.open))
          .map((e) => {
            return {
              ...e,
              extension: e.extension ? e.extension : e.name.split('.')[e.name.split('.').length - 1],
            };
          });
      }
    } catch (err) {
      tableLoading.value = false;
      $message.error(err.message);
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    try {
      const api = flag.value == 'copy' ? copyApi : '';
      const data = {
        parent_id: breadFolderQuery.value.parent_id,
        data: originFiles.value.map((e) => {
          return {
            id: e.id,
            type: getIsFolder(e.extension) ? 1 : 2,
          };
        }),
      };
      if (flag.value == 'copy') {
        data.folder_category_id = breadFolderQuery.value.folder_category_id;
      }
      const res = await fileMenuStore().handleMoveCopy(data, flag.value);

      loading.close();
      $message.success('操作成功');
      emits('listRefresh');
      moveShow.value = false;
    } catch (err) {
      loading.close();
      $message.error(err?.message || err?.msg);
    }
  };
  const handleCheckAdd = async (item) => {
    /* 掉接口创建  */
    try {
      tableLoading.value = true;
      const res = await addFolderApi({ ...breadFolderQuery.value, name: item.name });
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      tableLoading.value = false;
      item.isAdd = false;
      isAdd.value = false;
      getFileList();
    } catch (err) {
      tableLoading.value = false;
      $message.error(err?.message || err?.msg);
    }
  };
  const handleDelAdd = (index) => {
    rightMenus.value.splice(index, 1);
    isAdd.value = false;
  };

  const handleAddFolder = () => {
    if (isAdd.value) return;
    isAdd.value = true;
    rightMenus.value.unshift({
      name: '新建文件夹',
      id: uniqueId(),
      type: 'folder',
      extension: '1',
      open: uniqueId(),
      isAdd: true,
    });
  };
  provide('folderQuery', breadFolderQuery);
  defineExpose({
    open,
  });
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
        .el-menu-item,
        .el-sub-menu {
          transition:
            background 0.3s,
            color 0.3s;
          .menuitem {
            padding: 20px 0;
            font-weight: 400;
            font-size: 15px;
            color: #333333;
            line-height: 20px;
            &-icon {
              margin-right: 14px;
              width: 18px;
              height: 18px;
            }
          }
          &.is-active {
            background: #e9efff;
            .menuitem {
              color: #000;
            }
          }
        }
        .el-sub-menu {
          .el-menu-item {
            --el-menu-level-padding: 32px;
            .menuitem {
              font-size: 14px;
            }
          }
        }
      }
      &-right {
        display: flex;
        flex-direction: column;
        padding: 20px 40px;
        max-height: 500px;
        min-height: 200px;
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
