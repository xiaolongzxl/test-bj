<template>
  <div
    class="table-wrapper"
    @keydown.ctrl.exact.c.prevent="handleCtrlC"
    @keydown.ctrl.exact.v.prevent="handleCtrlV"
    tabindex="-1"
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
      :row-key="props.rowKey"
      :current-row-key="props.rowKey"
      :highlight-current-row="props.isCurrentRow"
      :border="tableBorder"
      :row-class-name="({ row }) => (isCheck(row) ? 'active' : '')"
    >
      <template v-for="item in props.row" :key="item.key">
        <el-table-column v-bind="item" :sortable="item.isSort">
          <template #default="scope">
            <template v-if="item.key == 'drag'">
              <img v-show="checkedList?.length ? isCheck(scope.row) : true" class="drag-handle" :src="$getAssetsImages('file/table-drag.png')" />
            </template>
            <template v-if="item.custom">
              <slot :name="`${item.key}Custom`" :row="scope.row" :index="scope.$index"></slot>
            </template>
            <template v-else-if="item.addType">
              <div
                class="flex cursor-pointer"
                style="align-items:center;overflow-hidden"
                :data-is-folder="scope.row.type == 'wjj'"
                @click="handleChangeFolder(scope.row)"
              >
                <img class="tableFileImg" :src="$getAssetsImages(fileType(scope.row?.extension))" />
                <span class="ml1" style="flex: auto; text-overflow: ellipsis; overflow: hidden; text-align: left">{{ scope.row.name }}</span>
              </div>
            </template>
            <template v-else-if="item.key == 'handle'">
              <Btns
                :btnType="['tableDownload', 'tableMore', getIsFolder(scope.row.extension) ? '' : 'tablePreview']"
                :lineRow="scope.row"
                @listRefresh="emits('listRefresh')"
              />
            </template>
            <template v-else-if="item.key == 'select'">
              <el-checkbox :model-value="isCheck(scope.row)" @change="handleNormalCheck(scope.row)"></el-checkbox>
            </template>
            <template v-else>
              <!-- 默认内容或空状态 -->
              {{ scope.row[item.key] }}
            </template>
          </template>
          <template #header v-if="item.key == 'select'">
            <el-checkbox :model-value="isCheckAll" @change="handleCheckAllChange" :indeterminate="isHalfCheck"></el-checkbox>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="grid-wrapper" v-show="fileShowType == 'ggst'">
      <div class="grid-head">
        <div class="grid-head-item">
          <el-checkbox :model-value="isCheckAll" @change="handleCheckAllChange" :indeterminate="isHalfCheck">
            <span>全选</span>
          </el-checkbox>
        </div>
        <div class="grid-head-item"> 排序 </div>
      </div>

      <div class="grid-body">
        <div
          class="grid-file"
          :class="{
            active: isCheck(item),
          }"
          @click="handleClickFile(item)"
          @dblclick="handleChangeFolder(item)"
          v-for="(item, index) in dataList"
          :key="item[props.rowKey]"
          :data-index="item[props.rowKey]"
        >
          <el-checkbox class="showCheckbox" :model-value="isCheck(item)" @change="handleNormalCheck(item)"></el-checkbox>
          <div class="morebtn">
            <template v-if="props.isCustomCardMore">
              <slot name="cardMore" :row="item" :index="index"></slot>
            </template>
            <Btns v-else :btnType="['tableMore']" tableMoreType="card" :lineRow="item" @listRefresh="emits('listRefresh')" />
          </div>

          <div :class="(checkedList?.length ? isCheck(item) : true) ? 'drag-handle' : 'drag-no'">
            <div class="flex-col flex-center">
              <div class="grid-file-icon">
                <img :src="$getAssetsImages(fileType(item.extension, true))" />
              </div>
              <div class="grid-file-text cursor-pointer" @click="handleChangeFolder(scope.row)">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixedUpload" v-if="!tableDrag && isDropTable">
      <img :src="$getAssetsImages('file/dropUpload.png')" />
      <el-button class="mt-10" color="#017FFD">拖动到这里进行上传</el-button>
    </div>
  </div>
