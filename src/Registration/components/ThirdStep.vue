<template>
  <div class="third-step-container">
    <div class="registration-input-container">
      <div class="registration-label password-label">Password
        <div class="strength-block" v-if="passStrength"
          :style="{ color: passStrength === 'Weak' ? '#b3070d' : passStrength === 'Medium' ? '#ffcd2a' 
          : passStrength === 'Strong' ? '#0ba60b' : ''}"
        >
          {{ passStrength }}
          <div class="strength-bar-container">
            <div class="strength-bar"
              :style="{ width: passStrength === 'Weak' ? '33%' : passStrength === 'Medium' ? '66%' 
              : passStrength === 'Strong' ? '100%' : '',
              backgroundColor: passStrength === 'Weak' ? '#b3070d' : passStrength === 'Medium' ? '#ffcd2a' 
              : passStrength === 'Strong' ? '#0ba60b' : ''}"
            >
          </div>
          </div>
        </div>
      </div>
      <div class="input-cont">
        <input :type="isPasswordHidden ? 'text' : 'password'" class="register-input" v-model="password"
          @focus="fieldFocus('password')" @blur="fieldBlur"
        />
        <img class="show-btn"
          :src="!isPasswordHidden && focusedField === 'password'? `/images/hide-password-focused.png`
          : isPasswordHidden && focusedField === 'password' ? `/images/show-password-focused.png`
          : !isPasswordHidden && focusedField !== 'password' ? `/images/hide-password.png`
          : `/images/show-password.png`" @click="showPassword"/>
      </div>
      <div class="registration-error">{{ passwordError }}</div>
    </div>
    <div class="registration-input-container">
      <div class="registration-label confirm-label">Confirm Password</div>
      <div class="input-cont">
        <input :type="confirmIsHidden ? 'text' : 'password'" class="register-input" v-model="passwordConfirm"
          @focus="fieldFocus('confirm')" @blur="fieldBlur"
        />
        <img class="show-btn"
          :src="!confirmIsHidden && focusedField === 'confirm'? `/images/hide-password-focused.png`
          : confirmIsHidden && focusedField === 'confirm' ? `/images/show-password-focused.png`
          : !confirmIsHidden && focusedField !== 'confirm' ? `/images/hide-password.png`
          : `/images/show-password.png`" @click="showConfirm"/>
      </div>
      <div class="registration-error">{{ confirmationError }}</div>
    </div>
  </div>
</template>

<script setup>
import passwordCheck from '../module/password-check';

import validation from '../../../module/user-properties-change/validation';

import { ref, watch } from 'vue';

let emits = defineEmits({
  'password-input': null,
  'confirm-input': null
})

let password = ref(null);

let passwordError = ref(null);

let passStrength = ref(null);

watch(password, () => {
  passStrength.value = passwordCheck(password.value);
  if(passStrength.value === 'Weak') {
    passwordError.value = 'Your password is too weak.';
    emits('password-input', '');
  } 
  else if(passStrength.value !== 'Weak') {
    try {
      passwordError.value = null;
      validation.validatePassword(password.value);
      emits('password-input', password.value);
    } catch(err) {
      passwordError.value = err.message; 
      emits('password-input', '');
    }
  }
})

let confirmationError = ref(null);

let passwordConfirm = ref(null);

watch(passwordConfirm, () => {
  if(passwordConfirm.value !== password.value) {
    passwordError.value = 'Passwords must match.'
    emits('confirm-input', '');
  } else if(passwordConfirm.value && password.value === passwordConfirm.value) {
    emits('confirm-input', passwordConfirm.value)
    passwordError.value = '';
  }

})

let isPasswordHidden = ref(false);

function showPassword() {
  isPasswordHidden.value = !isPasswordHidden.value;
}

let confirmIsHidden = ref(false);

function showConfirm() {
  confirmIsHidden.value = !confirmIsHidden.value;
}

let focusedField = ref(null);

function fieldFocus(field) {;
  focusedField.value = field;
}

function fieldBlur() {
  focusedField.value = null;
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

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
}

.input-cont {
  display: flex;
  align-items: center;
  position: relative;
}

.show-btn {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
</style>