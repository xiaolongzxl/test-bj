<template>
  <div class="table-wrapper" :class="fileShowType" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
    <template v-if="fileShowType != 'ggst'">
      <el-table
        @row-click="handleClickFile"
        @row-dblclick="handleChangeFolder"
        class="contain-table"
        v-loading="loading"
        :data="dataList"
        row-key="id"
        :header-row-style="{ cursor: 'move' }"
      >
        <template v-for="item in props.row" :key="item.key">
          <el-table-column v-bind="item" :sortable="item.isSort">
            <template #default="scope">
              <template v-if="item.key == 'drag'">
                <img class="drag-handle" :src="$getAssetsImages('file/table-drag.png')" />
              </template>
              <template v-if="item.custom">
                <slot name="custom" :row="scope.row" :index="scope.$index"></slot>
              </template>
              <template v-else-if="item.addType">
                <img :src="$getAssetsImages(fileType(scope.row?.type))" />
                <span class="ml1">{{ scope.row.name }}</span>
              </template>
              <template v-else-if="item.key == 'handle'">
                <el-button class="mr-4" plain type="info"><svg-icon name="more" class="mr-4"></svg-icon> 下载 </el-button>
                <el-dropdown popper-class="changeFileShowPopper" type="primary" @command="handleCommand">
                  <el-button plain type="info"><svg-icon name="table-download" class="mr-4"></svg-icon> 更多 </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="move">
                        <div class="dropItem">移动</div>
                      </el-dropdown-item>
                      <el-dropdown-item command="copy"> <div class="dropItem">复制</div></el-dropdown-item>
                      <el-dropdown-item command="del"><div class="dropItem">删除</div></el-dropdown-item>
                      <el-dropdown-item command="rename"><div class="dropItem">重命名</div></el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
              <template v-else>
                <!-- 默认内容或空状态 -->
                {{ scope.row[item.key] }}
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </template>
    <div class="grid-wrapper" v-else>
      <div class="grid-head">
        <div class="grid-head-item"> 全选 </div>
        <div class="grid-head-item"> 排序 </div>
      </div>
      <el-checkbox-group class="grid-body" v-loading="loading" v-model="checkedList" @change="handleCheckedListChange">
        <div
          class="grid-file"
          @click="handleClickFile(item)"
          @dblclick="handleChangeFolder(item)"
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
    <div class="fixedUpload" v-if="!tableDrag && isDropTable">
      <img :src="$getAssetsImages('file/dropUpload.png')" />
      <el-button class="mt-10" color="#017FFD">拖动到这里进行上传</el-button>
    </div>
  </div>
</template>
<script setup>
  import Sortable from 'sortablejs';
  const props = defineProps({
    dataList: {
      type: Array,
      default: () => [],
    },
    fileShowType: {
      type: String,
      default: 'ggst',
    },

    loading: {
      type: Boolean,
      default: false,
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Array,
      default: () => [],
    },
  });

  const tableDrag = ref(false);
  const clickFile = ref();
  const checkedList = ref([]);
  const emits = defineEmits(['clickFile', 'update:checkedList']);
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import { fileType } from '@/utils/util';
  const isDropTable = ref(false);
  watch(
    () => props.fileShowType,
    (nval) => {
      if (nval != 'ggst') {
        nextTick(() => {
          initRowDrag();
        });
      }
    }
  );

  watch(
    () => props.checkedList,
    (val) => {
      checkedList.value = val;
    },
    {
      immediate: true,
    }
  );
  // 初始化拖拽
  const initRowDrag = () => {
    const tbody = document.querySelector('.el-table__body-wrapper tbody');
    if (!tbody) return;
    Sortable.create(tbody, {
      handle: '.drag-handle', // 拖拽手柄选择器
      animation: 150,
      onStart: () => {
        tableDrag.value = true;
      },
      onEnd: ({ newIndex, oldIndex }) => {
        tableDrag.value = false;
        // 同步数据顺序
        const temp = dataList.value[oldIndex];
        dataList.value.splice(oldIndex, 1);
        dataList.value.splice(newIndex, 0, temp);
      },
    });
  };
  const handleClickFile = (item) => {
    clickFile.value = item;
    emits('clickFile', item);
  };
  const handleChangeFolder = (item) => {
    console.log('双击某个数据');
  };
  const handleCheckedListChange = (val) => {
    emits('update:checkedList', val);
  };
  const handleCommand = (command) => {};

  onMounted(() => {
    initRowDrag();
  });
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
</script>
<style lang="less" scoped>
  @import '../components/common.less';
  .drag-handle {
    cursor: move;
    user-select: none;
  }
  .dropItem {
    transition:
      background-color 0.3s,
      color 0.3s;
    width: 100%;
    padding: 10px 20px;
    &:hover {
      background: #f4f9ff;
      color: #0066ff;
    }
    &.active {
      background: #f4f9ff;
      color: #0066ff;
    }
  }
</style>
