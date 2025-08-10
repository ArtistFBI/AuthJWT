import { createApp } from 'vue'
import App from '@/App.vue'

// Import Pinia and the persisted state plugin
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import the router
import router from '@/router'

import VueCookies from 'vue-cookies'

// Import global styles
import '@/assets/global.css'

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Install plugins
app.use(pinia)
app.use(router)
app.use(VueCookies)

// Mount the app
app.mount('#app')
