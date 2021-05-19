<template>
    <div id="nav">
        <div class="navbox">
          <template v-if="$store.state.isAuthenticated">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link> |
            <router-link to="/account">Account</router-link> |
            <router-link to="/dashboard">Dashboard</router-link> |
            <form action="/action_page.php">
              <select class="language">
                <option value="EN">EN</option>
                <option value="PL">PL</option>
              </select>
            </form> | 
            <button v-on:click="logout()" class="logOut">
              <i class="fa fa-sign-out"></i>
            </button>
          </template>
          <template v-else>
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link> |
            <router-link to="/login">Login</router-link> |
            <form action="/action_page.php">
                <select class="language">
                <option value="EN">EN</option>
                <option value="PL">PL</option>
                </select>
            </form>
          </template>
        </div>
  </div>
</template>

<style>
  @import '../assets/styles/headerStyle.css';
</style>

<script>
  import router from '../router'

  export default {
    methods: {
      async logout() {
        this.$moshaToast({
          title:'Sucesfully logged out!', 
          description: 'Come back again, anytime!'
        },
        {
          timeout: 3000, type: 'success', showCloseButton: true, showIcon: true,
          transition: 'zoom', position: 'bottom-center'
        });

        this.$store.commit('logout')
        
        router.push('/login')
      }
    }
  }
</script>


