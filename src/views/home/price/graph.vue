<template>
  <div>
    <div style="border: #efefef solid 1px; height: calc(100vh - 100px); width: 100%">
      <relation-graph ref="graphRef" :options="options">
        <template #node="{ node }">
          <div class="node-box" :style="{ border: '1px solid' + node.data.color }">
            <div>
              <div style="height: 40px; line-height: 40px" class="font-bold text-center">{{ node.data.name }}</div>
              <div class="py-4 px-4 pb-14 info-box">
                <div v-for="(item, index) in node.data.list" :key="index" class="flex justify-between items-center px-4 py-2 info-item">
                  <div>{{ item.label }}</div>
                  <div>{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </relation-graph>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import RelationGraph from 'relation-graph-vue3';
  const graphRef = ref<any>();
  const options = ref<any>({
    disableDragNode: true,
    defaultFocusRootNode: false,
    disableNodeClickEffect: true,
    disableLineClickEffect: true,
    defaultNodeBorderWidth: 0,
    defaultLineShape: 6,
    defaultNodeShape: 1,
    defaultShowLineLabel: false,
    defaultJunctionPoint: 'lr',
    defaultLineMarker: {
      markerWidth: 20,
      markerHeight: 20,
      refX: 3,
      refY: 3,
      data: 'M 0 0, V 6, L 4 3, Z',
    },
    layouts: [
      {
        label: '中心',
        layoutName: 'tree',
        centerOffset_x: 0,
        centerOffset_y: 0,
        distance_coefficient: 1,
        layoutDirection: 'h',
        from: 'left',
        levelDistance: '',
        min_per_width: '10',
        max_per_width: '1000',
        min_per_height: '10',
        max_per_height: '1000',
      },
    ],
  });

  onMounted(() => {
    initGraph();
  });

  async function initGraph() {
    const jsonData = {
      rootId: 'a',
      nodes: [
        {
          id: 'a',
          text: 'a',
          color: '#ff8c00',
          data: {
            name: 'a',
            color: '#ff8c00',
            list: [
              { label: '等芯数', value: '1' },
              { label: '等芯数', value: '1' },
              { label: '补偿率', value: '100%' },
              { label: '外径偏差', value: '' },
              { label: '外径偏差', value: '' },
              { label: '计算外径', value: '12.63' },
              { label: '计算外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
            ],
          },
        },
        {
          id: 'b',
          text: 'b',
          color: '#3f9eff',
          data: {
            name: 'b',
            color: '#3f9eff',
            list: [
              { label: '等芯数', value: '3' },
              { label: '等芯数', value: '1' },
              { label: '外径偏差', value: '' },
              { label: '计算外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
            ],
          },
        },
        {
          id: 'c',
          text: 'c',
          color: '#3f9eff',
          data: {
            name: 'c',
            color: '#3f9eff',
            list: [
              { label: '等芯数', value: '3' },
              { label: '等芯数', value: '1' },
              { label: '补偿率', value: '100%' },
              { label: '外径偏差', value: '' },
              { label: '外径偏差', value: '' },
              { label: '外径偏差', value: '' },
              { label: '计算外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
            ],
          },
        },
        {
          id: 'd',
          text: 'd',
          color: '#3f9eff',
          data: {
            name: 'd',
            color: '#3f9eff',
            list: [
              { label: '等芯数', value: '3' },
              { label: '等芯数', value: '1' },
              { label: '计算外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
            ],
          },
        },
        {
          id: 'e',
          text: 'e',
          color: '#3f9eff',
          data: {
            name: 'e',
            color: '#3f9eff',
            list: [
              { label: '等芯数', value: '3' },
              { label: '等芯数', value: '1' },
              { label: '补偿率', value: '100%' },
              { label: '外径偏差', value: '' },
              { label: '实际外径', value: '12.63' },
            ],
          },
        },
        {
          id: 'f',
          text: 'f',
          color: '#3f9eff',
          data: {
            name: 'f',
            color: '#3f9eff',
            list: [
              { label: '等芯数', value: '3' },
              { label: '等芯数', value: '1' },
              { label: '补偿率', value: '100%' },
              { label: '外径偏差', value: '' },
              { label: '计算外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
              { label: '实际外径', value: '12.63' },
            ],
          },
        },
      ],
      lines: [
        { from: 'b', to: 'a' },
        { from: 'c', to: 'a' },
        { from: 'd', to: 'a' },
        { from: 'a', to: 'e' },
        { from: 'e', to: 'f' },
      ],
    };
    graphRef.value.setJsonData(jsonData);
    const graphInstance = graphRef.value.getInstance();
    await graphInstance.doLayout(); // Layout using the layouter set in graphOptions
    await graphInstance.moveToCenter(); // Find the center based on node distribution and center the view
    await graphInstance.zoomToFit(); // Zoom to fit, so that all nodes can be displayed in the visible area
  }
</script>

<style lang="less" scoped>
  :deep(.node-box) {
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    & > {
      width: 200px;
    }
    .info-box {
      background-color: #ffffff;
      color: #555555;
    }
    .info-item {
      border-bottom: #efefef solid 1px;
    }
  }
</style>
