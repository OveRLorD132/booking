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
        <input type="radio" style="height: 25px; width: 25px;" value="Female" id="femaleRadio" v-model="gender"/>
        <label for="femaleRadio">Female</label>
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
    <div class="registration-label">Choose your birth date
      <img @mouseover="showHover('date')" @mouseleave="hideHover('date')" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="dateLabelIsHovered" style="right: -180px;" class="optional-text">This field is optional</div>
        </Transition>
    </div>
    <div class="registration-input-container">
      <div class="date-label" @click="datePick">
        {{ formatDate(date) }}
        <img class="pick-img" src="/images/choose-arrow.png"/>
      </div>
      <CalendarComponent @date-picked="onDatePicked" v-if="calendarIsVisible"/>
    </div>
  </div>
</template>

<script setup>
import CalendarComponent from './CalendarComponent.vue';

import { ref } from 'vue';

let gender = ref(null);

let date = ref(new Date());

let calendarIsVisible = ref(false);

let phoneLabelIsHovered = ref(false);

let genderLabelIsHovered = ref(false);

let dateLabelIsHovered = ref(false);

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

function formatDate(dateObj) {
  return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
}

function datePick() {
  calendarIsVisible.value = !calendarIsVisible.value;
}

function onDatePicked(newDate) {
  date.value = newDate;
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.gender-choose-container {
  width: 200px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.date-label {
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
</style>