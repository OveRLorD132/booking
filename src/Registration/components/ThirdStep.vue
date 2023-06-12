<template>
  <div class="third-step-container">
    <div class="registration-input-container">
      <div class="registration-label password-label">Password</div>
      <input type="password" class="register-input" v-model="password"/>
      <div class="strength-line">
        <div class="weak-line" v-if="passStrength"/>
        <div class="medium-line" v-if="passStrength === 'Medium' || passStrength === 'Strong'"/>
        <div class="strong-line" v-if="passStrength === 'Strong'"/>
      </div>
      <div class="strength-label" :style="{color: passStrength === 'Strong' ? '#0ba60b' 
      : passStrength === 'Medium' ? '#ffcd2a' : '#b3070d', 
      marginLeft: passStrength === 'Strong' ? '233px' : passStrength === 'Medium' ? '103px' : ''}">{{ passStrength }}</div>
      <div class="registration-error">{{ passwordError }}</div>
    </div>
    <div class="registration-input-container">
      <div class="registration-label confirm-label">Confirm Password</div>
      <input type="password" class="register-input" v-model="passwordConfirm"/>
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
</script>

<style lang="scss">
.strength-line {
  display: flex;
  flex-direction: row;
}

.strength-label {
  font-size: 18px;
}

.weak-line {
  height: 4px;
  width: 100px;
  background-color: #b3070d;
}

.medium-line {
  height: 4px;
  width: 130px;
  background-color: #ffcd2a;
}

.strong-line {
  height: 4px;
  width: 170px;
  background-color: #0ba60b;
}
</style>