<template>
  <div class="second-step-container">
    <div class="registration-input-container">
      <div class="registration-label username-label">Username</div>
      <input type="text" class="register-input" v-model="username"/>
      <div class="registration-error">{{ usernameError }}</div>
    </div>
    <div class="registration-input-container">
      <div class="registration-label email-label">E-mail</div>
      <input type="text" class="register-input" v-model="email"/>
      <div class="registration-error">{{ emailError }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import validation from '../../../module/user-properties-change/validation';

let emits = defineEmits({
  'username-input': null,
  'email-input': null
})

let username = ref(null);

let usernameError = ref(null);

watch(username, () => {
  if(!username.value) {
    usernameError.value = "This field mustn't be empty.";
    emits('username-input', '');
    return;
  } 
  try {
    validation.validateUsername(username.value);
    usernameError.value = null;
    emits('username-input', username.value);
  } catch(err) {
    usernameError.value = err.message;
    emits('username-input', '');
  }
})

let email = ref(null);

watch(email, () => {
  if(!email.value) {
    emailError.value = "This field mustn't be empty.";
    emits('email-input', '');
    return;
  }
  try {
    validation.validateEmail(email.value);
    emailError.value = null;
    emits('email-input', email.value);
  } catch(err) {
    emailError.value = err.message;
    emits('email-input', '');
  }
})

let emailError = ref(null);

</script>

<style lang="scss">

</style>