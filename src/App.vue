<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Slideshow from './components/Slideshow.vue';
import GametypeModal from './components/GametypeModal.vue';
import { api } from './services/api';
import type { CodMap } from './models/map';
import { Gametype } from './models/gametype';

const maps = ref<CodMap[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const isModalOpen = ref(false);
const selectedGametype = ref<Gametype | null>(null);

const selectedMap = ref<CodMap | null>(null);

const fetchMaps = async () => {
  try {
    maps.value = await api.fetchMaps();
  } catch (e: any) {
    console.error('Failed to fetch maps:', e);
    error.value = 'Failed to load maps. Please try again later.';
  } finally {
    loading.value = false;
  }
};


const openModal = () => {
  isModalOpen.value = true;
};

const handleMapClick = (map: CodMap) => {
  selectedMap.value = map;
  openModal();
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedMap.value = null;
};

const isActionLoading = ref(false);

const handleMapRestart = async () => {
  if (isActionLoading.value) return;
  isActionLoading.value = true;
  try {
    await api.mapRestart();
  } catch (e) {
    alert('Failed to restart map. Please try again.');
  } finally {
    isActionLoading.value = false;
  }
};

const handleFastRestart = async () => {
  if (isActionLoading.value) return;
  isActionLoading.value = true;
  try {
    await api.fastRestart();
  } catch (e) {
    alert('Failed to fast restart. Please try again.');
  } finally {
    isActionLoading.value = false;
  }
};

const handleGametypeSelect = async (gametypeTag: Gametype) => {
  selectedGametype.value = gametypeTag;
  if (selectedMap.value) {
    isActionLoading.value = true;
    try {
      await api.setGametypeMap(gametypeTag, selectedMap.value.tag);
      // Close modal on success (it's already closed by the emit, but good to be sure if we change logic)
      // Actually, the modal emits 'selectGametype' which calls this, AND emits 'close'.
      // But let's add a success feedback or just let it happen.
      // For now, silent success as per "modal have to close itself when the action of the click is completed"
      // The modal closes immediately on click in the current implementation.
      // If we want to wait for API, we might need to change the modal logic, but the requirement was "close itself when the action... is completed".
      // Given the current modal implementation closes on click, the API call happens in background.
      // If we want to block closing until API returns, we'd need to change GametypeModal to emit an event that App handles, then App closes modal.
      // But the user said "The modal have to close itself when the action of the click is completed (now when the alert is closed)".
      // Since we are removing the alert, the "action" is the click + API call.
      // The current GametypeModal implementation emits 'selectGametype' then 'close' immediately.
      // This is fine for a non-blocking UI.
    } catch (e) {
      alert('Failed to set gametype and map. Please try again.');
    } finally {
      isActionLoading.value = false;
    }
  }
};

onMounted(() => {
  fetchMaps();
});
</script>

<template>
  <div class="app-container">
    <header>
      <h1>COD4 LANPARTY</h1>
      <p>Explore the legendary battlegrounds</p>
      <div class="header-actions">
        <button class="btn-restart" @click="handleMapRestart" :disabled="isActionLoading">Map Restart</button>
        <button class="btn-restart" @click="handleFastRestart" :disabled="isActionLoading">Fast Restart</button>
      </div>
    </header>

    <div v-if="isActionLoading" class="action-loading-overlay">
      <div class="spinner"></div>
    </div>

    <main>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading maps...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchMaps">Retry</button>
      </div>

      <Slideshow v-else :maps="maps" @mapClick="handleMapClick" />
    </main>

    <footer>
      <p>&copy; 2025 CoD4 Map Showcase. Design by Antigravity.</p>
    </footer>

    <GametypeModal 
      :isOpen="isModalOpen" 
      :map="selectedMap"
      @close="closeModal" 
      @selectGametype="handleGametypeSelect" 
    />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

header {
  padding: 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  h1 {
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(45deg, #00ff88, #00ccff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  p {
    margin-top: 0.5rem;
    color: #888;
    font-size: 1rem;
  }

  .header-actions {
    position: absolute;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 1rem;

    .btn-restart {
      padding: 0.5rem 1rem;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      color: #00ff88;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;

      &:hover {
        background: rgba(0, 255, 136, 0.2);
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
      }
    }
  }
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  overflow: hidden;
  min-height: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #00ff88;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.error {
  text-align: center;
  color: #ff4444;

  button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: #333;
    color: #fff;
    border: 1px solid #444;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #444;
      border-color: #555;
    }
  }
}

footer {
  padding: 1rem;
  text-align: center;
  color: #555;
  font-size: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.action-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Above modal */

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(0, 255, 136, 0.1);
    border-top-color: #00ff88;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}
</style>
