<template>
    <UpperLine/>
    <FlashMessages :messages="flashMessages"/>
    <div class="mainContainer">
        <FirstStep @first-name-input="setFirstName" @last-name-input="setLastName" v-show="step === 1"/>
        <SecondStep @username-input="setUsername" @email-input="setEmail" v-show="step === 2"/>
        <ThirdStep @password-input="setPassword" @confirm-input="setComfirm" v-show="step === 3"/>
        <FourthStep @date-input="setDate" @phone-input="setPhoneNumber" @gender-input="setGender" v-show="step === 4"/>
        <FifthStep @type-input="setType" @country-input="setCountry" @description-input="setDecription" :date="date" v-show="step === 5"/>
        <SixthStep v-show="step === 6"/>
    </div>
    <BottomLine v-if="step < 6" :step="step" @step-back="stepBack" @step-next="stepNext"/>
</template>

<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import UpperLine from '../components/UpperLine.vue';
import FlashMessages from '../components/FlashMessages.vue';
import BottomLine from '../components/BottomLine.vue';

import FirstStep from './components/FirstStep.vue';
import SecondStep from './components/SecondStep.vue';
import ThirdStep from './components/ThirdStep.vue';
import FourthStep from './components/FourthStep.vue';
import FifthStep from './components/FifthStep.vue';
import SixthStep from './components/SixthStep.vue';

let flashMessages = ref([]);

let step = ref(6);

let first_name = ref(null);

function setFirstName(name) {
    first_name.value = name;
}

let last_name = ref(null);

function setLastName(name) {
    last_name.value = name;
}

let username = ref(null);

function setUsername(name) {
    username.value = name;
}

let email = ref(null);

function setEmail(value) {
    email.value = value;
}

let password = ref(null);

function setPassword(pass) {
    password.value = pass;
}

let passwordConfirm = ref(null);

function setComfirm(confirm) {
    passwordConfirm.value = confirm;
}

let date = ref(null);

function setDate(newDate) {
    date.value = newDate;
}

let phone = ref(null);

function setPhoneNumber(num) {
    phone.value = num;
}

let gender = ref(null);

function setGender(value) {
    gender.value = value;
}

let type = ref('Guest');

function setType(value) {
    type.value = value;
}

let country = ref('--Select country--');

function setCountry(value) {
    country.value = value;
}

let description = ref(null);

function setDecription(value) {
    description.value = value;
}

async function stepNext() {
    switch(step.value) {
        case 1:
            if(last_name.value && first_name.value) step.value++;
            break;
        case 2:
            if(!username.value || !email.value) return;
            try {
                let { data } = await axios.post('/registration/unique-check', {username: username.value, email: email.value});
                step.value++;
            } catch(err) {
                if(err.response.status === 400) axios.get('/flash-messages').then(({ data }) => flashMessages.value = data);
                else console.error(err);
            }
            break;
        case 3:
            if(!password.value || !passwordConfirm.value) return;
            if(password.value === passwordConfirm.value) step.value++;
            break;
        case 4: 
            if(date.value !== 'Invalid' && gender.value !== 'Invalid' && phone.value !== 'Invalid') step.value++;
            break;
        case 5:
            if(type.value === 'Host') {
                if(!description.value || description.value === 'Invalid') return;
            }
            if(description.value === 'Invalid') return;
            else {
                let registrationObject = {
                    first_name: first_name.value,
                    last_name: last_name.value,
                    username: username.value,
                    email: email.value,
                    password: password.value,
                    gender: gender.value,
                    phone: phone.value,
                    birth_date: date.value,
                    type: type.value,
                    country: country.value,
                    description: description.value
                }
                try {
                    let result = await axios.post('/registration', registrationObject);
                    step.value++;
                } catch(err) {
                    console.log(err);
                    flashMessages.value = await axios.get('/flash-messages');
                }
            }
            break;
        default:
            break;
    }
}

function stepBack() {
    if(step.value > 0) step.value--;
}

</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';
.mainContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 75px);
    width: 100%;
}
.registrationForm {
    align-items: center;
    display: flex;
    flex-direction: column;
}

.registration-error {
    color: $error-red;
    font-size: 16px;
    line-height: 1.5;
    align-self: flex-start;
}

input[type="submit"] {
    width: 200px;
    cursor: pointer;
    background-color: $button-red;
    margin: 10px 10px 10px 10px;
    border: none;
    border-radius: 10px;
    color: #ffffff;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 18px;
}

.registration-input-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.register-input {
  font-family: 'Roboto';
  font-size: 16px;
  padding: 15px 10px 15px 10px;
  margin: 10px 0 10px 0;
  border-radius: 5px;
  width: 400px;
  border: 3px $input-back solid;
  outline-color: $button-red;
  &.description-input {
    width: 400px;
    height: 150px;
    resize: vertical;
    border-radius: 10px;
  }
  &.description-input:focus {
    color: black;
  }
}

.registration-input-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 5px;
}

.optional {
  width: 15px;
  height: 15px;
  position: absolute;
  right: 5px;
  cursor: pointer;
}

.optional-text {
  position: absolute;
  font-size: 16px;
  padding: 10px 10px 10px 10px;
  box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.75);
}

.register-input:focus {
    color: $button-red;
}

.registration-label {
    width: 425px;
    display: flex;
    align-items: center;
    position: relative;
  font-size: 24px;
  &.description-label {
        display: flex;
        align-items: center;
        width: 400px;
    }
}


.registrationRow {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.hover-show-leave-to {
  opacity: 0;
}

.hover-show-enter-from {
  opacity: 0;
}

.hover-show-enter-active {
  transition: all .3s;
}

.hover-show-leave-active {
  transition: all .3s;
}
</style>