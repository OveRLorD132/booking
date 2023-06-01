<template>
  <div class="switchButton" :class="isSwitched ? 'switchOn' : ''" @click="switchButton"></div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
  isButtonSwitched: Boolean
})

let isSwitched = ref(props.isButtonSwitched);


let emits = defineEmits({
  'button-switched': (bool) => typeof bool === 'boolean' 
})

function switchButton() {
  isSwitched.value = !isSwitched.value;
  emits('button-switched', isSwitched.value)
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.switchButton {
  display: inline-block;
  width: 64px;
  height: 35px;
  border-radius: 16px;
  background: #bfbfbf;
  z-index: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.switchButton::after {
  content: "";
  border-radius: 50%;
  height: 29px;
  width: 29px;
  background: #ffffff;
  top: 3px;
  left: 2px;
  transition: all .3s;
  position: absolute;
  z-index: 1;
}

.switchOn {
  background: $button-red;
}

.switchOn::after {
  left: 33px;
}
</style>