<template>
  <div class="mainSettingsContainer">
    <div class="settingsContainer">
      <PropertyComponent :name="'E-mail'" :value="profile.email" :is-editing="isEditing" @value-changed="emailChange"/>
      <PropertyComponent :name="'Country'" :value="profile.country" :is-editing="isEditing" @value-changed="countryChange"/>
      <PropertyComponent :name="'Phone Number'" :value="profile.phone_number" :is-editing="isEditing" @value-changed="phoneChange"/>
      <div class="property">
        <div class="passwordLabel">Password</div>
        <a class="changeLink" href="/profile/change-password">Change password</a>
      </div>
    </div>
    <div class="buttons">
      <div class="editButton" @click="editProperties">{{isEditing ? 'Exit' : 'Edit Profile'}}</div>
      <div class="saveChangesButton" v-if="isEditing" @click="saveChanges">Save Changes</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import validator from '../../../module/user-properties-change/validation';

import PropertyComponent from './PropertyComponent.vue';
import axios from 'axios';

let props = defineProps({
  profile: Object
})

let emits = defineEmits({
  'account-change': null
})

let isEditing = ref(false);

function editProperties() {
  isEditing.value = !isEditing.value;
}

function emailChange(email) {
  editedEmail.value = email;
}

function countryChange(country) {
  editedCountry.value = country;
}

function phoneChange(phone) {
  editedPhoneNumber.value = phone;
}

let editedEmail = ref(null);

let editedCountry = ref(null);

let editedPhoneNumber = ref(null);

async function saveChanges() {
  let email, country, phone_number;
  try {
    validator.validateEmail(editedEmail.value);
    email = editedEmail.value;
  } catch {
    email = "";
  }
  try {
    validator.validateCountry(editedCountry.value);
    country = editedCountry.value;
  } catch {
    country = "";
  }
  try {
    validator.validatePhoneNumber(editedPhoneNumber.value);
    phone_number = editedPhoneNumber.value;
  } catch {
    phone_number = "";
  }
  if(!country && !email && !phone_number) {
    isEditing.value = false;
    return;
  }
  try {
    let result = await axios.patch('/profile/change-account-data', {email, country, phone_number}); 
    if(result.status === 200) emits('account-change', result.data);
    isEditing.value = false;
  } catch(err) {
    console.error(err);
    isEditing.value = false;
  }
}
</script>

<style lang="scss">
.mainSettingsContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.passwordLabel {
  margin-bottom: 10px;
}
.changeLink {
  text-decoration: underline;
  color: #86E9CE;
}
</style>