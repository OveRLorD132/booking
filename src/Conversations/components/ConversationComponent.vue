<template>
  <div class="conversation-container" v-if="conversation">
    <div class="messages-container" ref="messagesCont">
      <div class="conv-user-info">
        <img class="conv-user-avatar" src="/images/no-avatar.png" />
        <div class="conv-right-info">
          <div class="conv-user-name">
            {{ conversation.user1_id != user.id ? conversation.user1_name : conversation.user2_name }}
          </div>
          <div class="online-label">
            <img class="online-img" :src="isOnline ? '/images/online.png' : '/images/offline.png'" />
            {{ isOnline ? 'Online' : 'Offline' }}
          </div>
        </div>
      </div>
      <MessageComponent v-for="message in messages" @message-changed="changeMessage" :message="message" :user="user"
        :socket="socket" @scroll="handleRead(message)" />
      <div class="message-input-cont">
        <form @submit.prevent="sendMessage">
          <input placeholder="Type a message ..." class="message-input" type="text" v-model="newMessage" />
        </form>
        <img class="send-btn" src="/images/send.png" @click="sendMessage" />
      </div>
    </div>
  </div>
  <div style="width: 100%;" v-else></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

let messages = ref([]);

let messagesCont = ref();

import MessageComponent from './MessageComponent.vue';

let props = defineProps({
  user: Object,
  conversation: Object,
  socket: Object
})

onMounted(() => {
  props.socket.emit('online')
})

let isOnline = ref(false);

props.socket.on('user-online', (id) => {
  if (!id) isOnline.value = false;
  if (id && props.user.id != id) isOnline.value = true;
})

props.socket.on('user-disconnect', (id) => {
  if (props.user.id != id) isOnline.value = false;
})

props.socket.on('message-load-result', (data) => {
  data = data.sort((val1, val2) => new Date(val1.date) - new Date(val2.date));
  messages.value = data;
  setTimeout(() => {
    messagesCont.value.scrollTop = messagesCont.value.scrollHeight;
  }, 100)
})

props.socket.on('conversation-message-input', (data) => {
  messages.value.push(data);
  setTimeout(() => {
    messagesCont.value.scrollTop = messagesCont.value.scrollHeight;
  }, 100)
})

props.socket.on('message-change-result', (message) => {
  for (let m of messages.value) {
    if (message.id === m.id) m.text = message.text;
  }
})

let newMessage = ref(null);

function sendMessage() {
  if (!newMessage.value) return;
  props.socket.emit('conversation-message', newMessage.value);
  newMessage.value = null;
}

if (props.conversation) props.socket.emit('messages-load', props.conversation.id);

watch(() => props.conversation, () => {
  props.socket.emit('is-online', props.conversation.user1_id !== props.user.id ? props.conversation.user1_id : props.conversation.user2_id);
  props.socket.emit('messages-load', props.conversation.id)
})


function changeMessage(message) {
  props.socket.emit('message-changed', message);
}
</script>

<style lang="scss">
@import '../../../public//stylesheets/colors.scss';

.conversation-container {
  width: 100%;
  position: relative;
}

.messages-container {
  height: calc(100vh - 230px);
  overflow-y: auto;
  margin-bottom: 60px;
  margin-top: 90px;
  display: flex;
  flex-direction: column;
}


.message-input-cont {
  display: flex;
  align-items: center;
  border-top: .5px solid $border-grey;
  width: 100%;
  position: absolute;
  background-color: #FFF;
  bottom: 0;
}

.message-input {
  width: 600px;
  margin: 10px 10px 10px 10px;
  padding: 5px 5px 5px 5px;
  border-radius: 10px;
  border: 3px solid $calendar-grey;
  font-size: 16px;
  height: 30px;
  font-family: 'Roboto';
}

.send-btn {
  background-color: $button-red;
  padding: 5px 5px 5px 5px;
  cursor: pointer;
  margin: 0 10px 0 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.conv-user-info {
  background-color: #FFF;
  position: absolute;
  top: 0;
  width: 100%;
  padding: 10px 0 10px 0;
  align-items: center;
  display: flex;
  flex-direction: row;
  border-bottom: .5px solid $border-grey;
}

.conv-right-info {
  padding-left: 10px;
}

.conv-user-name {
  cursor: pointer;
  font-size: 22px;
  font-weight: 700;
}

.conv-user-name:hover {
  text-decoration: underline;
}

.conv-user-avatar {
  padding-left: 10px;
  border-radius: 50%;
  width: 65px;
  height: 65px;
}

.online-label {
  display: flex;
  align-items: center;
}

.online-img {
  width: 18px;
  height: 18px;
  padding-right: 3px;
}
</style>