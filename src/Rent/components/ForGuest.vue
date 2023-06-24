<template>
  <div class="main-cont" v-if="rent">
    <div class="profile-cont">
      <img class="user-img" src="/images/no-avatar.png"/>
      <div class="short-info">
        <div class="name-lbl">{{ rent.first_name }}</div>
        <div class="date-lbl">{{ 'Joined' + formatJoinDate(rent.join_date)}}</div>
      </div>
    </div>
    <h2>Description</h2>
    <div class="description">{{ rent.user_description }}</div>
    <h2>Have any questions? You can ask host</h2>
      <template v-if="!conversation">
        <textarea class="question-input" v-model="question"></textarea>
        <div @click="submitMessage" class="send-btn-desc">Send message</div>
      </template>
      <div class="conv-container">
        <ConversationComponent :user="user" :conversation="conversation" v-if="conversation"/>
      </div>
      <div class="conv-link"><a class="btn-link" href="/conversations">To Conversations</a></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import ConversationComponent from '../../Conversations/components/ConversationComponent.vue';

import formatJoinDate from '../module/format-join-date';

import { io } from 'socket.io-client';
import axios from 'axios';

let socket = io();

let props = defineProps({
  rent: Object,
  user: Object
})

let question = ref(null);

function submitMessage() {
  socket.emit('new-message', {text: question.value, receiver_id: props.rent.user_id})
}

let conversation = ref(null);

socket.emit('conv-check', props.rent.user_id);

watch(() => props.rent, (newVal) => {
  if (newVal) socket.emit('conv-check', props.rent.user_id);
})

socket.on('conv-check-result', (result) => {
  conversation.value = result;
})

</script>

<style lang="scss" scoped>
@import '../../../public/stylesheets/colors.scss';

.main-cont {
  margin: 100px 200px 100px 200px;
}

.profile-cont {
  display: flex;
  flex-direction: row;

}

.user-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
}

.name-lbl {
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: 600;
}

.date-lbl {
  color: $description-grey;
}

.description {
  font-size: 18px;
  margin-top: 20px;
  max-width: 500px;
}

.question-input {
  padding: 10px 10px 10px 10px;
  height: 200px;
  width: 400px;
  border-radius: 10px;
  border: 4px solid $input-back;
}

.send-btn-desc {
  margin-top: 10px;
  cursor: pointer;
  width: 170px;
  text-align: center;
  border: 2px black solid;
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 500;
}

.send-btn-desc:hover{
  background-color: $calendar-grey;
}


.conv-container {
  border: .5px solid #d1d1d1;
}

.conv-link {
  cursor: pointer;
  width: max-content;
  font-size: 18px;
  padding: 15px 15px 15px 15px;
  margin: 10px 10px 10px 0;
  border-radius: 10px;
  background-color: $button-red;
}

.conv-link:hover {
  background-color: $button-hover-red;
}

.btn-link {
  color: #ffffff;
  text-decoration: none;
}
</style>