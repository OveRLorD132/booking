<template>
  <Teleport to="#modalContainer">
    <DeleteModal v-if="dialogIsVisible" header="Delete message?"
      lowerText="Are you sure you want to delete this message?You could not undo this action." @hide-dialog="hideDialog"
      @submit-delete="deleteMessage" />
  </Teleport>
  <div class="message" ref="messageElem" :key="message.id" :class="message.user_id === user.id ? 'your-msg' : 'other-msg'"
    @mouseover="showHover" @mouseleave="hideHover">
    <div class="msg-text" v-if="!isEditing">{{ message.text }}</div>
    <textarea class="msg-edit" v-model="editedMessage" v-else />
    <div class="msg-info-cont">
      <div class="msg-time" v-if="true">{{ setTime(new Date(message.date)) }}</div>
      <div class="msg-hover-cont" v-if="hoverIsVisible">
        <img class="msg-hover-btn" src="/images/rent-edit.png" @click="startEdit">
        <img class="msg-hover-btn" style="height: 28px; margin-left: -4px; width: 28px;" src="/images/delete-wish.png"
          @click="showDeleteDialog" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DeleteModal from '../../components/DeleteModal.vue';

let props = defineProps({
  message: Object,
  user: Object,
  socket: Object
})
let emits = defineEmits({
  'message-changed': null,
  'message-delete': null
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
  messageElem.value.addEventListener('keypress', submitDelete)
  isEditing.value = !isEditing.value;
}

function submitDelete(e) {
  if(e.key === 'Enter' && 
    editedMessage.value !== props.message.text) {
      emits('message-changed', {id: props.message.id, text: editedMessage.value});
      isEditing.value = false;
      messageElem.value.removeEventListener('keypress', submitDelete);
  }
}

function setTime(date) {
  let hours = date.getHours();
  if(hours < 10) hours = '0' + hours;
  let minutes = date.getMinutes();
  if(minutes < 10) minutes = '0' + minutes;
  return `${hours}:${minutes}`
}

let dialogIsVisible = ref(false);

function showDeleteDialog() {
  dialogIsVisible.value = true;
}

function hideDialog() {
  dialogIsVisible.value = false;
}

function deleteMessage() {
  dialogIsVisible.value = false;
  emits('message-delete', props.message.id);
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.message {
  max-width: 400px;
  word-wrap: break-word;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 10px 10px 10px;
  width: max-content;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  border-radius: 10px;
  background-color: $calendar-grey;
}

.msg-text {
  word-break: break-all;
}

.your-msg {
  background-color: $message-back;
  align-self: flex-end;
}

.msg-time {
  margin-left: 5px;
  color: $active-grey;
}

.msg-edit {
  width: 400px;
  height: 180px;
  resize: vertical;
  outline: none;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-family: 'Roboto';
}

.msg-hover-cont {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
}

.msg-info-cont {
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: row;
  align-self: flex-end;
}

.msg-hover-btn {
  padding: 2px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: $message-back;
}
</style>