<template>
  <el-popover popper-class="btn-popover" placement="bottom" key="tableCopy">
    <template #reference>
      <el-button class="tableBtn" @click="handleCopyAll">一键复制</el-button>
    </template>
    <div class="popover-wrapper">
      <div class="copy-item" v-for="item in copyLines" :key="item.key" @click="handleCopyItem(`${item.label}${props.lineRow[item.key]?.val}`)">
        <div class="copy-label">{{ item.label }}</div>
        <div class="copy-value">
          <template v-if="item.key != 'website'"> {{ props.lineRow[item.key]?.val }}</template>
          <el-link v-else type="primary" :href="props.lineRow[item.key]?.val">
            {{ props.lineRow[item.key]?.val }}
          </el-link>
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
  import ClipboardJS from 'clipboard';
  import { fileType } from '@/utils/util';
  const { $getAssetsImages, $message } = getCurrentInstance().appContext.config.globalProperties;
  //   const emits = defineEmits(['addBtnClick']);
  const clipboard = ref(null);
  const props = defineProps({
    lineRow: {
      type: Object,
      default: () => ({
        name: '',
        website: '',
        username: '',
        password: '',
        remark: '',
      }),
    },
  });
  const copyLines = ref([
    {
      label: '平台名称：',
      key: 'name',
    },
    {
      label: '网址：',
      key: 'website',
    },
    {
      label: '用户名：',
      key: 'username',
    },
    {
      label: '密码：',
      key: 'password',
    },
  ]);
  const handleCopyAll = () => {
    let text = '';
    copyLines.value.forEach((e) => {
      text += `${e.label}${props.lineRow[e.key]?.val}\n`;
    });
    handleCopyItem(text);
  };
  const handleCopyItem = (text) => {
    // 销毁旧实例
    if (clipboard.value) {
      clipboard.value.destroy();
    }

    // 创建临时触发元素
    const fakeTrigger = document.createElement('button');
    document.body.appendChild(fakeTrigger);

    // 初始化新实例
    clipboard.value = new ClipboardJS(fakeTrigger, {
      text: () => {
        return text;
      },
    });

    clipboard.value.on('success', () => {
      $message.success('复制成功');
      fakeTrigger.remove();
    });

    clipboard.value.on('error', () => {
      $message.error('复制失败');
      fakeTrigger.remove();
    });

    // 触发复制
    fakeTrigger.click();
  };
</script>
<style lang="less" scoped>
  .popover {
    &-wrapper {
      background: #ffffff;
      box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
      border-radius: 12px 12px 12px 12px;
      padding: 10px;
    }
  }
  .copy-item {
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 6px 0;
    transition:
      color 0.3s,
      background 0.3s;
    &:hover {
      color: #0066ff;
      background: #f4f9ff;
    }
  }
</style>
