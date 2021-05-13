<template>
  <div class="form">
    <form class="sign-up" action="#">
      <div class="formBackground">
        
        <h2 class="form">LOG IN</h2>

        <div class="formIcon">
          <i class="fa fa-user-circle" aria-hidden="true"></i>
        </div>

        <div id="email">
          <div id="emailBox" class="wrapper">
            <input v-model="v$.userForm.email.$model" placeholder="Email" type="email"
              :class="{ error: v$.userForm.email.$error }" id="inputEmail"
              @blur="v$.userForm.email.$touch"
              @keyup.enter="!v$.userForm.$invalid ? login() : touchInputs()">
            <label for="wrapper" class="fa fa-envelope-o inputIcon"/>
          </div>
          <div class="error-msg" v-for="error of v$.userForm.email.$errors" 
            :key="error.$uid">
            {{ error.$message }}
          </div>
        </div>
        
        <div id="password">
          <div id="passwordBox" class="wrapper">
            <input v-model="v$.userForm.password.$model" placeholder="Password" 
              type="password" :class="{ error: v$.userForm.password.$error}" 
              @blur="v$.userForm.password.$touch" id="inputPassword"
              @keyup.enter="!v$.userForm.$invalid ? login() : touchInputs()">
            <label for="wrapper" class="fa fa-lock inputIcon"/>
          </div>
          <div class="error-msg" v-for="error of v$.userForm.password.$errors" 
            :key="error.$uid">
            {{ error.$message }}
          </div>
        </div>
        
        <button type="button"
          v-on:click="!v$.userForm.$invalid ? login() : touchInputs()">
          Log In
          <i class="fa fa-sign-in signInIcon" aria-hidden="true"></i>
        </button>

        <p class="credentialsLink">
          Don't have an account? 
          <router-link to="/register">Register!</router-link>
        </p>

        <p class="credentialsLink">
          Forgot your password? 
          <router-link to="/forgotPassword">Reset it!</router-link>
        </p>

      </div>
    </form>
  </div>
</template>

<style scoped>
  @import '../assets/styles/credentialsStyle.css';
</style>

<script lang="ts">
  import { environment } from '../../config.js';
  import useVuelidate from '@vuelidate/core'
  import { required, email, helpers } from '@vuelidate/validators'
  import router from '../router';
  
  export default {
    setup () {
      return { v$: useVuelidate() }
    },

    data () {
      return {
        userForm:{
          email: '',
          password: '',
        }
      }
    },

    validations () {
      return {
        userForm:{
          email: { 
            required: helpers.withMessage('This field cannot be empty!', required), 
            email: helpers.withMessage('Please enter valid email address!', email),
          },
          password: { 
            required: helpers.withMessage('This field cannot be empty!', required),
          }
        }
      }
    },

    methods: {
      async login() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.v$.userForm.email.$model,
            password: btoa(this.v$.userForm.password.$model)
          })
        };
        fetch(`${environment.API}/api/auth/login`, requestOptions)
          .then(async response => {
            const result = await response.json();

            if (!response.ok) {
              const error = (result && result.message) || response.status
              return Promise.reject(error)
            } else {
              if(result)
              {
                this.$moshaToast('Succesfully logged in!', {
                  timeout: 3000, type: 'success', showCloseButton: true, showIcon: true,
                  transition: 'zoom', position: 'bottom-center'
                })

                this.$cookie.setCookie('isAuthenticated', true)
                this.$store.commit('authenticate')

                router.push('/dashboard')
              } else {
                this.shaker("emailBox");
                this.redField("inputEmail");
                this.shaker("passwordBox");
                this.redField("inputPassword");
                this.$moshaToast('Invalid email address or password!', {
                  timeout: 3000, type: 'danger', showCloseButton: true, showIcon: true,
                  transition: 'zoom', position: 'bottom-center'
                })
              }
            }
          })
          .catch(error => {
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

      async touchInputs() {
        this.v$.userForm.email.$dirty = true;
        this.v$.userForm.password.$dirty = true;

        if (this.v$.userForm.email.$invalid){
          this.shaker("emailBox");
        }
          
        if (this.v$.userForm.password.$invalid){
          this.shaker("passwordBox");
        }
      },

      async shaker(field) {
        document.getElementById(field).classList.remove("shake");
        setTimeout(() => document.getElementById(field)
          .classList.add("shake"), 0);
      },

      async clearForm() {
        this.v$.userForm.email.$model = null;
        this.v$.userForm.email.$dirty = false;

        this.v$.userForm.password.$model = null;
        this.v$.userForm.password.$dirty = false;
      },

      async redField(field) {
        setTimeout(() => document.getElementById(field)
          .classList.add("error"), 0);
      }
    },
  }
</script>