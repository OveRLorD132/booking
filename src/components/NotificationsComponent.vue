<template>
  <div class="notifications-container" id="notifications-container">
    <template v-if="notifications">
      <div class="notification" v-for="notification of notifications">
        <img class="notification-image"
          :style="{ backgroundColor: notification.type === 'complaint-receive' ? '#ffcd2a' : '#0ba60b'}"
          :src="notification.type === 'complaint-receive' ? '/images/warn.png' : '/images/accept.png'" />
        <div class="notification-right">
          <div class="notification-header">{{ notification.header }}</div>
          <div class="notification-text">{{ notification.type === 'complaint-receive' ? 'You have received a complaint. ' :
            '' + notification.text }}</div>
        </div>
      </div>
    </template>
    <div v-else class="empty-lbl">You don't have notifications</div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client';

import { ref } from 'vue';

let props = defineProps({
  user: Object,
})

let socket = io();

socket.emit('online');

socket.emit('notifications-load-request');

let notifications = ref([]);

socket.on('notifications-load-result', (messages) => {
  notifications.value = messages;
});

socket.on('new-notification', (message) => {notifications.value.push(message); console.log(message)})
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.notifications-container {
  max-width: 250px;
  flex-wrap: wrap;
  display: flex;
  position: absolute;
  right: 0;
  background-color: #ffffff;
  box-shadow: -2px 2px 7px -3px rgba(0, 0, 0, 0.75);
}

.notification {
  padding: 10px 10px 10px 10px;
  max-width: 250px;
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid $calendar-grey;
}

.notification-image {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  padding: 5px;
  margin-right: 5px;
}

.notification-right {
  max-width: 175px;
}

.notification-header {
  font-size: 20px;
  font-weight: 600;
}

.notification-text {
  font-size: 12px;
}

.empty-lbl {
  font-size: 18px;
  padding: 10px;
}
</style>