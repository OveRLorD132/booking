<template>
  <div class="propertiesContainer" v-if="profile">
    <div class="propertyContainer">
      <div class="propertyColumn">
        <PropertyComponent :name="'User Name'" :value="profile.username" :is-editing="isEditing"
          @value-changed="changeUsername" />
        <PropertyComponent :name="'Gender'" :value="profile.gender" :is-editing="isEditing"
          @value-changed="genderChange" />
      </div>
      <div class="propertyColumn">
        <PropertyComponent :name="'First Name'" :value="profile.first_name" :is-editing="isEditing"
          @value-changed="firstNameChange" />
        <PropertyComponent :name="'Birthdate'" :value="profile.birth_date" />
      </div>
      <div class="propertyColumn">
        <PropertyComponent :name="'Last Name'" :value="profile.last_name" :is-editing="isEditing"
          @value-changed="lastNameChange" />
        <PropertyComponent :name="'Joined Date'" :value="profile.join_date" />
      </div>
    </div>
    <div class="buttons">
      <div class="editButton" @click="editProperties">{{ isEditing ? 'Exit' : 'Edit Profile' }}</div>
      <div class="saveChangesButton" v-if="isEditing" @click="saveChanges">Save Changes</div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';

import validation from '../../../module/user-properties-change/validation';
import PropertyComponent from './PropertyComponent.vue';

import { ref } from 'vue';

let editedFirstName = ref(null);

let editedLastName = ref(null);

let editedUsername = ref(null);

let editedGender = ref(null);

let isEditing = ref(false);

let props = defineProps({
  profile: Object
})

let emits = defineEmits({
  'profile-change': null
})

function editProperties() {
  isEditing.value = !isEditing.value;
}

function lastNameChange(newName) {
  editedLastName.value = newName;
}

function firstNameChange(newName) {
  editedFirstName.value = newName;
}

function changeUsername(newUsername) {
  editedUsername.value = newUsername;
}

function genderChange(newGender) {
  editedGender.value = newGender;
}

async function saveChanges() {
  let username, first_name, last_name, gender;
  try {
    validation.validateUsername(editedUsername.value);
    username = editedUsername.value;
  } catch {
    username = "";
  }
  try {
    validation.validateFirstName(editedFirstName.value)
    first_name = editedFirstName.value;
  } catch {
    first_name = "";
  }
  try {
    validation.validateLastName(editedLastName.value);
    last_name = editedLastName.value;
  } catch {
    last_name = "";
  }
  try {
    validation.validateGender(editedGender.value);
    gender = editedGender.value;
  } catch {
    gender = "";
  }
  if(!username && !first_name && !last_name && !gender) {
    isEditing.false;
    return;
  }
  try {
    let { data } = await axios.patch('/profile/change-profile', {username, first_name, last_name, gender});
    emits('profile-change', data);
    isEditing.value = false;
  } catch (err) {
    console.error(err);
    isEditing.value = false;
  }
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/inputs.scss';
@import '../../../public/stylesheets/colors.scss';

.propertiesContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.propertyContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.editButton {
  @include profile-buttons;
  text-align: center;
  background-color: #86E9CE;
  min-width: 50px;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.saveChangesButton {
  @include profile-buttons;
  background-color: $button-red;
}</style>