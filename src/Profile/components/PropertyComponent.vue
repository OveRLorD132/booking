<template>
  <div class="property" @mouseover="showBtn" @mouseleave="hideBtn"
    :style="{ borderBottom: name === 'Password' ? 'none' : '3px solid #FF2F69' }">
    <div class="propertyLabel">{{ name }}</div>
    <div class="propertyValue" v-if="!isEditing">{{ value ? value : 'Not Entered' }}</div>
    <input type="text" class="propertyValueInput" v-model="editedValue" v-if="isEditing && name !== 'Gender'
      && name !== 'Country' && name !== 'Birth Date'" />
    <select class="option-select" v-if="isEditing && name === 'Gender'" v-model="editedValue">
      <option class="prop-option">Male</option>
      <option class="prop-option">Female</option>
      <option class="prop-option">Not selected</option>
    </select>
    <select class="option-select" v-if="isEditing && name === 'Country'" v-model="editedValue">
      <option class="prop-option" v-for="country in countriesList">{{ country }}</option>
    </select>
    <div class="propertyValue" style="cursor: pointer;" @click="showCalendar" v-if="isEditing && name === 'Birth Date'">
      {{ editedValue === value ? value : formatDate(editedValue) }}</div>
    <CalendarComponent @date-picked="setDate" v-if="calendarIsVisible" />
    <img class="edit-img" src="/images/prop-edit.png" v-if="!isEditing && isHovered" @click="startEditing" />
    <img class="accept-img" src="/images/prop-accept.png" @click="submitEdit" v-if="isEditing" />
    <img class="cancel-img" src="/images/prop-cancel.png" @click="cancelEdit" v-if="isEditing" />
  </div>
  <div class="edit-error" v-if="isEditing && editError">{{ editError }}</div>
</template>

<script setup>
import { ref, watch } from 'vue';

import CalendarComponent from '../../Registration/components/CalendarComponent.vue';

import countriesList from '../../Registration/module/countries-list';
import axios from 'axios';

import validation from '../../../module/user-properties-change/validation';

let props = defineProps({
  name: String,
  value: null,
})

let emits = defineEmits({
  'value-changed': null,
  'change-error': null
})

let editedValue = ref(props.value);

let editError = ref('');

watch(editedValue, (newValue) => {
  try {
    switch (props.name) {
      case 'First Name':
        validation.validateFirstName(newValue);
        break;
      case 'Username':
        validation.validateUsername(newValue);
        break;
      case 'Last Name':
        validation.validateLastName(newValue);
        break;
      case 'Birth Date':
        validation.validateBirthDate(newValue);
        break;
      case 'Gender':
        validation.validateGender(newValue);
        break;
      case 'Email':
        validation.validateEmail(newValue);
        break;
      case 'Country':
        validation.validateCountry(newValue);
        break;
      case 'Phone Number':
        validation.validatePhoneNumber(newValue);
        break;
      default:
        break;
    }
    editError.value = '';
  } catch (err) {
    editError.value = err.message;
  }
})

let isHovered = ref(null);

function showBtn() {
  if (props.name === 'Join Date') return;
  isHovered.value = true;
}

function hideBtn() {
  isHovered.value = false;
}

let isEditing = ref(false);

function startEditing() {
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

let calendarIsVisible = ref(false);

function showCalendar() {
  calendarIsVisible.value = !calendarIsVisible.value;
}

function setDate(date) {
  editedValue.value = date;
}

function formatDate(dateObj) {
  dateObj = new Date(dateObj);
  let day = dateObj.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let month = dateObj.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  return `${day}.${month}.${dateObj.getFullYear()}`;
}

async function submitEdit() {
  if (editError.value) return;
  if (editedValue.value === props.value) {
    isEditing.value = false;
    return;
  }
  try {
    switch (props.name) {
      case 'Username':
        await axios.patch('/profile/change-property/username', { value: editedValue.value });
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'First Name':
        await axios.patch('/profile/change-property/first-name', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'Last Name':
        await axios.patch('/profile/change-property/last-name', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'Birth Date':
        await axios.patch('/profile/change-property/birth-date', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'Gender':
        await axios.patch('/profile/change-property/gender', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'Phone Number':
        await axios.patch('/profile/change-property/phone-num', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'Country':
        await axios.patch('/profile/change-property/country', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      case 'Email':
        await axios.patch('/profile/change-property/email', { value: editedValue.value })
        emits('value-changed', { name: props.name, value: editedValue.value });
        break;
      default:
        break;
    }
  } catch (err) {
    emits('change-error');
  } finally {
    isEditing.value = false;
  }
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.property {
  //border-bottom: 3px solid $button-red;
  position: relative;
  font-size: 18px;
  margin: 10px 10px 10px 10px;
  width: 250px;
}

.propertyValue {
  padding: 10px 10px 10px 0;
  color: $button-red;
  font-size: 20px;
}

.propertyValueInput {
  padding: 10px 10px 10px 0;
  color: $button-red;
  font-size: 20px;
  outline: none;
  border: none;
}

.option-select {
  outline: none;
  width: 200px;
  border: none;
  color: $button-red;
  padding: 10px 10px 10px 0;
  font-size: 20px;
}

.prop-option {
  &:hover {
    background-color: $button-red;
  }
}

.edit-img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.accept-img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 25px;
}

.cancel-img {
  width: 22px;
  height: 22px;
  cursor: pointer;
  position: absolute;
  bottom: 9px;
  right: 5px;
}

.edit-error {
  color: $error-red;
  font-size: 16px;
  margin: 10px;
}
</style>