<template>
  <div class="contain">
    <div class="contain-left">
      <div class="btns">
        <div class="btns-left">
          <el-button type="info" plain>新建</el-button>
          <el-button type="info" plain>上传</el-button>
        </div>
        <div class="btns-right">
          <el-button type="info" plain>下载</el-button>
          <el-button type="info" plain>移动</el-button>
          <el-button type="info" plain>复制</el-button>
          <el-button type="info" plain>删除</el-button>
        </div>
      </div>
      <div class="search">
        <div class="search-left">
          <div class="title-icon"></div>
          <div> 文件列表：</div>
        </div>
        <div class="search-right">
          <el-input v-model="input1" style="width: 240px" placeholder="搜索当前文件夹">
            <template #append>
              <div class="flex flex-center">
                <img class="mr1" :src="$getAssetsImages('file/table-inp.png')" />
                搜索
              </div>
            </template>
          </el-input>
        </div>
      </div>

      <div class="table-wrapper">
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
      </div>
    </div>
  </div>
</template>
<script setup>
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  import Sortable from 'sortablejs';
  const input1 = ref('');
  const loading = ref(false);
  const dataList = ref([
    { name: 'name1', creatby: '姓名', updateTime: '1', size: '2', id: 1 },
    { name: 'name2', creatby: '姓名', updateTime: '2', size: '3', id: 2 },
    { name: 'name3', creatby: '姓名', updateTime: '3', size: '4', id: 3 },
  ]);

  // 初始化拖拽
  const initRowDrag = () => {
    const tbody = document.querySelector('.el-table__body-wrapper tbody');
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
  onMounted(() => {
    initRowDrag();
  });
</script>
<style lang="less" scoped>
  @import '../components/common.less';
  .drag-handle {
    cursor: move;
    user-select: none;
  }
</style>