</template>
<script setup>
  import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
  import Btns from './btns/index.vue';
  import { ElLoading } from 'element-plus';
  import { fileType, fileUpload, getIsFolder } from '@/utils/util';
  import { fileFolderSort } from '@/api/file';
  const emits = defineEmits(['clickFile', 'dbClick', 'update:checkedList', 'update:dataList', 'listRefresh']);
  const props = defineProps({
    rowKey: {
      type: String,
      default: 'open',
    },
    tableBorder: {
      type: Boolean,
      default: false,
    },
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
    isCurrentRow: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Array,
      default: () => [],
    },
    /* 是否自定义宫格视图更多按钮 */
    isCustomCardMore: {
      type: Boolean,
      default: false,
    },
  });

  const DROP_THRESHOLD = 0.05; // 20%边界区域
  const tableRef = ref(null);

  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;

  const folderQuery = inject('folderQuery');

  let sortInstance = null;
  const tableDrag = ref(false);
  const clickFile = ref();
  const checkedList = ref([...props.checkedList]);

  const isDropTable = ref(false);

  const isHalfCheck = computed(() => {
    return checkedList.value.length > 0 && checkedList.value.length < props.dataList.length;
  });
  const isCheckAll = computed(() => {
    return props.dataList.length && checkedList.value.length == props.dataList.length;
  });
  // 优化isCheck计算
  const checkedSet = computed(() => new Set(checkedList.value));
  // 索引映射优化
  const indexMap = computed(() => new Map(props.dataList.map((item, index) => [item[props.rowKey], index])));

  const checkedDataList = computed(() => {
    return props.dataList.filter((item) => checkedSet.value.has(item[props.rowKey]));
  });

  const targetDom = ref({});
  const isCheck = (row) => checkedSet.value.has(row[props.rowKey]);

  watch(
    () => props.fileShowType,
    async (nval, oldv) => {
      if (props.checkedList.length) {
        await handleClearSortList(props.checkedList, oldv);
        checkedList.value = [...props.checkedList];
      }
      nextTick(() => {
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
      if (newVal.length !== checkedList.value.length || newVal.some((v, i) => v !== checkedList.value[i])) {
        checkedList.value = newVal.slice();
      }
    },
    {
      immediate: true,
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
            // console.log(oldVal, newVal);
            oldVal.forEach((id) => {
              const index = indexMap.value.get(id);
              // console.log(id, index);
              if (index >= 0) {
                const item = containDom.children[index];
                Sortable.utils.deselect(item);
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
    }
  );

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
        // const { id } = getItemByDOM(item);
        // console.log(item, 219);
        // if (!checkedList.value.includes(id)) {
        //   checkedList.value = [...checkedList.value, id];
        // }
        Sortable.utils.deselect(item);
      },

      onDeselect: ({ item }) => {
        // console.log(item, 222);
        console.log(item);
        // const { id } = getItemByDOM(item);
        // checkedList.value = checkedList.value.filter((v) => v !== id);
        Sortable.utils.select(item);
      },
      onStart: (evt) => {
        tableDrag.value = true;
      },
      onMove(evt) {
        const targetRow = evt.related.closest('.el-table__row, .grid-file');
        const targetItem = getItemByDOM(targetRow, 'data', 'move');
        const draggerItem = getItemByDOM(evt.dragged, 'data', 'move');
        targetDom.value = targetItem;
        console.log(evt);
        // 如果是文件夹则显示移动样式
        if (
          (getIsFolder(draggerItem.extension) && !getIsFolder(targetItem?.extension)) ||
          (!getIsFolder(draggerItem.extension) && getIsFolder(targetItem?.extension))
        ) {
          return false;
        }
        if (getIsFolder(targetItem?.extension)) {
          const rect = targetRow.getBoundingClientRect();
          const mouseX = evt.originalEvent.clientX;
          const mouseY = evt.originalEvent.clientY;
          // 计算相对位置百分比
          const xPercent = (mouseX - rect.left) / rect.width;
          const yPercent = (mouseY - rect.top) / rect.height;

          // 判断是否在中心区域
          const isInCentralArea =
            xPercent > DROP_THRESHOLD && xPercent < 1 - DROP_THRESHOLD && yPercent > DROP_THRESHOLD && yPercent < 1 - DROP_THRESHOLD;
          // 添加视觉反馈

          // 在中心区域则阻断排序操作
          return !isInCentralArea;
        }
        return true;
      },

      onEnd: (evt) => {
        // 处理文件夹拖放

        const targetRow = evt.item.closest('.el-table__row, .grid-file');
        const targetItem = getItemByDOM(targetRow, 'data', 'end');
        const cloneData = evt.clone ? [getItemByDOM(evt.item, 'data', 'end')] : checkedDataList.value;

        if (evt.oldIndex == evt.newIndex && getIsFolder(targetDom.value?.extension)) {
          const data = {
            parent_id: targetDom.value?.id,
            data: cloneData.map((item) => {
              return {
                id: item.id,
                type: getIsFolder(item.extension) ? 1 : 2,
              };
            }),
          };
          handleMove(data);
          // handleMoveToFolder(targetItem);
          return;
        }

        // 执行批量移动
        const newList = reorderArray(evt);
        targetDom.value = {};
        emits('update:checkedList', []);
        emits('update:dataList', newList);
      },
    });
    // console.log(sortInstance);
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
    handleSort(tempArr);
    return tempArr;
  };
  const handleSort = async (_data) => {
    try {
      const data = {
        data: _data.map((e) => ({ type: getIsFolder(e.extension) ? '1' : '2', id: e.id, sort: e.sort })),
      };
      const res = await fileFolderSort(data);
      if (res.code != 200) {
        throw new Error(res.msg);
      }
    } catch (err) {
      $message.error(err?.message || err?.msg);
    }
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
  /* 切换视图先清空sortable选中列表 */
  const handleClearSortList = (checkList, fileShowType) => {
    const containDom = fileShowType == 'ggst' ? document.querySelector('.grid-body') : document.querySelector('.el-table__body-wrapper tbody');
    checkList.forEach((id) => {
      const index = indexMap.value.get(id);
      // console.log(id, index);
      if (index >= 0) {
        const item = containDom.children[index];
        Sortable.utils.deselect(item);
        return true;
      }
    });
  };
  /* 切换点击文件 */
  const handleClickFile = (item) => {
    clickFile.value = item;
    emits('clickFile', item);
  };
  /* 双击 */
  const handleChangeFolder = (item) => {
    console.log('双击某个数据', item);
    if (getIsFolder(item.extension)) {
      emits('dbClick', item);
    }
  };
  /* 点击全选复选框 */
  const handleCheckAllChange = () => {
    let _checkedList = [...checkedList.value];

    if (_checkedList.length == props.dataList.length) {
      _checkedList = [];
    } else {
      _checkedList = props.dataList.map((e) => e[props.rowKey]);
    }
    emits('update:checkedList', _checkedList);
  };
  /* 点击普通选中 */
  const handleNormalCheck = (val) => {
    let _checkedList = [...checkedList.value];
    if (_checkedList.includes(val[props.rowKey])) {
      _checkedList = _checkedList.filter((e) => e !== val[props.rowKey]);
    } else {
      _checkedList.push(val[props.rowKey]);
    }
    emits('update:checkedList', _checkedList);
  };

  onMounted(() => {
    initRowDrag();
    document.addEventListener('key', handleDragOver);
  });
  /* 监听复制事件 */
  const handleCtrlC = () => {
    if (checkedDataList.value.length > 0) {
      console.log(checkedDataList.value);
      fileMenuStore().setCopyFiles(
        folderQuery.value.parent_id,
        checkedDataList.value.map((e) => ({ id: e.id, type: getIsFolder(e.extension) ? 1 : 2 }))
      );
      $message.success('选中项已复制，请粘贴(Ctrl+V)到目标文件夹');
    }
  };
  /* 监听粘贴事件 */
  const handleCtrlV = async () => {
    const { copyFiles, originFolder } = fileMenuStore().copyQuery;
    if (copyFiles.length > 0) {
      if (originFolder == folderQuery.value.parent_id) {
        $message.error('不能复制到自己');
      } else {
        const loading = ElLoading.service({
          text: '请稍等...',
          lock: true,
          background: 'rgba(0, 0, 0, 0.4)',
        });
        try {
          const res = await fileMenuStore().handlePaste(folderQuery.value);
          loading.close();
          $message.success('粘贴成功');
          emits('listRefresh');
        } catch (err) {
          loading.close();
          $message.error(err?.msg || err?.message);
        }
      }
    }
  };
  const handleMove = async (data) => {
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    try {
      const res = await fileMenuStore().handleMoveCopy(data, 'move');
      loading.close();
      targetDom.value = {};
      emits('update:checkedList', []);
      emits('listRefresh');
      $message.success('操作成功');
    } catch (err) {
      loading.close();
      $message.error(err?.msg || err?.message);
    }
  };
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
      uploadFiles(e.dataTransfer.files);
    }
  };
  const uploadFiles = async (files) => {
    const query = {
      folder_category_id: folderQuery.value.folder_category_id,
      folder_id: folderQuery.value.parent_id,
      type: 1,
    };
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    const res = await fileUpload(files, query);
    let flag = 'success';
    loading.close();
    if (res.length) {
      res.forEach((element) => {
        if (element.status == 'error') {
          $message.error(element.error);
        }
        if (element.status != 'success') {
          flag = 'error';
        }
      });
      if (flag == 'success') {
        $message.success('上传成功');
      }
      emits('listRefresh');
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

  /* 拖拽过程样式优化 */
  .sortable-ghost {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .sortable-chosen {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
