<template>
  <div class="bottom-line">
    <div class="progress-line">
      <div class="step-progress" :style="{backgroundColor: step > 1 ? 'black' : ''}"/>
      <div class="step-progress" :style="{backgroundColor: step > 2 ? 'black' : ''}"/>
      <div class="step-progress" :style="{backgroundColor: step > 3 ? 'black' : ''}"/>
      <div class="step-progress" :style="{backgroundColor: step > 4 ? 'black' : ''}"/>
      <div class="step-progress" :style="{backgroundColor: step > 5 ? 'black' : ''}"/>
    </div>
    <div class="buttons">
      <div class="bottom-button back-button" @click="stepBack">Back</div>
      <div class="bottom-button next-button" @click="stepNext" v-if="step !== 6">{{ step === 5 ? 'Finish' :'Next'}}</div>
    </div>
  </div>
</template>

<script setup>
let props = defineProps({
  step: Number
})

let emits = defineEmits({
  'step-next': null,
  'step-back': null
})

function stepBack() {
  emits('step-back');
}

function stepNext() {
  emits('step-next');
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';
.bottom-line {
  width: 100%;
  position: fixed;
  bottom: 0;
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background-color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
}
.bottom-button {
  font-size: 16px;
  padding: 13px 18px 13px 18px;
  border-radius: 10px;
  cursor: pointer;
  &.back-button {
    border: 2px solid black;
  }
  &.next-button {
    background-color: $button-red;
    color: #ffffff;
  }
}


.progress-line {
  height: 5px;
  display: flex;
  flex-direction: row;
}
.step-progress {
  flex: 1;
  background-color: $progress-grey;
}
</style>