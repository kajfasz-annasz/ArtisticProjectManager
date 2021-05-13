import { createStore } from 'vuex'
import { VueCookieNext } from 'vue-cookie-next'

const store = createStore ({
    state () {
        return {
            isAuthenticated: VueCookieNext.getCookie('isAuthenticated')
        }
    },
    mutations: {
        authenticate (state) {
            state.isAuthenticated = VueCookieNext.getCookie('isAuthenticated')
        }
    }
})

export default store