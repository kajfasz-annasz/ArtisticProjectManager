<template>
  <div class="acc-container">

    <div v-if="modalDeleteAccount == true" class="my-modal-blur">
      <div class="my-modal">
        <div class="my-modal-header">
          <i class="fa fa-info-circle my-modal-header-icon" aria-hidden="true"></i>
          CAUTION!
          <i class="fa fa-long-arrow-right my-modal-header-arrow" aria-hidden="true"></i>
          Permanently deleting account
        </div>
        <div class="my-modal-body">
          <p>Please provide your password to continue!</p>
          <input id="deleteAccountPassword" v-model="deleteAccountPassword" type="password"
            placeholder="Password" class="form-control my-modal-body-input">
        </div>
        <div class="my-modal-footer">
          <button class="btn btn-danger" v-on:click="deleteAccountCancel()">
            Cancel
          </button>
          <button class="btn btn-primary" v-on:click="deleteAccountConfirm()">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div class="container-fluid">

      <div class="row">

        <div class="col-md-4 acc-col-1 acc-col-style">
          <div class="acc-form-center">
            <i class="fa fa-user-circle acc-avatar" aria-hidden="true"></i>
            <p v-if="userDetails.nickname != '' " class="acc-username">{{ userDetails.nickname }}</p>
            <p v-else class="acc-username"> Nickname </p>
            <div class="acc-next-to acc-location">
              <i class="fa fa-map-marker acc-location-icon" aria-hidden="true"></i>
              <p class="acc-location-text" v-if="userDetails.city != '' && userDetails.country != ''">
                {{ userDetails.city }}, {{ userDetails.country }}
              </p>
              <p class="acc-location-text" v-if="userDetails.city == '' && userDetails.country == ''">
                City, Country
              </p>
              <p class="acc-location-text" v-if="userDetails.city != '' && userDetails.country == ''">
                {{ userDetails.city }}, Country
              </p>
              <p class="acc-location-text" v-if="userDetails.city == '' && userDetails.country != ''">
                City, {{ userDetails.country }}
              </p>
            </div>
          </div>

          <button type="button" class="acc-button-avatar" v-on:click="changeAvatar()">
            Change Avatar
          </button>

        </div>
        
        <div class="col-md acc-col-2 acc-col-style">

          <div class="acc-column-header">Account Details</div>

          <div class="acc-details">
            <div class="acc-details-name">
              Nickname:
            </div>
            <input v-model="userDetails.nickname" id="nickname" type="text" class="acc-details-value" 
              disabled maxlength="20" minlength="3" autocomplete="new-password"/>
          </div>

          <div class="acc-details">
            <div class="acc-details-name">
              Email:
            </div>
            <input v-model="userDetails.email" id="email" type="text" class="acc-details-value" 
              disabled pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
          </div>

          <div class="acc-details">
            <div class="acc-details-name">
              City:
            </div>
            <input v-model="userDetails.city" id="city" type="text" class="acc-details-value" disabled
              maxlength="20"/>
          </div>

          <div class="acc-details">
            <div class="acc-details-name">
              Country:
            </div>
            <input v-model="userDetails.country" id="country" type="text" class="acc-details-value" disabled
              maxlength="30"/>
          </div>

          <div class="acc-column-header">Password</div>

          <div class="acc-details">
            <div class="acc-details-name">
              Old password:
            </div>
            <input v-model="userDetails.oldPassword" id="oldPassword" type="password" 
              class="acc-details-value" disabled maxlength="30"/>
          </div>

          <div class="acc-details">
            <div class="acc-details-name">
              New password:
            </div>
            <input v-model="userDetails.newPassword" id="newPassword" type="password" 
              class="acc-details-value" disabled maxlength="30" minlength="6"/>
          </div>

          <div class="acc-details">
            <div class="acc-details-name">
              Confirm password:
            </div>
            <input v-model="userDetails.confirmPassword" id="confirmPassword" type="password" 
              class="acc-details-value" disabled maxlength="30" v-on:keyup="validatePassword()"/>
          </div>
          
          <button type="button" id="changeDetailsButton" class="acc-button-change-details" 
            v-on:click="changeDetailsButton()">Change</button>
          <button id="saveDetailsButton" type="button" class="acc-button-save" disabled
            v-on:click="saveDetailsButton()">
            Save
          </button>

        </div>
      </div>
      
      <div class="row">
        <div class="col-md-8 acc-col-3 acc-col-style">
          <div class="acc-column-header">Social Media</div>

          <div class="row">
            <div class="acc-sm-col-1 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-facebook acc-icons"/>
              </div>
              <input id="facebook" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.facebook"/>
            </div>

            <div class="acc-sm-col-2 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-twitter acc-icons"/>
              </div>
              <input id="twitter" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.twitter"/>
            </div>
          </div>

          <div class="row">
            <div class="acc-sm-col-1 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-github acc-icons"/>
              </div>
              <input id="github" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.github"/>
            </div>

            <div class="acc-sm-col-2 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-linkedin acc-icons"/>
              </div>
              <input id="linkedin" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.linkedin"/>
            </div>
          </div>

          <div class="row">
            <div class="acc-sm-col-1 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-snapchat-ghost acc-icons"/>
              </div>
              <input id="snapchat" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.snapchat"/>
            </div>

            <div class="acc-sm-col-2 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-youtube acc-icons"/>
              </div>
              <input id="youtube" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.youtube"/>
            </div>
          </div>

          <div class="row">
            <div class="acc-sm-col-1 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-instagram acc-icons"/>
              </div>
              <input id="instagram" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.instagram"/>
            </div>

            <div class="acc-sm-col-2 col-md card acc-social-media">
              <div class="acc-sm-logo-div">
                <p class="fa fa-skype acc-icons"/>
              </div>
              <input id="skype" type="text" class="acc-social-media-value" disabled
                maxlength="20" autocomplete="new-password" v-model="socialMedia.skype"/>
            </div>
          </div>

          <button id="changeSocialMediaButton" type="button" class="acc-button-change-details"
            v-on:click="changeSocialMediaButton()">Change</button>
          <button id="saveSocialMediaButton" type="button" class="acc-button-save" disabled
            v-on:click="saveSocialMediaButton()">
            Save
          </button>

        </div>
        
        <div class="col-md acc-col-4 acc-col-style">
          <div class="acc-column-header">Settings</div>

          <div class="acc-settings">
            <div class="acc-settings-name">
              <p>Language</p>
            </div>
            <div class="acc-settings-name">
              <select class="custom-select">
                <option selected>English</option>
                <option value="1">Polski</option>
            </select>
            </div>
          </div>

          <div class="acc-settings">
            <div class="acc-settings-name">
              <p>Darkmode</p>
            </div>
            <div class="acc-settings-name">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" 
                  id="flexSwitchCheckDefault">
              </div>
            </div>
          </div>

          <div class="acc-column-header">Delete Account</div>
          <p class="acc-warning">!!! Warning !!!</p>
          <p class="acc-warning">This action can't be reversed!</p>

          <button type="button" class="acc-button-delete-account" v-on:click="deleteAccount()">
            Delete Account
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import '../assets/styles/accountStyle.css';
</style>

