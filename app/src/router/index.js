import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store.js'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'
import Dashboard from '../views/Dashboard.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import PageNotFound from '../views/PageNotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      guestOnly: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      guestOnly: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/forgotPassword',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {
      guestOnly: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

// Przekierowanie z podstron z powodu braku uprawnień (logowanie)

router.beforeEach((to, from, next) => {
  const loggedIn = store.state.isAuthenticated

  if (to.matched.some(record => record.meta.authRequired && !loggedIn)) {
    next({ path: '/login' });
  } else if (to.matched.some(record => record.meta.guestOnly && loggedIn)) {
    next({ path: '/dashboard' });
  } else {
      next();
  }
});
