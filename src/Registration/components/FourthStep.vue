<template>
  <div class="fourth-step-container">
    <div class="registration-input-container">
      <div class="registration-label">Choose your gender
        <img @mouseover="showHover('gender')" @mouseleave="hideHover('gender')" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="genderLabelIsHovered" style="right: -180px;" class="optional-text">This field is optional</div>
        </Transition>
      </div>
      <div class="gender-choose-container">
        <input type="radio" style="height: 25px; width: 25px;" value="Male" id="maleRadio" v-model="gender"/>
        <label for="maleRadio">Male</label>
        <input type="radio" style="margin-left: 20px; height: 25px; width: 25px;" value="Female" id="femaleRadio" v-model="gender"/>
        <label for="femaleRadio">Female</label>
        <input type="radio" style="margin-left: 20px; height: 25px; width: 25px;" value="Not selected" id="noneRadio" v-model="gender"/>
        <label for="noneRadio">Not selected</label>
      </div>
    </div>
    <div class="registration-label">Type your phone number
      <img @mouseover="showHover('phone')" @mouseleave="hideHover('phone')" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="phoneLabelIsHovered" style="right: -180px;" class="optional-text">This field is optional</div>
        </Transition>
    </div>
    <div class="registration-input-container">
      <input type="text" class="register-input" v-model="phoneNumber"/>
    </div>
    <div class="registration-error">{{ phoneNumError }}</div>
    <div class="registration-label">Choose your birth date
      <img @mouseover="showHover('date')" @mouseleave="hideHover('date')" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="dateLabelIsHovered" style="right: -180px;" class="optional-text">This field is optional</div>
        </Transition>
    </div>
    <div class="registration-input-container">
      <div class="date-label" @click="datePick">
        {{ typeof date !== 'string' ? formatDate(date) : date}}
        <img class="pick-img" src="/images/choose-arrow.png"/>
      </div>
      <div class="registration-error">{{ dateError }}</div>
      <div class="clear-btn" @click="clearDate">Clear</div>
      <CalendarComponent @date-picked="onDatePicked" v-if="calendarIsVisible"/>
    </div>
  </div>
</template>

<script setup>
import CalendarComponent from './CalendarComponent.vue';

import { ref, watch } from 'vue';

import validation from '../../../module/user-properties-change/validation';

let gender = ref('Not selected');

let phoneNumber = ref(null);

let date = ref('Not chosen');

let calendarIsVisible = ref(false);

let phoneLabelIsHovered = ref(false);

let genderLabelIsHovered = ref(false);

let dateLabelIsHovered = ref(false);

let emits = defineEmits({
  'date-input': null,
  'phone-input': null,
  'gender-input': null
})

function showHover(fieldNum) {
  switch(fieldNum) {
    case 'phone':
      phoneLabelIsHovered.value = true;
      break;
    case 'gender':
      genderLabelIsHovered.value = true;
      break;
    case 'date':
      dateLabelIsHovered.value = true;
      break;
    default:
      break;
  }
}

function hideHover(fieldNum) {
  switch(fieldNum) {
    case 'phone':
      phoneLabelIsHovered.value = false;
      break;
    case 'gender':
      genderLabelIsHovered.value = false;
      break;
    case 'date':
      dateLabelIsHovered.value = false;
      break;
    default: 
      break;
  }
}

watch(gender, (newVal) => {
  emits('gender-input', newVal);
})

let phoneNumError = ref(null);

watch(phoneNumber, (newVal) => {
  if(!newVal) emits('phone-input', '');
  try {
    validation.validatePhoneNumber(newVal);
    phoneNumError.value = null;
    emits('phone-input', newVal);
  } catch(err) {
    emits('phone-input', 'Invalid');
    phoneNumError.value = err.message;
  }
})

let dateError = ref(null);

watch(date, (newDate) => {
  if (newDate === 'Not chosen') emits('date-input', '');
  else if (!newDate) emits('date-input', '');
  else {
    try {
      validation.validateBirthDate(newDate);
      dateError.value = null;
      emits('date-input', newDate)
    } catch (err) {
      emits('date-input', 'Invalid');
      dateError.value = err.message;
    }
  }
})

function formatDate(dateObj) {
  let day = dateObj.getDate();
  if(day < 10) {
    day = '0' + day;
  }
  let month = dateObj.getMonth() + 1;
  if(month < 10) {
    month = '0' + month;
  }
  return `${day}.${month}.${dateObj.getFullYear()}`;
}

function datePick() {
  calendarIsVisible.value = !calendarIsVisible.value;
}

function onDatePicked(newDate) {
  date.value = newDate;
}

function clearDate() {
  date.value = 'Not chosen';
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.gender-choose-container {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.date-label {
  margin-bottom: 5px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 20px;
  padding: 5px 5px 5px 5px;
  background-color: $calendar-grey;
}

.pick-img {
  margin-left: 10px;
  width: 18px; 
  height: 18px;
}

.clear-btn {
  color: #fff;
  background-color: $button-red;
  font-size: 18px;
  padding: 10px 10px 10px 10px;
  margin-top: 15px;
  border-radius: 10px;
}
</style>