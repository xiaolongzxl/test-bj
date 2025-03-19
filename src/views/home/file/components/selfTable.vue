<template>
  <el-checkbox-group v-model="checkedList">
    <div
      class="table-wrapper"
      :class="fileShowType"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <el-table
        ref="tableRef"
        v-show="fileShowType != 'ggst'"
        @row-click="handleClickFile"
        @row-dblclick="handleChangeFolder"
        class="contain-table"
        v-loading="loading"
        :data="dataList"
        row-key="id"
        :row-class-name="({ row }) => (selectable(row) ? 'active' : '')"
      >
        <template v-for="item in props.row" :key="item.key">
          <el-table-column v-bind="item" :sortable="item.isSort">
            <template #default="scope">
              <template v-if="item.key == 'drag'">
                <img v-show="checkedList?.length ? selectable(scope.row) : true" class="drag-handle" :src="$getAssetsImages('file/table-drag.png')" />
              </template>
              <template v-if="item.custom">
                <slot name="custom" :row="scope.row" :index="scope.$index"></slot>
              </template>
              <template v-else-if="item.addType">
                <div :data-is-folder="scope.row.type == 'wjj'">
                  <img :src="$getAssetsImages(fileType(scope.row?.type))" />
                  <span class="ml1">{{ scope.row.name }}</span>
                </div>
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
              <template v-else-if="item.key == 'select'">
                <el-checkbox :value="scope.row.id"></el-checkbox>
              </template>
              <template v-else>
                <!-- 默认内容或空状态 -->
                {{ scope.row[item.key] }}
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="grid-wrapper" v-show="fileShowType == 'ggst'">
        <div class="grid-head">
          <div class="grid-head-item"> 全选 </div>
          <div class="grid-head-item"> 排序 </div>
        </div>
        <!-- <el-checkbox-group class="grid-body" v-loading="loading" v-model="checkedList">

      </el-checkbox-group> -->
        <div class="grid-body">
          <div
            class="grid-file"
            :class="{
              active: selectable(item),
            }"
            @click="handleClickFile(item)"
            @dblclick="handleChangeFolder(item)"
            v-for="item in dataList"
            :key="item.id"
            :data-index="item.id"
          >
            <el-checkbox :value="item.id" class="showCheckbox"></el-checkbox>
            <div :class="(checkedList?.length ? selectable(item) : true) ? 'drag-handle' : 'drag-no'">
              <div class="grid-file-icon">
                <img :src="$getAssetsImages(fileType(item.type, true))" />
              </div>
              <div class="grid-file-text">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fixedUpload" v-if="!tableDrag && isDropTable">
        <img :src="$getAssetsImages('file/dropUpload.png')" />
        <el-button class="mt-10" color="#017FFD">拖动到这里进行上传</el-button>
      </div>
    </div>
  </el-checkbox-group>
