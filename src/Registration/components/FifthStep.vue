<template>
  <div class="fifth-step-container">
    <div class="registration-input-container">
      <div class="registration-label type-choose-label" style="width: 560px;">Choose account type</div>
      <div class="type-choose-container">
        <div class="radio-container">
          <input type="radio" id="guest-label" value="Guest" v-model="type"/>
          <label for="guest-label">Guest</label>
        </div>
        <div class="radio-container">
          <input type="radio" id="host-label" value="Host" v-model="type"/>
          <label for="host-label">Host</label>
        </div>
      </div>
    </div>
    <div class="registration-input-container">
      <div class="registration-label" style="width: 560px;">Choose your country
        <img @mouseover="showHover('country')" @mouseleave="hideHover('country')" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="countryIsHovered" style="right: -180px;" class="optional-text">This field is optional</div>
        </Transition>
      </div>
      <select class="select-country" v-model="country">
        <option v-for="country of countriesList" class="country-option">{{ country }}</option>
      </select>
    </div>
    <div class="registration-input-container">
      <div class="registration-label description-label" style="width: 560px;">Tell us more about yourself
        <img v-if="type === 'Guest'" @mouseover="showHover('description')" @mouseleave="hideHover('description')" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="descriptionIsHovered" style="right: -310px;" class="optional-text">This field is optional for guest accounts</div>
        </Transition>
      </div>
      <textarea class="register-input description-input" style="width: 530px;" v-model="description"></textarea>
      <div class="registration-error">{{ descriptionError }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import validation from '../../../module/user-properties-change/validation';

import countriesList from '../module/countries-list';

let emits = defineEmits({
  'type-input': null,
  'country-input': null,
  'description-input': null,
})

let type = ref('Guest');

watch(type, () => {
  emits('type-input', type.value);
})

let country = ref('--Select country--');

watch(country, () => {
  emits('country-input', country.value);
})

let description = ref(null);

let descriptionError = ref(null);

watch(description, (value) => {
  if (!value && type.value === 'Host') descriptionError.value = 'Description is obligatory for host accounts.';
  else {
    try {
      validation.validateDescription(value);
      emits('description-input', value);
      descriptionError.value = null;
    } catch (err) {
      descriptionError.value = err.message;
      emits('description-input', 'Invalid');
    }
  }
})

let countryIsHovered = ref(false);

let descriptionIsHovered = ref(false);

function showHover(fieldStr) {
  switch(fieldStr) {
    case 'country':
      countryIsHovered.value = true;
      break;
    case 'description':
      descriptionIsHovered.value = true;
      break;
    default:
      break;
  }
}

function hideHover(fieldStr) {
  switch(fieldStr) {
    case 'country':
      countryIsHovered.value = false;
      break;
    case 'description':
      descriptionIsHovered.value = false;
      break;
    default:
      break;
  }
}

</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

@import '../../../public/stylesheets/inputs.scss';

.type-choose-container {
  display: flex;
  width: 200px;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
}

.radio-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px 0 5px 0;
  cursor: pointer;
}

#guest-label {
  width: 25px;
  height: 25px;
}

#host-label {
  width: 25px;
  height: 25px;
}

.select-country {
  font-family: 'Roboto';
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: none;
  outline: none;
  padding: 10px 10px 10px 10px;
  background-color: #f2f2f2;
}
</style>

