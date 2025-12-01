<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {config} from '../services/config';
import type {CodMap} from '../models/map';
import placeholderImg from '../assets/placeholder.svg';

const props = defineProps<{
  map: CodMap;
  isActive?: boolean;
}>();

const imageSrc = ref<string>('');
const isLoaded = ref(false);

const getImageUrl = (mapTag: string) => {
  return `${config.IMAGES_PREFIX}/${mapTag}.jpg`;
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  // Prevent infinite loop if placeholder also fails
  if (img.src !== placeholderImg) {
    img.src = placeholderImg;
  }
  isLoaded.value = true; // Consider it loaded so we show the image (placeholder)
};

onMounted(() => {
  // Load image immediately when component mounts
  // Since coverflow shows multiple slides at once, we can't unload images
  // without causing visible placeholders on side slides
  imageSrc.value = getImageUrl(props.map.tag);
  isLoaded.value = true;
});
</script>

<template>
  <div class="map-slide" :class="{ 'is-active': isActive, 'is-inactive': !map.active }">
    <div class="image-container">
      <img 
        v-if="imageSrc" 
        :src="imageSrc" 
        :alt="map.name"
        loading="eager"
        @error="handleImageError"
      />
      <div v-else class="placeholder"></div>
    </div>
    <div class="map-info">
      <h3>{{ map.name }}</h3>
      <span class="map-tag">{{ map.tag.toLowerCase() }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-slide {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  cursor: default;
  transition: transform 0.2s ease;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  &.is-inactive {
    opacity: 0.5;

    .map-info {
      background: rgba(0, 0, 0, 0.9);

      h3 {
        color: #666;
      }
      
      .map-tag {
        color: #444;
      }
    }
  }

  &.is-active {
    cursor: pointer;
    opacity: 1;

    &:hover {
      transform: scale(1.02);

      .map-info {
        background: rgba(0, 255, 136, 0.2);

        h3 {
          color: #00ff88;
        }
        
        .map-tag {
          color: rgba(0, 255, 136, 0.8);
        }
      }
    }
  }

  .image-container {
    flex: 1;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: '';
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 255, 136, 0.1);
        border-top-color: rgba(0, 255, 136, 0.5);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .map-info {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h3 {
      margin: 0;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .map-tag {
      color: #888;
      font-size: 0.8rem;
      font-family: monospace;
      letter-spacing: 0.5px;
    }
  }
}
</style>
