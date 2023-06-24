<template>
  <div class="list-cont">
    <div class="conv-label">My Conversations</div>
    <div class="conversation-room" v-for="conversation in conversations" @click="chooseConversation(conversation)" :style="{
      borderColor: hoveredConversation === conversation ? '#FF2F69' : 'white',
      backgroundColor: hoveredConversation === conversation ? '#efebef' : ''
    }" @mouseover="hoverConv(conversation)" @mouseleave="leaveConv">
      <div class="conv-name-top">
        <div v-if="editingConv !== conversation">
          {{ conversation.name ? conversation.name : conversation.user1_id !== user.id ? conversation.user1_name :
            conversation.user2_name }}
        </div>
        <form v-else @submit.prevent="editConversation">
          <input type="text" class="conv-edited-name" placeholder="Enter name ..." v-model="editedConversationName" />
        </form>
        <img @click.stop="startEdit(conversation)" class="conv-name-edit" v-if="hoveredConversation === conversation"
        src="/images/rent-edit.png" />
      </div>
      <div class="edit-error" v-if="editError && editError.src === conversation">{{ editError.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
  conversations: Array,
  user: Object,
  socket: Object
})

let emits = defineEmits({
  'conversation-pick': null,
})

let hoveredConversation = ref(null);

function hoverConv(conversation) {
  hoveredConversation.value = conversation;
}

function leaveConv() {
  hoveredConversation.value = '';
}

function chooseConversation(conversation) {
  emits('conversation-pick', conversation)
}

let editedConversationName = ref(null);

let editingConv = ref(null);

function startEdit(conversation) {
  if(editingConv.value === conversation) editingConv.value = null;
  else editingConv.value = conversation;
  editedConversationName.value = null;
  editError.value = null;
}

let editError = ref(null);

function editConversation() {
  if ( editedConversationName.value && editedConversationName.value.length > 20) editError.value = { 
    text: 'Name must be maximum 20 symbols', 
    src: editingConv.value 
  };
  if (editError.value) return;
  props.socket.emit('conversation-name-change', { name: editedConversationName.value, id: editingConv.value.id})
  editingConv.value = null;
  editedConversationName.value = null;
  editError.value = null;
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.list-cont {
  width: 300px;
  height: 100%;
  border-right: 0.5px solid $border-grey;
}

.conv-label {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  padding: 20px 20px 20px 20px;
}

.conversation-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  padding: 10px 10px 10px 25px;
  border-left: 4px solid;
  cursor: pointer;
}

.conv-name-top {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.conv-name-edit {
  width: 20px;
  height: 20px;
}

.conv-edited-name {
  width: 150px;
  font-size: 16px;
  border: none;
  outline: none;
  background-color: transparent;
}

.edit-error {
  font-size: 16px;
  color: $error-red;
}
</style>