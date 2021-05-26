<template>
  <div class="register">
    <div class="form">
      <form class="sign-up" action="#">
        <div class="formBackground">
          
          <h2 class="form">REGISTER</h2>

          <div class="formIcon">
            <i class="fa fa-user-plus" aria-hidden="true"></i>
          </div>
          
          <div id="email">
            <div id="emailBox" class="wrapper">
              <input v-model="v$.userForm.email.$model" placeholder="Email" type="text"
                :class="{ error: v$.userForm.email.$error }" id="inputEmail"
                @blur="v$.userForm.email.$touch"
                @keyup.enter="!v$.userForm.$invalid ? register() : touchInputs()">
              <label for="wrapper" class="fa fa-envelope-o inputIcon"/>
            </div>
            <div class="error-msg" v-for="error of v$.userForm.email.$errors" 
              :key="error.$uid">
              {{ error.$message }}
            </div>
          </div>
          
          <div id="confirmEmail">
            <div id="confirmEmailBox" class="wrapper">
              <input v-model="v$.userForm.confirmEmail.$model" placeholder="Confirm Email" 
                type="text" :class="{ error: v$.userForm.confirmEmail.$error }" 
                id="inputConfirmEmail" autocomplete="new-password"
                @blur="v$.userForm.confirmEmail.$touch"
                @keyup.enter="!v$.userForm.$invalid ? register() : touchInputs()">
              <label for="wrapper" class="fa fa-envelope-o inputIcon"/>
            </div>
            <div class="error-msg" v-for="error of v$.userForm.confirmEmail.$errors" 
              :key="error.$uid">
              {{ error.$message }}
            </div>
          </div>

          <div id="password">
            <div id="passwordBox" class="wrapper">
              <input v-model="v$.userForm.password.$model" placeholder="Password" 
                type="password" :class="{ error: v$.userForm.password.$error}" 
                @blur="v$.userForm.password.$touch" id="inputPassword"
                @keyup.enter="!v$.userForm.$invalid ? register() : touchInputs()">
              <label for="wrapper" class="fa fa-lock inputIcon"/>
            </div>
            <div class="error-msg" v-for="error of v$.userForm.password.$errors" 
              :key="error.$uid">
              {{ error.$message }}
            </div>
          </div>

          <div id="confirmPassword">
            <div id="confirmPasswordBox" class="wrapper">
              <input v-model="v$.userForm.confirmPassword.$model" 
                placeholder="Confirm Password" 
                type="password" :class="{ error: v$.userForm.confirmPassword.$error}" 
                @blur="v$.userForm.confirmPassword.$touch" id="inputConfirmPassword"
                @keyup.enter="!v$.userForm.$invalid ? register() : touchInputs()">
              <label for="wrapper" class="fa fa-lock inputIcon"/>
            </div>
            <div class="error-msg" v-for="error of v$.userForm.confirmPassword.$errors" 
              :key="error.$uid">
              {{ error.$message }}
            </div>
            <div class="custom-error-msg"/>
          </div>
          
          <button type="button" 
            v-on:click="!v$.userForm.$invalid ? register() : touchInputs()">
              Register
              <i class="fa fa-user-plus" aria-hidden="true"></i>
          </button>
          
          <p class="credentialsLinkSingleLine">
            Already have an account? 
            <router-link to="/login">Log in!</router-link>
          </p>
          
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
  @import '../assets/styles/credentialsStyle.css';
</style>

<script lang="ts">
  import useVuelidate from '@vuelidate/core'
  import { 
    required, 
    email, 
    helpers, 
    sameAs, 
    minLength,
    requiredUnless,
    maxLength
  } from '@vuelidate/validators'
    import { environment } from '../../config.js'

  export default {
    setup () {
      return { v$: useVuelidate() }
    },

    data () {
      return {
        userForm:{
          email: '',
          confirmEmail: '',
          password: '',
          confirmPassword: ''
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
          confirmEmail: { 
            requiredUnless: helpers.withMessage('This field cannot be empty!', 
              requiredUnless(sameAs(this.userForm.email) && this.userForm.email != '')), 
            sameAs: helpers.withMessage('Email addresses do not match!',
              sameAs(this.userForm.email))
          },
          password: { 
            required: helpers.withMessage('This field cannot be empty!', required),
            minLength: helpers.withMessage(
              'Password must contain at least 6 characters!', minLength(6)),
            maxLength: helpers.withMessage(
              'Maximal characters number for password is 30!', maxLength(30)),
          },
          confirmPassword: { 
            requiredUnless: helpers.withMessage('This field cannot be empty!', 
              requiredUnless(sameAs(this.userForm.password) && this.userForm.password != '')), 
            sameAs: helpers.withMessage('Passwords do not match!',
              sameAs(this.userForm.password)),
          }
        }
      }
    },

    methods: {
      async register() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.v$.userForm.email.$model,
            password: btoa(this.v$.userForm.password.$model)
          })
        };
        fetch(`${environment.API}/api/auth/register`, requestOptions)
          .then(async response => {
            const result = await response.json();

            if (!response.ok) {
              const error = (result && result.message) || response.status
              return Promise.reject(error)
            } else {
              if(result)
              {
                this.clearForm()
                this.$moshaToast('User succesfuly registered!', {
                  timeout: 3000, type: 'success', showCloseButton: true, showIcon: true,
                  transition: 'zoom', position: 'bottom-center'
                })
              } else {
                this.shaker("emailBox");
                this.redField("inputEmail");
                this.$moshaToast('Account associated with this email alredy exists!', {
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
        this.v$.userForm.confirmEmail.$dirty = true;
        this.v$.userForm.password.$dirty = true;
        this.v$.userForm.confirmPassword.$dirty = true;

        if (this.v$.userForm.email.$invalid)
          this.shaker("emailBox");
          
        if (this.v$.userForm.confirmEmail.$invalid)
          this.shaker("confirmEmailBox");

        if (this.v$.userForm.password.$invalid)
          this.shaker("passwordBox");

        if (this.v$.userForm.confirmPassword.$invalid)
          this.shaker("confirmPasswordBox");
      },

      async clearForm() {
        this.v$.userForm.email.$model = null;
        this.v$.userForm.email.$dirty = false;

        this.v$.userForm.confirmEmail.$model = null;
        this.v$.userForm.confirmEmail.$dirty = false;

        this.v$.userForm.password.$model = null;
        this.v$.userForm.password.$dirty = false;

        this.v$.userForm.confirmPassword.$model = null;
        this.v$.userForm.confirmPassword.$dirty = false;
      },

      async shaker(field) {
        document.getElementById(field).classList.remove("shake");
        setTimeout(() => document.getElementById(field)
          .classList.add("shake"), 0);
      },

      async redField(field) {
        setTimeout(() => document.getElementById(field)
          .classList.add("error"), 0);
      }
    }
  }
</script>

