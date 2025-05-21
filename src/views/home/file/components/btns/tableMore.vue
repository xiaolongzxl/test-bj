<template>
  <el-dropdown popper-class="changeFileShowPopper" type="primary" @command="handleCommand">
    <template v-if="props.tableMoreType === 'table'">
      <el-button class="ml-4" plain><svg-icon name="more" class="mr-4"></svg-icon> 更多 </el-button>
    </template>
    <template v-else>
      <div class="tableBtn">
        <el-icon><ArrowDown /></el-icon>
      </div>
    </template>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="move" v-if="hasPremission(7)">
          <div class="dropItem">移动</div>
        </el-dropdown-item>
        <el-dropdown-item command="copy"> <div class="dropItem" v-if="hasPremission(8)">复制</div></el-dropdown-item>
        <el-dropdown-item command="del" v-if="hasPremission(1)"><div class="dropItem">删除</div></el-dropdown-item>
        <el-dropdown-item command="update" v-if="props.isExpireTime && hasPremission(4)"><div class="dropItem">修改</div></el-dropdown-item>
        <el-dropdown-item command="rename" v-if="!props.isExpireTime && hasPremission(6)"><div class="dropItem">重命名</div></el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
  const props = defineProps({
    tableMoreType: {
      type: String,
      default: 'table',
    },
    isExpireTime: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['tableCommand']);
  const hasPremission = fileMenuStore().hasPremission;
  const handleCommand = (command) => {
    emits('tableCommand', command);
  };
</script>
<style lang="less" scoped>
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
