import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'

// Import icon libraries, css, etc. (généré par Quasar)

const app = createApp(App)

// Quasar boot wrapper gère automatiquement l'exécution des boot files
// puis .use(Quasar) et .mount('#app')

app.use(Quasar, {
  plugins: {} // ou tes plugins
})

app.mount('#app')