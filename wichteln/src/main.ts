import './style.css'

import App from './App.vue'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(PrimeVue)

// Auth-Store beim Start initialisieren
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
