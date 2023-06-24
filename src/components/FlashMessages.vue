<template>
  <div class="messageContainer">
    <transition-group name="flash-show">
      <div class="flashMessage successMessage" v-for="message in success">
        <img class="flashImage" src="/images/success.png" />
        <div class="flashInfoContainer">
          <div class="flashLabel">Success</div>
          <div class="successInfo">{{ message }}</div>
        </div>
      </div>
    </transition-group>
    <div class="flashMessage errorMessage" v-for="message in errors">
      <img class="flashImage" src="/images/error.png" />
      <div class="flashInfoContainer">
        <div class="flashLabel">Error</div>
        <div class="successInfo">{{ message }}</div>
      </div>
    </div>
    <div class="flashMessage infoMessage" v-for="message in info">
      <img class="flashImage" src="/images/info.png" />
      <div class="flashInfoContainer">
        <div class="flashLabel">Info</div>
        <div class="successInfo">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let props = defineProps({
  messages: Object
})

let errors = ref([]);

let success = ref([]);

let info = ref([]);

watch(props, (newProp) => {
  console.log(newProp);
  if(newProp.messages) {
    if (newProp.messages.error) {
      for (let message of newProp.messages.error) {
        errors.value.push(message);
      }
    }
    if (newProp.messages.success) {
      for (let message of newProp.messages.success) {
        success.value.push(message);
      }
    }
    if (newProp.messages.info) {
      for (let message of newProp.messages.info) {
        info.value.push(message);
      }
    }
    if(errors.value && errors.value.length) {
      for(let i = 0; i < errors.value.length; i++) {
        setTimeout(errors.value.splice(i, 1), 10000);
      }
    }
    if(success.value && success.value.length) {
      for(let i = 0; i < success.value.length; i++) {
        setTimeout(() => success.value.splice(i, 1), 10000);
      }
    }
    if(info.value && info.value.length) {
      for(let i = 0; i < info.value.length; i++) {
        setTimeout(info.value.splice(i, 1), 10000);
      }
    }
  }
})
</script>

<style lang="scss">
.messageContainer {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 200;
  top: 65px;
  right: 0;
}

.flashMessage {
  background-color: #fff;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  padding: 20px 20px 20px 20px;
  box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.75);
}

.successMessage {
  border-left: 5px solid #00ef00;
}

.errorMessage {
  border-left: 5px solid #d72828;
}

.infoMessage {
  border-left: 5px solid #2e57dc;
}

.flashImage {
  height: 35px;
  width: 35px;
  border-radius: 50%;
}

.flashInfoContainer {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;
}

.flashLabel {
  font-weight: bold;
  font-size: 16px;
}


.flash-show-enter-active {
  transition: all 1s ease;
}

.flash-show-leave-active {
  transition: all 1s ease;
}

.flash-show-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.flash-show-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

</style>