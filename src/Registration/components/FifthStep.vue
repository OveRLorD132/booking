<template>
  <div class="fifth-step-container">
    <div class="registration-input-container">
      <div class="registration-label type-choose-label">Choose account type</div>
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
      <div class="registration-label description-label">Tell us more about yourself
        <img v-if="type === 'Guest'" @mouseover="showHover" @mouseleave="hideHover" class="optional" src="/images/optional.png">
        <Transition name="hover-show">
          <div v-if="isHovered" style="right: -310px;" class="optional-text">This field is optional for guest accounts.</div>
        </Transition>
      </div>
      <textarea class="register-input description-input" v-model="description"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let emits = defineEmits({
  'type-input': null
})

let type = ref('Guest');

watch(type, () => {
  emits('type-input', type.value);
})

let isHovered = ref(false);

function showHover() {
  isHovered.value = true;
}

function  hideHover() {
  isHovered.value = false;
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
</style>

