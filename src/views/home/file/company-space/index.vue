<template>
  <div class="contain">
    <div class="contain-left">
      <div class="btns">
        <div class="btns-left">
          <FileBtns :btnType="['add', 'upload']" />
        </div>
        <div class="btns-right">
          <FileBtns :btnType="['download', 'move', 'copy', 'del']" />
        </div>
      </div>
      <div class="search">
        <div class="search-left">
          <BreadCrumbs :addLevel="addLevel" />
        </div>
        <div class="search-right">
          <Search searchType="pageSearch" />
          <FileShow v-model:fileShowType="fileShowType" />
        </div>
      </div>

      <div
        class="table-wrapper"
        :class="fileShowType"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <template v-if="fileShowType != 'ggst'">
          <el-table class="contain-table" v-loading="loading" :data="dataList" row-key="id" :header-row-style="{ cursor: 'move' }">
            <el-table-column label="" align="center" min-width="40">
              <template #default>
                <img class="drag-handle" :src="$getAssetsImages('file/table-drag.png')" />
              </template>
            </el-table-column>
            <el-table-column label="文件名称" sortable prop="name" align="center" min-width="120"></el-table-column>
            <el-table-column label="创建人" prop="creatby" align="center" min-width="120"></el-table-column>
            <el-table-column label="修改时间" sortable prop="updateTime" align="center" min-width="120"></el-table-column>
            <el-table-column label="文件大小" sortable prop="size" align="center" min-width="120"></el-table-column>
            <el-table-column label="操作" align="center" min-width="120"></el-table-column>
          </el-table>
        </template>
        <div class="grid-wrapper" v-else>
          <div class="grid-head">
            <div class="grid-head-item"> 全选 </div>
            <div class="grid-head-item"> 排序 </div>
          </div>
          <el-checkbox-group class="grid-body" v-model="checkedList">
            <div
              class="grid-file"
              @click="handleClickFile(item)"
              :class="checkedList.find((e) => e == item.id) ? 'active' : ''"
              v-for="item in dataList"
              :key="item.id"
            >
              <el-checkbox :value="item.id" class="showCheckbox"></el-checkbox>
              <div class="grid-file-icon">
                <img :src="$getAssetsImages(fileType(item.type, true))" />
              </div>
              <div class="grid-file-text">{{ item.name }}</div>
            </div>
          </el-checkbox-group>
        </div>
        <div class="fixedUpload" v-if="isDropTable">
          <img :src="$getAssetsImages('file/dropUpload.png')" />
          <el-button class="mt-10" color="#017FFD">拖动到这里进行上传</el-button>
        </div>
      </div>
    </div>
    <div class="contain-right"><FileDetail :file="clickFile" /> </div>
    <UploadCeri />
  </div>
</template>
<script setup>
  import UploadCeri from '../components/certificateModel.vue';
  import Search from '@/views/home/file/components/search.vue';
  import BreadCrumbs from '@/views/home/file/components/breadCrumbs.vue';
  import Sortable from 'sortablejs';
  import FileShow from '@/views/home/file/components/changeFileShowType.vue';
  import FileDetail from '@/views/home/file/components/fileDetail/index.vue';
  import { fileType } from '@/utils/util';
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const fileShowType = ref('ggst');
  const input1 = ref('');
  const loading = ref(false);
  const addLevel = ref([
    { name: '二级分类1', id: 1, path: '132' },
    { name: '电缆项目1-文件夹', id: 2, path: '456' },
  ]);
  const dataList = ref([
    { name: 'name1', creatby: '姓名', updateTime: '1', size: '2', id: 1, type: 'wjj' },
    { name: 'name2', creatby: '姓名', updateTime: '2', size: '3', id: 2, type: 'word' },
    { name: 'name3', creatby: '姓名', updateTime: '3', size: '4', id: 3, type: 'ppt' },
  ]);
  const checkedList = ref([1, 2]);
  const clickFile = ref({});
  const isDropTable = ref(false);
  // 初始化拖拽
  const initRowDrag = () => {
    const tbody = document.querySelector('.el-table__body-wrapper tbody');
    if (!tbody) return;
    Sortable.create(tbody, {
      handle: '.drag-handle', // 拖拽手柄选择器
      animation: 150,
      onEnd: ({ newIndex, oldIndex }) => {
        // 同步数据顺序
        const temp = dataList.value[oldIndex];
        dataList.value.splice(oldIndex, 1);
        dataList.value.splice(newIndex, 0, temp);
      },
    });
  };
  const handleClickFile = (item) => {
    clickFile.value = item;
  };

  watch(
    () => fileShowType.value,
    (nval) => {
      if (nval != 'ggst') {
        nextTick(() => {
          initRowDrag();
        });
      }
    }
  );

  const handleDragOver = () => {
    console.log('dropover');
    if (!isDropTable.value) isDropTable.value = true;
  };
  const handleDragLeave = (e) => {
    console.log('dropLevel', e);
    if (e.relatedTarget === null || !e.currentTarget.contains(e.relatedTarget)) {
      if (isDropTable.value) isDropTable.value = false;
    }
  };
  const handleDrop = (e) => {
    isDropTable.value = false;
    if (e.dataTransfer.files.length > 0) {
      console.log('handleDrop', e.dataTransfer.files);
    }
  };
  onMounted(() => {
    initRowDrag();
  });
  provide('checkedList', checkedList.value);
</script>
<style lang="less" scoped>
  @import '../components/common.less';
  .drag-handle {
    cursor: move;
    user-select: none;
  }
</style>
