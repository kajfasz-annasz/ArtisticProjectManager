import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import moshaToast from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import store from './store/store.js'

const app = createApp(App)

app.use(router)
    .use(moshaToast)
    .use(store)
    .mount('#app')

