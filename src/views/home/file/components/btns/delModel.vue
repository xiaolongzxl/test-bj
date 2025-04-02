<template>
  <el-dialog class="self-dialog" append-to-body title="提示" v-model="delShow" width="500" center>
    <div class="del-wrapper">
      <div class="del-title">{{
        isMutli ? `你确定要将所选的${delFiles.length}个文件（夹）删除吗？'` : `你确定要将 "${delFiles[0]?.name || ''}" 删除吗？`
      }}</div>
      <div class="del-tip" v-if="flag == 'normal'">删除后文件(夹）将在回收站保留30天</div>
      <div class="del-btns footer-btn">
        <el-button color="#F2F3F5" @click="delShow = false">下次再说</el-button>
        <el-button type="danger" @click="handleDel">删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  import { deleteApi, delHistoryVer } from '@/api/file';
  const emits = defineEmits(['listRefresh']);
  import { getIsFolder } from '@/utils/util';
  import { ElLoading } from 'element-plus';
  const $message = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const props = defineProps({
    flag: {
      type: String,
      default: 'normal',
    },
  });

  const delShow = ref(false);
  const folderQuery = inject('folderQuery');
  const isMutli = computed(() => {
    return delFiles.value.length > 1;
  });
  const delFiles = ref([]);
  const open = (files) => {
    delFiles.value = files;
    delShow.value = true;
  };
  const handleDel = async () => {
    const loading = ElLoading.service({
      text: '请稍等...',
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)',
    });
    try {
      const api = props.flag == 'normal' ? deleteApi : delHistoryVer;
      const data =
        props.flag == 'normal'
          ? {
              folder_category_id: folderQuery.value.folder_category_id,
              data: delFiles.value.map((e) => ({
                type: getIsFolder(e.extension) ? 1 : 2,
                id: e.id,
              })),
            }
          : { folder_category_id: folderQuery.value.folder_category_id, id: delFiles.value[0].id };
      const res = await api(data);
      loading.close();
      if (res.code != 200) {
        throw new Error(res.msg);
      }
      $message.success('删除成功');
      emits('listRefresh');
      delShow.value = false;
    } catch (err) {
      loading.close();
      $message.error(err.message);
    }
    console.log('删除');
  };
  defineExpose({
    open,
  });
</script>

<style lang="less" scoped>
  .del {
    &-wrapper {
      padding: 0 40px 25px;
    }
    &-title {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      line-height: 14px;
    }
    &-tip {
      font-family:
        Microsoft YaHei,
        Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #999999;
      line-height: 14px;
      margin-top: 24px;
    }
    &-btns {
      margin-top: 30px;
      display: flex;
      padding: 20px 0 0;
      justify-content: flex-end;
    }
  }
</style>
