<template>
  <title>Contact Host</title>
  <div id="modalContainer"></div>
  <div class="main-cont" v-if="rent">
    <div class="profile-cont">
      <img class="user-image" :src="`/profile-images/${rent.user_id}.png`" onerror="this.src=`/images/no-avatar.png`" />
      <div class="short-info">
        <div class="name-lbl"><a class="profile-link" :href="`/public-profile/${rent.user_id}`">{{ rent.first_name }}</a>
        </div>
        <div class="date-lbl">{{ 'Joined' + formatJoinDate(rent.join_date) }}</div>
      </div>
    </div>
    <div class="back-btn"><router-link class="btn-link" style="color: black;" to="/">Back</router-link></div>
    <h2>Description</h2>
    <div class="description">{{ rent.user_description }}</div>
    <template v-if="user && rent && rent.user_id != user.id">
      <h2>Have any questions? You can ask host</h2>
      <template v-if="!conversation">
        <textarea class="question-input" v-model="question"></textarea>
        <div @click="submitMessage" class="send-btn-desc">Send message</div>
      </template>
      <div class="conv-container" v-if="conversation">
        <ConversationComponent :user="user" :conversation="conversation" :socket="socket" />
      </div>
    </template>
    <div class="conv-link"><a class="btn-link" href="/conversations">To Conversations</a></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

import ConversationComponent from '../../Conversations/components/ConversationComponent.vue';

import formatJoinDate from '../module/format-join-date';

import { io } from 'socket.io-client';

let socket = io();

let props = defineProps({
  rent: { type: Object, required: true },
  user: { type: Object, required: true }
})

onMounted(() => {
  if(!props.rent) return;
  socket.emit('conv-check', props.rent.user_id);
})

let question = ref(null);

function submitMessage() {
  socket.emit('new-message', {text: question.value, receiver_id: props.rent.user_id})
}

let conversation = ref(null);


watch(() => props.rent, (newVal) => {
  if (newVal) socket.emit('conv-check', props.rent.user_id);
})

socket.on('conv-check-result', (result) => {
  conversation.value = result;
})

</script>

<style lang="scss">
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
  font-family: 'Roboto';
  font-size: 18px;
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
  position: relative;
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

.conversation-container {
  position: unset;
}

.back-btn {
  padding: 10px 25px 10px 25px;
  border-radius: 10px;
  margin-top: 10px;
  width: max-content;
  font-size: 18px;
  border: 2px solid black;
  cursor: pointer;
  &:hover {
    background-color: $calendar-grey;
  }
}
</style>