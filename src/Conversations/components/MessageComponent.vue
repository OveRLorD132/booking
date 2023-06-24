<template>
  <div class="message" ref="messageElem" :key="message.id" :class="message.user_id === user.id ? 'your-msg' : 'other-msg'"
    @mouseover="showHover" @mouseleave="hideHover">
    <div class="msg-text" v-if="!isEditing">{{ message.text }}</div>
    <input type="text" class="msg-edit" v-model="editedMessage" v-else/>
    <div class="msg-time" v-if="!hoverIsVisible && !isEditing">{{ setTime(new Date(message.date)) }}</div>
    <img class="edit-btn" src="/images/rent-edit.png" @click="startEdit" v-else>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
  message: Object,
  user: Object,
  socket: Object
})
let emits = defineEmits({
  'message-changed': null
})

let editedMessage = ref(props.message.text);

let hoverIsVisible = ref(null);

function showHover() {
  if(props.user.id === props.message.user_id) hoverIsVisible.value = true;
}

function hideHover() {
  if(!hoverIsVisible.value) return;
  hoverIsVisible.value = false;
}

let messageElem = ref();

let isEditing = ref(null);

function startEdit() {
  messageElem.value.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && 
    editedMessage.value !== props.message.text) {
      emits('message-changed', {id: props.message.id, text: editedMessage.value});
      isEditing.value = false;
    }
  })
  isEditing.value = !isEditing.value;
}

function setTime(date) {
  let hours = date.getHours();
  if(hours < 10) hours = '0' + hours;
  let minutes = date.getMinutes();
  if(minutes < 10) minutes = '0' + minutes;
  return `${hours}:${minutes}`
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.message {
  display: flex;
  flex-direction: row;
  margin: 10px 10px 10px 10px;
  width: max-content;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  border-radius: 10px;
  background-color: $calendar-grey;
}

.your-msg {
  background-color: $message-back;
  align-self: flex-end;
}

.msg-time {
  margin-left: 5px;
  font-size: 16px;
  color: $active-grey;
}

.msg-edit {
  outline: none;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-family: 'Roboto';
}

.edit-btn {
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
}
</style>