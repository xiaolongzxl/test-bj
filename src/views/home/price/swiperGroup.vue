<!-- SwiperDemo.vue -->
<template>
  <div class="swiper-container">
    <swiper
      :modules="[Navigation, EffectFade]"
      :loop="false"
      :navigation="true"
      :effect="'fade'"
      :initialSlide="initialSlide"
      :fade-effect="{ crossFade: true }"
      :speed="600"
      :grab-cursor="true"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(item, index) in slides" :key="index">
        <img :src="item.src" alt="" class="slide-image" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Navigation, EffectFade } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/effect-fade';

  // 数据源
  const props = defineProps({
    slides: {
      type: Array as PropType<{ src: string }[]>,
      default: () => [],
    },
    initialSlide: {
      type: Number,
      default: 0,
    },
  });

  // Swiper 实例回调
  const onSwiper = (swiper: any) => {
    console.log('Swiper 初始化完成', swiper, props.slides);
  };
</script>

<style scoped>
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper {
    height: 100%;
    width: 100%;
  }

  .slide-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-image {
    padding: 60px;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }

  /* 自定义导航箭头样式（可选） */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    color: #333;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 99999999;
    font-weight: bold;
  }

  :deep(.swiper-pagination-bullet-active) {
    background: #fff;
  }
  :deep(.swiper-button-prev svg),
  :deep(.swiper-button-next svg) {
    width: 70%;
    height: 70%;
  }
</style>
