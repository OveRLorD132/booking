<template>
  <div class="first-step-container">
    <div class="registration-label first-name-label">First Name</div>
    <div class="registration-input-container">
      <input type="text" v-model="first_name" class="register-input"/>
      <div class="registration-error" v-if="firstNameError">{{ firstNameError }}</div>
    </div>
    <div class="registration-label last-name-label">Last Name</div>
    <div class="registration-input-container">
      <input type="text" v-model="last_name" class="register-input"/>
      <div class="registration-error" v-if="lastNameError">{{ lastNameError }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import validator from '../../../module/user-properties-change/validation';

let emits = defineEmits({
  'first-name-input': (name) => typeof name === 'string',
  'last-name-input': (name) => typeof name === 'string'
})

let firstNameError = ref(null);
let first_name = ref(null);

watch(first_name, (newValue) => {
    if(newValue === "") {
      firstNameError.value = "This field mustn't be empty.";
      emits('first-name-input', "");
    } 
    else {
      try {
        validator.validateFirstName(first_name.value);
        firstNameError.value = null;
        emits('first-name-input', first_name.value);
      } catch(err) {
        firstNameError.value = err.message;
        emits('first-name-input', "");
      }
    }
})

let lastNameError = ref(null);
let last_name = ref(null);

watch(last_name, (newValue) => {
    if(newValue === "") {
      lastNameError.value = "This field mustn't be empty.";
      emits('last-name-input', "");
    } 
    else {
      try {
        validator.validateLastName(last_name.value);
        lastNameError.value = null;
        emits('last-name-input', last_name.value);
      } catch(err) {
        lastNameError.value = err.message;
        emits('last-name-input', "");
      }
    }
})
</script>

<style lang="scss">

</style>