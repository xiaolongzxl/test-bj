<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
  const props = defineProps({
    name: { type: String, required: true },
    color: { type: String, default: 'currentColor' },
  });

  const symbolId = computed(() => `#icon-${props.name}`);
</script>
<style lang="less" scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    position: relative;
    fill: currentColor;
    vertical-align: -2px;
  }
</style>
