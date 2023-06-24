<template>
  <div class="complaint-dialog" @click="closeDialog">
    <div class="complaint-cont" @click.stop>
      <template v-if="step === 1">
        <h1>What is wrong with this ad?</h1>
        <div class="complaint-option" v-for="option in options" @click.stop="chooseOption(option)">
          <div class="option-btn">
            <div class="option-active" :style="{ backgroundColor: chosenOption === option ? '#FF2F69' : '#fff' }" />
          </div>
          <div class="option-text">{{ option }}</div>
        </div>
        <div class="dialog-next-btn" @click="nextStep">Next</div>
      </template>
      <template v-if="step === 2" @click.stop>
        <h1>Add more information</h1>
        <textarea v-model="complaintText" class="complaint-input" />
        <div class="dialog-input-error">{{ complaintError }}</div>
        <div class="dialog-buttons-container">
          <div class="dialog-back-btn" @click="stepBack">Back</div>
          <div class="dialog-next-btn" @click="submitComplain">Submit</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';

import { ref, watch } from 'vue';

let props = defineProps({
  rent: Object
})

let emits = defineEmits({
  'close-dialog': null,
  'complaint-end': null
})

let options = ['Misleading Information', 'Fraudulent Activity', 
'Inappropriate Content', 'Privacy Violation', 'Payment and Refund Issues', 'Other Issues']

function closeDialog() {
  emits('close-dialog');
}

let chosenOption = ref(null);

function chooseOption(option) {
  chosenOption.value = option;
}

let step = ref(1);

function nextStep() {
  if(chosenOption.value) step.value++;
}

function stepBack() {
  step.value--;
}

let complaintText = ref('');

let complaintError = ref(null);

watch(complaintText, (newValue) => {
  if(newValue && newValue.length > 200) complaintError.value = 'This message is too long.';
  else complaintError.value = '';
})

async function submitComplain() {
  if(complaintError.value) return;
  try {
    await axios.post('/rent/new-complain', { reason: chosenOption.value, text: complaintText.value, id: props.rent.id});
    emits('complaint-end');
  } catch(err) {
    emits('complaint-end');
  }

}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';
@import '../../../public/stylesheets/inputs.scss';

.complaint-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  z-index: 100;
  position: fixed;
  background-color: rgb(117, 117, 117, 0.5);
  width: 100%;
  height: 100%;
}

.complaint-cont {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 20px 20px 20px;
}

.complaint-option {
  margin: 10px 10px 10px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.option-btn {
  margin-right: 5px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border: .1px solid black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-text {
  font-size: 18px;
}

.option-active {
  background-color: $button-red;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

@mixin dialog-button {
  cursor: pointer;
  border-radius: 10px;
  border: none;
  font-family: 'Roboto';
  width: min-content;
  padding:10px 10px 10px 10px;
  font-size: 18px;
}

.dialog-next-btn {
  @include dialog-button;
  background-color: $button-red;
  color: #ffffff;
}

.dialog-next-btn:hover {
  background-color: $button-hover-red;
}

.dialog-back-btn {
  @include dialog-button;
  border: 1px solid black;
}

.dialog-back-btn:hover {
  background-color: $calendar-grey;
}

.complaint-input {
  font-size: 18px;
  font-family: 'Roboto';
  resize: vertical;
  padding: 10px 10px 10px 10px;
  height: 200px;
  width: 400px;
  border-radius: 10px;
  border: 4px solid $input-back;
}

.dialog-buttons-container {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dialog-input-error {
  color: $error-red;
}
</style>