</template>
<script setup>
  import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
  const tableRef = ref(null);
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
  let sortInstance = null;
  const tableDrag = ref(false);
  const clickFile = ref();
  const checkedList = ref([...props.checkedList]);
  const emits = defineEmits(['clickFile', 'update:checkedList', 'update:dataList']);
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import { fileType } from '@/utils/util';
  import { update } from 'lodash';
  const isDropTable = ref(false);

  const selectable = (row) => {
    return checkedList.value.includes(row?.id);
  };
  watch(
    () => props.fileShowType,
    (nval) => {
      nextTick(() => {
        if (props.checkedList.length) {
          checkedList.value = [...props.checkedList];
        }
        if (nval != 'ggst') {
          tableRef.value.doLayout();
        }
        if (nval != 'xlb') {
          initRowDrag();
        }
      });
    }
  );
  // 监听外部变化
  watch(
    () => props.checkedList,
    (newVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(checkedList.value)) {
        checkedList.value = [...newVal];
      }
    }
  );
  watch(
    () => checkedList.value,
    (newVal, oldVal) => {
      nextTick(() => {
        const containDom =
          props.fileShowType == 'ggst' ? document.querySelector('.grid-body') : document.querySelector('.el-table__body-wrapper tbody');
        if (sortInstance) {
          if (!oldVal?.length) {
          } else {
            console.log(oldVal);
            oldVal.forEach((id) => {
              const index = indexMap.value.get(id);
              console.log(id, index);
              if (index >= 0) {
                const Griditem = document.querySelector('.grid-body').children[index];
                const Tableitem = document.querySelector('.el-table__body-wrapper tbody').children[index];
                console.log(id, Griditem, Tableitem);
                Sortable.utils.deselect(Griditem);
                Sortable.utils.deselect(Tableitem);
              }
            });
          }

          // 同步新选中项
          newVal.forEach((id) => {
            const index = indexMap.value.get(id);
            if (index !== undefined) {
              const item = containDom.children[index];
              Sortable.utils.select(item);
            }
          });
        }
        // 触发外部更新

        emits('update:checkedList', newVal);
      });
    },
    {
      immediate: true,
      deep: true,
    }
  );
  // 索引映射优化
  const indexMap = computed(() => new Map(props.dataList.map((item, index) => [item.id, index])));
  // 初始化拖拽
  const initRowDrag = () => {
    const isGrid = props.fileShowType === 'ggst';
    if (sortInstance) {
    }
    let containDom = null;
    let handle = '';
    let options = {};
    if (props.fileShowType == 'ggst') {
      containDom = document.querySelector('.grid-body');
      options = {
        draggable: '.grid-file',
        dataIdAttr: 'data-index',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
      };
    } else {
      containDom = document.querySelector('.el-table__body-wrapper tbody');
    }
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const multiDragKey = isMac ? 'Meta' : 'Ctrl';
    // if (!containDom) return;
    sortInstance = Sortable.create(containDom, {
      ...options,
      handle: '.drag-handle',
      multiDrag: true,
      multiDragKey: multiDragKey,
      forceFallback: true,
      selectedClass: 'active',
      animation: 150,
      avoidImplicitDeselect: true,
      fallbackTolerance: 3,
      // 核心事件处理
      onSelect: function ({ item }) {
        const { id } = getItemByDOM(item);
        console.log(item, 219);
        if (!checkedList.value.includes(id)) {
          checkedList.value = [...checkedList.value, id];
        }
      },

      onDeselect: ({ item }) => {
        // console.log(item, 222);
        console.log(item);
        const { id } = getItemByDOM(item);
        checkedList.value = checkedList.value.filter((v) => v !== id);
      },
      onStart: (evt) => {
        tableDrag.value = true;
      },
      onMove(evt) {
        const targetRow = evt.related.closest('.el-table__row, .grid-file');
        const targetItem = getItemByDOM(targetRow, 'data', 'move');

        // 如果是文件夹则显示移动样式
        if (targetItem?.type === 'wjj') {
          // evt.dragged.classList.add('moving-to-folder');
          // targetRow.classList.add('drop-target-folder');
          return false;
        } else {
          // document.querySelectorAll('.drop-target-folder').forEach((el) => el.classList.remove('drop-target-folder'));
          // evt.dragged.classList.remove('moving-to-folder');
        }
        return true;
      },

      onEnd: (evt) => {
        // document.querySelectorAll('.drop-target-folder').forEach((el) => el.classList.remove('drop-target-folder'));
        // 处理文件夹拖放
        const targetRow = evt.item.closest('.el-table__row, .grid-file');
        const targetItem = getItemByDOM(targetRow, 'data', 'end');
        if (targetItem?.type === 'folder') {
          // handleMoveToFolder(targetItem);
          return;
        }
        console.log(evt);

        // 执行批量移动
        const newList = reorderArray(evt);
        emits('update:checkedList', []);
        emits('update:dataList', newList);
      },
    });
    console.log(sortInstance);
  };
  // 数组重排序工具
  const reorderArray = ({ oldIndicies, newIndicies, newIndex, oldIndex }) => {
    const tempArr = [...props.dataList];
    if (oldIndicies.length > 0) {
      //多行拖动排序
      let targetRowList = [];
      oldIndicies.forEach((item) => {
        let data = tempArr[item.index];
        targetRowList.push(data);
      });
      tempArr.splice(oldIndicies[0].index, oldIndicies.length);
      tempArr.splice(newIndicies[0].index, 0, ...targetRowList);
    } else {
      //单行拖动排序
      const targetRow = tempArr[oldIndex];
      tempArr.splice(oldIndex, 1);
      tempArr.splice(newIndex, 0, targetRow);
    }
    return tempArr;
  };
  // 新增DOM到数据项的映射方法
  const getItemByDOM = (domElement, type = 'data', flag) => {
    // console.log(flag)
    if (!domElement) return null;

    // 统一处理两种视图
    const isGrid = props.fileShowType === 'ggst';
    const selector = isGrid ? '.grid-file' : '.el-table__row';
    const row = domElement.closest(selector);

    if (!row) return null;

    // 获取精确索引
    let index;
    if (isGrid) {
      const container = row.parentElement;
      // 过滤有效子元素（重要！）
      const validChildren = Array.from(container.children).filter((el) => el.classList.contains('grid-file'));
      index = validChildren.indexOf(row);
    } else {
      // console.log(row, row.rowIndex, 297, flag);
      index = row.rowIndex; // 表格视图使用原生rowIndex
    }

    // 返回结果
    return type === 'data' ? (index >= 0 ? props.dataList[index] : null) : row;
  };
  const handleClickFile = (item) => {
    clickFile.value = item;
    emits('clickFile', item);
  };
  const handleChangeFolder = (item) => {
    console.log('双击某个数据');
  };
  const handleCheckedListChange = (val) => {
    emits(
      'update:checkedList',
      val.map((e) => e.id)
    );
  };
  const handleCommand = (command) => {};

  onMounted(() => {
    initRowDrag();
  });
  const handleDragOver = () => {
    // console.log('dropover');
    if (!isDropTable.value) isDropTable.value = true;
  };
  const handleDragLeave = (e) => {
    // console.log('dropLevel', e);
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
  .drag-no {
    cursor: no-drop;
    user-select: none;
    pointer-events: none;
  }
  /* 新增拖拽到文件夹的样式 */

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
  /* 拖拽过程样式优化 */
  .sortable-ghost {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .sortable-chosen {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
