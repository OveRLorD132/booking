<template>
  <UpperLine @user-profile="setProfile"/>
  <FlashMessages :messages="messages" />
  <div class="main-container">
    <form class="change-container">
      <div class="change-label">Enter your password</div>
      <div class="input-container" :style="{borderColor: focusedField == 'password' ? '#FF2F69' : '#d1d1d1'}">
        <input :type="isPasswordHidden ? 'text' : 'password'" class="password-input" v-model="password"  
          @focus="setFocused('password')" @blur="setUnfocused" 
        />
        <img class="hide-img" 
          :src="!isPasswordHidden && focusedField === 'password'? `/images/hide-password-focused.png`
          : isPasswordHidden && focusedField === 'password' ? `/images/show-password-focused.png`
          : !isPasswordHidden && focusedField !== 'password' ? `/images/hide-password.png`
          : `/images/show-password.png`" @click="showPassword"/>
      </div>
      <div class="change-label">
        Enter new password
        <div class="strength-block" v-if="strength" 
          :style="{ color: strength === 'Weak' ? '#b3070d' : strength === 'Medium' ? '#ffcd2a' 
          : strength === 'Strong' ? '#0ba60b' : ''}"
        >
          {{ strength }}
          <div class="strength-bar-container">
            <div class="strength-bar" 
              :style="{ width: strength === 'Weak' ? '33%' : strength === 'Medium' ? '66%' 
              : strength === 'Strong' ? '100%' : '',
              backgroundColor: strength === 'Weak' ? '#b3070d' : strength === 'Medium' ? '#ffcd2a' 
              : strength === 'Strong' ? '#0ba60b' : ''}"
            >
            </div>
          </div>
        </div>
      </div>
      <div class="input-container" :style="{borderColor: focusedField == 'new-password' ? '#FF2F69' : '#d1d1d1'}">
        <input :type="isNewPasswordHidden ? 'text' : 'password'" class="password-input" v-model="newPassword" 
          @focus="setFocused('new-password')" @blur="setUnfocused" 
        />  
        <img class="hide-img"                   
          :src="!isNewPasswordHidden && focusedField === 'new-password'? `/images/hide-password-focused.png`
          : isNewPasswordHidden && focusedField === 'new-password' ? `/images/show-password-focused.png`
          : !isNewPasswordHidden && focusedField !== 'new-password' ? `/images/hide-password.png`
          : `/images/show-password.png`" @click="showNewPassword"/>
      </div>
      <div class="error-text">{{ passwordError }}</div>
      <div class="submit-btn" @click="submitChange">Change</div>
    </form>
  </div>
</template>

<script setup>
import UpperLine from '../components/UpperLine.vue';
import FlashMessages from '../components/FlashMessages.vue';

import validator from '../../module/user-properties-change/validation';

import passwordCheck from '../../module/user-properties-change/password-check';

import { ref, watch } from 'vue';
import axios from 'axios';

let user = ref(null);

function setProfile(obj) {
  user.value = obj;
}

let password = ref(null);

let newPassword = ref(null);

let focusedField = ref(null);

function setFocused(field) {
  focusedField.value = field;
}

function setUnfocused() {
  focusedField.value = null;
}

let isPasswordHidden = ref(false);

function showPassword() {
  isPasswordHidden.value = !isPasswordHidden.value;
}

let isNewPasswordHidden = ref(false);

function showNewPassword() {
  isNewPasswordHidden.value = !isNewPasswordHidden.value;
}

let strength = ref(null);

let passwordError = ref(null);

watch(newPassword, (newValue) => {
  try {
    validator.validatePassword(newValue);
    passwordError.value = '';
  } catch(err) {
    passwordError.value = err;
  }
  strength.value = passwordCheck(newValue);
})

let messages = ref(null);

async function submitChange() {
  if(!password.value || !newPassword.value || passwordError.value || passwordCheck(newPassword.value) === 'Weak') return;
  try {
    await axios.patch('/profile/change-password', { password: password.value, newPassword: newPassword.value});
    window.location.replace('/profile');
  } catch {
    let serverResponse = await axios.get('/flash-messages');
    messages.value = serverResponse.data;
  }
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.main-container {
  height: calc(100vh - 71px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-container {
  display: flex;
  flex-direction: column;
}

.change-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-left: 10px;
  font-size: 22px;
}

.input-container {
  margin: 10px;
  padding: 10px;
  position: relative;
  border-radius: 10px;
  border: 2px solid $border-grey;
  width: 340px;
  display: flex;
  align-items: center;
}

.password-input {
  width: calc(100% - 40px);
  border: none;
  outline: none;
  font-family: 'Roboto';
  font-size: 16px;
  &:focus {
    color: $button-red;
  }
}

.hide-img {
  cursor: pointer;
  right: 5px;
  position: absolute;
  width: 28px;
  height: 28px;
}

.strength-block {
  font-size: 18px;
  display: flex;
  align-items: center;
  flex-direction: row;
  position: absolute;
  right: 15px;
}

.strength-bar-container {
  margin-left: 10px;
  width: 80px;
  height: 8px;
  border-radius: 5px;
  background-color: $border-grey;
}

.strength-bar {
  transition: width .7s ease-out;
  border-radius: 5px;
  height: 100%;
  background-color: black;
}

.error-text {
  margin-left: 10px;
  color: $error-red;
  font-size: 18px;
}

.submit-btn {
  text-align: center;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  outline: none;
  font-family: 'Roboto';
  font-size: 18px;
  color: #fff;
  font-size: 20px;
  background-color: $button-red;
  cursor: pointer;
  &:hover {
    background-color: $button-hover-red;
  }
}

</style>