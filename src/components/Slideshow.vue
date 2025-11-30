<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Scrollbar, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import MapSlide from './MapSlide.vue';
import type { CodMap } from '../models/map';

defineProps<{
  maps: CodMap[];
}>();

const emit = defineEmits<{
  mapClick: [map: CodMap];
}>();

const modules = [EffectCoverflow, Scrollbar, Navigation];
const activeIndex = ref(0);

const onSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.activeIndex;
};

const handleSlideClick = (map: CodMap, index: number) => {
  // Only emit click event if the slide is the active (centered) one
  if (index === activeIndex.value) {
    emit('mapClick', map);
  }
};
</script>

<template>
  <div class="slideshow-container">
    <swiper
      :effect="'coverflow'"
      :grabCursor="true"
      :centeredSlides="true"
      :slidesPerView="'auto'"
      :coverflowEffect="{
        rotate: 30,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }"
      :scrollbar="{ draggable: true }"
      :navigation="true"
      :modules="modules"
      class="mySwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(map, index) in maps" :key="map.tag">
        <MapSlide
          :map="map"
          :isActive="index === activeIndex"
          @click="handleSlideClick(map, index)"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped lang="scss">
.slideshow-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Remove padding to maximize space, main container has padding */
}

.swiper {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  padding-bottom: 30px; /* Space for scrollbar */
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  height: 100%; /* Fill the swiper height */
  width: auto;
  aspect-ratio: 16/9; /* Maintain aspect ratio */
  
  /* Reflection effect */
  -webkit-box-reflect: below 1px linear-gradient(transparent, transparent #0006);
}

/* Customizing Navigation Buttons */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: #00ff88;
}

/* Customizing Scrollbar */
:deep(.swiper-scrollbar) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.swiper-scrollbar-drag) {
  background: #00ff88;
}
</style>
