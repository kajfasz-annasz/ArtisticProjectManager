import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import moshaToast from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import { VueCookieNext } from 'vue-cookie-next'
import store from './store/store.js'
import MagicVueInput from 'magic-vue-input';

const app = createApp(App)

app.use(router)
    .use(moshaToast)
    .use(VueCookieNext)
    .use(store)
    .use(MagicVueInput)
    .mount('#app')