<script>
  import { environment } from '../../config.js';

  const inputsDetails = ['nickname', 'email', 'city', 'country', 'oldPassword', 
    'newPassword', 'confirmPassword'];

  const inputsSocialMedia = ['facebook', 'twitter', 'github', 'linkedin', 'snapchat', 'youtube', 
    'instagram', 'skype'];
  
  let userDetailsOld = {};
  let socialMediaOld = {};

  var token = null;

  export default {

    data () {
      return {
        userDetails: {
          nickname: '',
          email: '',
          city: '',
          country: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        socialMedia: {
          facebook: '',
          twitter: '',
          github: '',
          linkedin: '',
          snapchat: '',
          youtube: '',
          instagram: '',
          skype: ''
        },

        modalDeleteAccount: false,
        deleteAccountPassword: ''
      }
    },

    async mounted() {

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

            const values = ['nickname', 'email', 'city', 'country', 'facebook', 'twitter', 'github', 
            'linkedin', 'snapchat', 'youtube', 'instagram', 'skype']

            for (var index = 0; index < values.length; index++) {

              if(result[values[index]] != null) {
                if (index < 4)
                {
                  this.userDetails[values[index]] = result[values[index]];
                } else {
                  this.socialMedia[values[index]] = result[values[index]];
                }
              }
            }
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
      async changeDetailsButton() {

        userDetailsOld = JSON.parse(JSON.stringify(this.userDetails));

        for (var index = 0; index < inputsDetails.length; index++) {
          document.getElementById(`${inputsDetails[index]}`).disabled = false;
        }

        document.getElementById('changeDetailsButton').disabled = true;
        document.getElementById('saveDetailsButton').disabled = false;
      },

      async changeSocialMediaButton() {
        
        socialMediaOld = JSON.parse(JSON.stringify(this.socialMedia));

        for (var index = 0; index < inputsSocialMedia.length; index++) {
          document.getElementById(`${inputsSocialMedia[index]}`).disabled = false;
        }

        document.getElementById('changeSocialMediaButton').disabled = true;
        document.getElementById('saveSocialMediaButton').disabled = false;
      },

      async saveDetailsButton() {

        var message = null;

        if (JSON.stringify(this.userDetails) !== JSON.stringify(userDetailsOld)) {
          if (
            document.getElementById('nickname').checkValidity() &&
            document.getElementById('email').checkValidity() &&
            this.userDetails.email != "" &&
            document.getElementById('city').checkValidity() &&
            document.getElementById('country').checkValidity()
          ) {
            if (
              this.userDetails.oldPassword == "" &&
              this.userDetails.newPassword == "" &&
              this.userDetails.confirmPassword == ""
              ) {
                message = JSON.stringify({
                  id: token,
                  passwordChange: false,
                  nickname: this.userDetails.nickname,
                  email: this.userDetails.email,
                  city: this.userDetails.city,
                  country: this.userDetails.country
                })
              } else if (
                document.getElementById('oldPassword').checkValidity() &&
                document.getElementById('newPassword').checkValidity() &&
                this.userDetails.newPassword == this.userDetails.confirmPassword &&
                this.userDetails.oldPassword != "" &&
                this.userDetails.newPassword != "" &&
                this.userDetails.confirmPassword != ""
              ) {
                message = JSON.stringify({
                  id: token,
                  passwordChange: true,
                  nickname: this.userDetails.nickname,
                  email: this.userDetails.email,
                  city: this.userDetails.city,
                  country: this.userDetails.country,
                  oldPassword: btoa(this.userDetails.oldPassword),
                  newPassword: btoa(this.userDetails.newPassword)
                })
              }
          }

          if (message != null) {
            const requestOptions = {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
              },
              body: message
            };
            fetch(`${environment.API}/api/user/account/details`, requestOptions)
              .then(async response => {
                const result = await response.json();

                if (!response.ok) {
                  const error = (result && result.message) || response.status
                  return Promise.reject(error)
                } else {

                  console.log(result)

                  if(result.status == 'emailExist')
                  {
                    this.$moshaToast('This email address already exist in our database!', {
                      timeout: 3000, type: 'danger', showCloseButton: true, showIcon: true,
                      transition: 'zoom', position: 'bottom-center'
                    })
                  } else if (result.status == 'wrongPassword') {
                      this.$moshaToast('Wrong password in field Old Password!', {
                        timeout: 3000, type: 'danger', showCloseButton: true, showIcon: true,
                        transition: 'zoom', position: 'bottom-center'
                      })
                  } else if (result.status == 'nicknameExist') {
                      this.$moshaToast('This nickname already exist in our database!', {
                        timeout: 3000, type: 'danger', showCloseButton: true, showIcon: true,
                        transition: 'zoom', position: 'bottom-center'
                      })
                  } else if (result.status) {

                    this.$moshaToast('Account details succesfully saved!', {
                      timeout: 3000, type: 'success', showCloseButton: true, showIcon: true,
                      transition: 'zoom', position: 'bottom-center'
                    })

                    this.userDetails.oldPassword = "";
                    this.userDetails.newPassword = "";
                    this.userDetails.confirmPassword = "";

                    for (var index = 0; index < inputsDetails.length; index++) {
                      document.getElementById(`${inputsDetails[index]}`).disabled = true;
                    }

                    document.getElementById('changeDetailsButton').disabled = false;
                    document.getElementById('saveDetailsButton').disabled = true;
                  }
                }
              })
              .catch(error => {
                console.log(error)
                this.errorMessage = error;

                this.$moshaToast({
                  title:'Ups! Something went wrong!', 
                  description: `There was an error while saving your data!`
                },
                {
                  timeout: 5000, type: 'danger', showCloseButton: true, showIcon: true,
                  transition: 'zoom', position: 'bottom-center'
                });
              });
          } else {
              this.$moshaToast('All data needs to be valid to save details!', {
                timeout: 3000, type: 'danger', showCloseButton: true, showIcon: true,
                transition: 'zoom', position: 'bottom-center'
              })
            }
        } else {
            this.$moshaToast('No changes in user details list detected!', {
              timeout: 3000, type: 'info', showCloseButton: true, showIcon: true,
              transition: 'zoom', position: 'bottom-center'
            })

            for (var index = 0; index < inputsDetails.length; index++) {
             document.getElementById(`${inputsDetails[index]}`).disabled = true;
            }

            document.getElementById('changeDetailsButton').disabled = false;
            document.getElementById('saveDetailsButton').disabled = true;
        }
      },

      async saveSocialMediaButton() {

        if (JSON.stringify(this.socialMedia) !== JSON.stringify(socialMediaOld))
        {
          const requestOptions = {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: token,
              facebook: this.socialMedia.facebook,
              twitter: this.socialMedia.twitter,
              github: this.socialMedia.github,
              linkedin: this.socialMedia.linkedin,
              snapchat: this.socialMedia.snapchat,
              youtube: this.socialMedia.youtube,
              instagram: this.socialMedia.instagram,
              skype: this.socialMedia.skype
            })
          };
          fetch(`${environment.API}/api/user/account/socialmedia`, requestOptions)
            .then(async response => {
              const result = await response.json();

              if (!response.ok) {
                const error = (result && result.message) || response.status
                return Promise.reject(error)
              } else {

                this.$moshaToast('Social media account list succesfully saved!', {
                  timeout: 3000, type: 'success', showCloseButton: true, showIcon: true,
                  transition: 'zoom', position: 'bottom-center'
                })
              }
            })
            .catch(error => {
              console.log(error)
              this.errorMessage = error;

              this.$moshaToast({
                title:'Ups! Something went wrong!', 
                description: `There was an error while saving your data!`
              },
              {
                timeout: 5000, type: 'danger', showCloseButton: true, showIcon: true,
                transition: 'zoom', position: 'bottom-center'
              });
            });
        } else {
            this.$moshaToast('No changes in social media list detected!', {
              timeout: 3000, type: 'info', showCloseButton: true, showIcon: true,
              transition: 'zoom', position: 'bottom-center'
            })
        }

          for (var index = 0; index < inputsSocialMedia.length; index++) {
            document.getElementById(`${inputsSocialMedia[index]}`).disabled = true;
          }

          document.getElementById('changeSocialMediaButton').disabled = false;
          document.getElementById('saveSocialMediaButton').disabled = true;
      },

      async validatePassword() {
        if(document.getElementById('newPassword').value != document.getElementById('confirmPassword').value) {    
          document.getElementById('confirmPassword').classList.add("acc-invalid");
        } else {
          document.getElementById('confirmPassword').classList.remove("acc-invalid");
        }
      },

      async deleteAccount() {
        this.modalDeleteAccount = true;
      },

      async deleteAccountCancel() {
        this.modalDeleteAccount = false;
      },

      async deleteAccountConfirm() {

        // const requestOptions = {
        //   method: "POST",
        //   headers: { 
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ 
        //     id: token,
        //     password: this.deleteAccountPassword
        //   })
        // };
        // fetch(`${environment.API}/api/user/account/delete`, requestOptions)
        //   .then(async response => {
        //     const result = await response.json();

        //     if (!response.ok) {
        //       const error = (result && result.message) || response.status
        //       return Promise.reject(error)
        //     } else {

        //       console.log(result.status)

        //       if(result.status == 'wrongPassword'){
        //         document.getElementById('deleteAccountPassword').element.classList.add('is-invalid');
        //       }
        //     }
        //   })
        //   .catch(error => {
        //     console.log(error)
        //     this.errorMessage = error;

        //     this.$moshaToast({
        //       title:'Ups! Something went wrong!', 
        //       description: `${error}`
        //     },
        //     {
        //       timeout: 5000, type: 'danger', showCloseButton: true, showIcon: true,
        //       transition: 'zoom', position: 'bottom-center'
        //     });
        //   });
      },

      async changeAvatar() {
        alert(
        'Działam! Dodać opcję zmiany awatara. Moze być takie samo okienko, jak w przypadku usuwania konta!'
        )
      }
    }
  }
</script>
