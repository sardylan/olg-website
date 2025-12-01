<script setup lang="ts">
import { watch } from 'vue';
import { Gametype } from '../models';
import type { CodMap } from '../models';

const props = defineProps<{
  isOpen: boolean;
  map?: CodMap | null;
}>();

const emit = defineEmits<{
  close: [];
  selectGametype: [gametypeTag: Gametype];
}>();

const gametypes = [
  { name: 'Team Deathmatch', icon: '⚔️', tag: Gametype.TeamDeathmatch },
  { name: 'Domination', icon: '🎯', tag: Gametype.Domination },
  { name: 'Free-for-All', icon: '💀', tag: Gametype.FreeForAll },
  { name: 'Search and Destroy', icon: '💣', tag: Gametype.SearchAndDestroy },
  { name: 'Headquarters', icon: '🏢', tag: Gametype.Headquarters },
  { name: 'Sabotage', icon: '🔥', tag: Gametype.Sabotage },
];

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close');
  }
};

const handleGametypeClick = (gametypeTag: Gametype) => {
  emit('selectGametype', gametypeTag);
  emit('close');
};

// Close modal on Escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        emit('close');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }
});
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-container">
        <button class="close-button" @click="emit('close')" aria-label="Close modal">
          <span>×</span>
        </button>
        
        <div class="modal-header">
          <h2>Select Gametype</h2>
          <div v-if="map" class="selected-map-info">
            <h3>{{ map.name }}</h3>
            <span class="map-tag">{{ map.tag.toLowerCase() }}</span>
          </div>
          <p v-else>Choose your preferred Call of Duty 4 game mode</p>
        </div>

        <div class="gametype-grid">
          <button
            v-for="gametype in gametypes"
            :key="gametype.name"
            class="gametype-button"
            @click="handleGametypeClick(gametype.tag)"
          >
            <span class="gametype-icon">{{ gametype.icon }}</span>
            <span class="gametype-name">{{ gametype.name }}</span>
            <span class="gametype-tag">{{ gametype.tag.toLowerCase() }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  position: relative;
  background: linear-gradient(135deg, #1e1e1e 0%, #141414 100%);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(0, 255, 136, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(45deg, #00ff88, #00ccff);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0.3;
    pointer-events: none;
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: scale(1.1);
  }

  span {
    display: block;
    margin-top: -4px;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(45deg, #00ff88, #00ccff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .selected-map-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;

    h3 {
      margin: 0;
      color: #fff;
      font-size: 1.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .map-tag {
      color: #888;
      font-size: 1rem;
      font-family: monospace;
      letter-spacing: 0.5px;
    }
  }

  p {
    margin: 0;
    color: #888;
    font-size: 0.9rem;
  }
}

.gametype-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.gametype-button {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #00ff88, #00ccff);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    border-color: rgba(0, 255, 136, 0.5);
    box-shadow: 
      0 10px 30px rgba(0, 255, 136, 0.2),
      0 0 20px rgba(0, 204, 255, 0.1);

    &::before {
      opacity: 0.1;
    }

    .gametype-icon {
      transform: scale(1.2);
    }
    
    .gametype-tag {
      color: rgba(0, 255, 136, 0.8);
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
}

.gametype-icon {
  font-size: 2rem;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.gametype-name {
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.gametype-tag {
  font-size: 0.75rem;
  color: #888;
  font-family: monospace;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}
// Modal transition animations
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

// Scrollbar styling
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 4px;

  &:hover {
    background: rgba(0, 255, 136, 0.5);
  }
}
</style>
