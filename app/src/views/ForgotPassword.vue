<template>
  <div class="form">
    <form class="sign-up" action="#">
      <div class="formBackground">
        
        <h2 class="form">FORGOT PASSWORD?</h2>

        <div class="formIcon">
          <i class="fa fa-address-card" aria-hidden="true"></i>
        </div>

        <p class="passwordResetMessage">
          Please provide an email address connected with your previously 
          registered account. A link to password resert will be send to 
          you if given address was previously used within an account.
        </p>

        <div id="email">
          <div id="emailBox" class="wrapper">
            <input v-model="v$.userForm.email.$model" placeholder="Your Email Address" 
            type="email" :class="{ error: v$.userForm.email.$error }" id="inputEmail"
              @blur="v$.userForm.email.$touch">
            <label for="wrapper" class="fa fa-envelope-o inputIcon"/>
          </div>
          <div class="error-msg" v-for="error of v$.userForm.email.$errors" 
            :key="error.$uid">
            {{ error.$message }}
          </div>
        </div>
        
        <button type="button"
          v-on:click="!v$.userForm.$invalid ? resetPassword() : touchInputs()">
          Reset Password
          <i class="fa fa-address-card signInIcon" aria-hidden="true"></i>
        </button>

        <p class="credentialsLinkSingleLine">
          Already done? 
          <router-link to="/login">Log in!</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
  @import '../assets/styles/credentialsStyle.css';
</style>

<script>
  import useVuelidate from '@vuelidate/core'
  import { required, email, helpers } from '@vuelidate/validators'
  import { environment } from '../../config.js'
  
  export default {
    setup () {
      return { v$: useVuelidate() }
    },

    data () {
      return {
        userForm:{
          email: ''
        }
      }
    },

    validations () {
      return {
        userForm:{
          email: { 
            required: helpers.withMessage('This field cannot be empty!', required), 
            email: helpers.withMessage('Please enter valid email address!', email),
          }
        }
      }
    },

    methods: {
      async resetPassword() {

        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.v$.userForm.email.$model
          })
        };

        fetch(`${environment.API}/api/auth/forgotPassword`, requestOptions)
          .then(async response => {
            const result = await response.json();

            if (!response.ok) {
              const error = (result && result.message) || response.status
              return Promise.reject(error)
            } else {
              if(result)
              {
                this.$moshaToast({
                  title: `Email was sent to ${this.v$.userForm.email.$model}!`,
                  description: 'Please check your mailbox. Be sure to check in spam also.'
                  },
                  {
                  timeout: 5000, type: 'success', showCloseButton: true, showIcon: true,
                  transition: 'zoom', position: 'bottom-center'
                })
                this.clearForm()
              } else {
                this.shaker("emailBox");
                this.redField("inputEmail");
                this.$moshaToast('Provided email address not exist in our database!', {
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

        if (this.v$.userForm.email.$invalid){
          this.shaker("emailBox");
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
      },

      async redField(field) {
        setTimeout(() => document.getElementById(field)
          .classList.add("error"), 0);
      }
    }
  }
</script>