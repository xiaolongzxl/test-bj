<template>
  <el-dropdown popper-class="changeFileShowPopper" placement="bottom" @command="handleChangeFileShowType">
    <div class="btn">
      <svgIcon :name="activeTypeItem.value" />
      <img class="btn-icon ml-2" :src="$getAssetsImages('file/fileshow/arrow-down.png')" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in fileShowList" :key="item.value" :command="item.value"
          ><div class="dropItem" :class="activeType == item.value ? 'active' : ''">
            <svgIcon class="mr-2" :name="item.value" />
            {{ item.name }}
          </div></el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
  import svgIcon from './svgIcon.vue';
  const props = defineProps({
    fileShowType: {
      type: String,
      default: 'xlb',
    },
  });
  const emits = defineEmits(['update:fileShowType']);
  const { $getAssetsImages } = getCurrentInstance().appContext.config.globalProperties;
  const fileShowList = ref([
    {
      name: '大列表',
      value: 'dlb',
    },
    {
      name: '小列表',
      value: 'xlb',
    },
    {
      name: '宫格试图',
      value: 'ggst',
    },
  ]);
  const activeType = ref('');
  const activeTypeItem = computed(() => {
    return activeType.value ? fileShowList.value.find((e) => e.value == activeType.value) : fileShowList.value[0];
  });
  watch(
    () => props.fileShowType,
    (val) => {
      activeType.value = val;
    },
    {
      immediate: true,
    }
  );
  const handleChangeFileShowType = (item) => {
    activeType.value = item;
    emits('update:fileShowType', item);
  };
</script>
<style lang="less" scoped>
  .btn {
    margin-left: 10px;
    height: 32px;
    background: #f5f5f5;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .dropItem {
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 4px 4px 4px 4px;
    padding: 10px 20px;
    transition:
      background-color 0.3s,
      color 0.3s;
    &:hover {
      background-color: #f4f9ff;
    }
    &.active {
      background-color: #f4f9ff;
      color: #0066ff;
    }
  }
</style>
