import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { loadConfig } from './services/config'

// Load configuration before mounting the app
loadConfig().then(() => {
    createApp(App).mount('#app')
}).catch(error => {
    console.error('Failed to initialize application:', error)
})
