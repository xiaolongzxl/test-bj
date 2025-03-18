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
          :class="{
            'multi-selected active': checkedList.includes(item.id),
            'drop-target-folder': isDropTarget,
          }"
          @click="handleClickFile(item)"
          @dblclick="handleChangeFolder(item)"
          v-for="(item, index) in dataList"
          :key="item.id"
          :data-index="index"
        >
          <el-checkbox :value="item.id" class="showCheckbox"></el-checkbox>
          <div class="drag-handle">
            <div class="grid-file-icon">
              <img :src="$getAssetsImages(fileType(item.type, true))" />
            </div>
            <div class="grid-file-text">{{ item.name }}</div>
          </div>
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
  import { Sortable, MultiDrag } from 'sortablejs';

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
  const isDropTable = ref(false);
  const isDropTarget = ref(false);
  const selectedItems = ref(new Set());
  watch(
    () => props.fileShowType,
    (nval) => {
      nextTick(() => {
        initRowDrag();
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
  // 索引映射优化
  const indexMap = computed(() => new Map(props.dataList.map((item, index) => [item.id, index])));
  // 初始化拖拽
  const initRowDrag = () => {
    const isGrid = props.fileShowType === 'ggst';
    if (sortInstance) {
      sortInstance.destroy();
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

    // if (!containDom) return;
    sortInstance = Sortable.create(containDom, {
      ...options,
      handle: '.drag-handle',
      multiDrag: true,
      multiDragKey: 'Ctrl',
      avoidImplicitDeselect: false,
      ghostClass: 'sortable-ghost', // 新增幽灵类
      chosenClass: 'sortable-chosen', // 新增选中类
      forceFallback: true,
      selectedClass: 'avtice',
      animation: 150,
      // 核心事件处理
      onSelect: function (evt) {
        console.log(evt);
        let { item } = evt;
        const id = item.dataset.id;
        if (!checkedList.value.includes(id)) {
          checkedList.value = [...checkedList.value, id];
        }
      },

      onDeselect: ({ item }) => {
        const id = item.dataset.id;
        checkedList.value = checkedList.value.filter((v) => v !== id);
      },
      onStart: (evt) => {
        tableDrag.value = true;
      },
      onMove(evt) {
        const targetItem = getItemByDOM(evt.related);
        const targetRow = getItemByDOM(evt.related, 'row');

        // 如果是文件夹则显示移动样式
        if (targetItem?.type === 'wjj') {
          evt.dragged.classList.add('moving-to-folder');

          targetRow.classList.add('drop-target-folder');
          return false;
        } else {
          evt.dragged.classList.remove('moving-to-folder');
          document.querySelectorAll('.drop-target-folder').forEach((el) => el.classList.remove('drop-target-folder'));
        }
        return true;
      },

      onEnd: (evt) => {
        // 处理文件夹拖放
        const targetItem = getItemByDOM(evt.to);
        if (targetItem?.type === 'folder') {
          handleMoveToFolder(targetItem);
          return;
        }

        // 正常排序逻辑
        const oldIndexes = [...evt.oldIndicies].map((i) => i.index);
        const newIndex = evt.newIndex > evt.oldIndex ? evt.newIndex - oldIndexes.length + 1 : evt.newIndex;

        // 执行批量移动
        const newList = reorderArray(props.dataList, oldIndexes, newIndex);
        emits('update:dataList', newList);
        // 清理样式
        // item.classList.remove('moving-to-folder');
        // document.querySelectorAll('.drop-target-folder').forEach((el) => {
        //   el.classList.remove('drop-target-folder');
        // });

        // // 获取目标项（双重验证）
        // const targetDom = getItemByDOM(item, 'dom');
        // const targetData = getItemByDOM(targetDom);

        // // 如果目标是文件夹
        // if (targetData?.type === 'wjj') {
        //   console.log('移动');
        //   return;
        // }

        // // 同步数据顺序
        // // 正常排序逻辑
        // const newList = [...props.dataList];
        // const [movedItem] = newList.splice(oldIndex, 1);
        // newList.splice(newIndex, 0, movedItem);
        // tableDrag.value = false;
        // emits('update:dataList', newList);
      },
    });
  };
  // 数组重排序工具
  const reorderArray = (arr, oldIndexes, newIndex) => {
    const movedItems = oldIndexes.map((i) => arr[i]).reverse();
    let tempArr = arr.filter((_, i) => !oldIndexes.includes(i));
    tempArr.splice(newIndex, 0, ...movedItems);
    return tempArr;
  };
  // 新增DOM到数据项的映射方法
  const getItemByDOM = (domElement, type = 'data') => {
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
      const validChildren = Array.from(container.children).filter((el) => el.classList.contains(selector.replace('.', '')));
      index = validChildren.indexOf(row);
    } else {
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
    // 同步到 Sortable
    if (sortInstance) {
      const indexes = val.map((id) => indexMap.value.get(id)).filter((i) => i !== undefined);
      const doms = document.querySelectorAll('.grid-body .grid-file');
      // // 模拟用户点击事件以触发插件选中逻辑（关键步骤！）
      function simulateMultiSelect(element) {
        const event = new MouseEvent('click', {
          bubbles: true,
          ctrlKey: true, // 模拟按住 Ctrl 键
        });
        element.dispatchEvent(event);
      }
      indexes.forEach((i) => {
        nextTick(() => {
          simulateMultiSelect(doms[i]);
        });
      });
    }

    // 触发外部更新

    emits('update:checkedList', val);
  };
  const handleCommand = (command) => {};

  onMounted(() => {
    Sortable.mount(new MultiDrag());
    initRowDrag();
    nextTick(() => {
      // 初始选中状态同步
      handleCheckedListChange(checkedList.value);
    });
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
  // 多选拖拽样式
  .multi-drag-ghost {
    position: fixed;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    transform: rotate(-3deg);
    z-index: 9999;

    .badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #017ffd;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  }

  .multi-selected {
    background: #f0f6ff;
    border: 2px solid #017ffd !important;
  }
  .drag-handle {
    cursor: move;
    user-select: none;
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
