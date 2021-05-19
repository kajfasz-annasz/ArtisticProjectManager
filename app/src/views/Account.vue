<template>
  <div class="container">
  ... comming soon ...
  </div>
</template>

<style scoped>
  @import '../assets/styles/accountStyle.css';
</style>

<script>
  import { environment } from '../../config.js';

  export default {
    mounted() {
      var token = null;

      if (localStorage.getItem('rememberMe')) {
        token = localStorage.getItem('token');
      } else {
        token = sessionStorage.getItem('token');
      }

      const requestOptions = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: token })
      };
      fetch(`${environment.API}/api/user/account`, requestOptions)
        .then(async response => {
          const result = await response.json();

          if (!response.ok) {
            const error = (result && result.message) || response.status
            return Promise.reject(error)
          } else {
            this.$store.commit('fillAccountDetails', result)
          }
        })
        .catch(error => {
          console.log(error)
          this.errorMessage = error;

          this.$moshaToast({
            title:'Ups! Something went wrong!', 
            description: `${error}`
          },
          {
            timeout: 5000, type: 'danger', showCloseButton: true, showIcon: true,
            transition: 'zoom', position: 'bottom-center'
          });
        });
    },
    methods: {

    }
  }
</script>
