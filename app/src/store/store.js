import { createStore } from 'vuex'

const store = createStore ({
    state () {
        if (localStorage.getItem('rememberMe'))
        {
            return { isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) }
        } else {
            return { isAuthenticated: JSON.parse(sessionStorage.getItem('isAuthenticated')) }
        }
    },
    user () {
        return {
            email: null,
            nickname: null
        }
    },
    mutations: {
        rememberLogin (state, token) {
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('rememberMe', 'true')
            localStorage.setItem('token', `${token}`)
            state.isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'))
        },
        notRememberLogin (state, token) {
            sessionStorage.setItem('isAuthenticated', 'true')
            sessionStorage.setItem('token', `${token}`)
            state.isAuthenticated = JSON.parse(sessionStorage.getItem('isAuthenticated'))
        },
        logout (state) {
            if (localStorage.getItem('rememberMe')) {
                localStorage.removeItem('isAuthenticated')
                localStorage.removeItem('rememberMe')
                localStorage.removeItem('token')
                state.isAuthenticated = false
            } else {
                sessionStorage.removeItem('isAuthenticated')
                sessionStorage.removeItem('token')
                state.isAuthenticated = false
            }
        },
        fillAccountDetails (user, serverResponse) {
            user.email = serverResponse.email
            user.nickname = serverResponse.nickname
        }
    }
})

export default store