<template>
  <div class="main-cont">
    <UpperLine />
    <div class="app-cont">
      <ConversationsList :socket="socket" :user="user" :conversations="conversations" @conversation-pick="showConversation"/>
      <ConversationComponent :socket="socket" :user="user" :conversation="shownConversation"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UpperLine from '../components/UpperLine.vue';

import ConversationsList from './components/ConversationsList.vue';
import ConversationComponent from './components/ConversationComponent.vue';
import axios from 'axios';

import { io } from 'socket.io-client';

let socket = io();

socket.on('name-change-result', (conversation) => {
  for(let c of conversations.value) if(c.id == conversation.id) c.name = conversation.name;
})

let user = ref(null);

let url = new URL(window.location.href);

let params = new URLSearchParams(url.search);

axios.get('/booking/user-profile').then(({ data }) => {
  user.value = data;
})

let conversations = ref(null);

axios.get('/conversations/load').then(({ data }) => {
  conversations.value = data;
  let id = params.get('id');
  for(let conv of conversations.value) {
    if(conv.id == id) shownConversation.value = conv;
  }
})

let shownConversation = ref(null);

function showConversation(conversation) {
  shownConversation.value = conversation;
  params.set('id', conversation.id);
  url.search = params.toString();
  history.replaceState(null, null, url.href);
}
</script>

<style lang="scss">
.main-cont {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-cont {
  flex: 1;
  display: flex;
  flex-direction: row;
}
</style>