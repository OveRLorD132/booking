<template>
  <UpperLine @user-profile="setProfile" />
  <div class="main-container">
    <div class="complains-cont">
      <h1>Users Complains</h1>
      <div class="complaint" v-for="complaint in complains">
        <div class="complaint-reason">{{ complaint.reason }}</div>
        <div class="complaint-text">{{ complaint.text }}</div>
        <div class="complaint-info">
          <div class="complaint-user-name">{{ complaint.username }}</div>
          <div class="complaint-date">{{ formatJoinDate(new Date(complaint.date)) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import formatJoinDate from '../Rent/module/format-join-date';

import axios from 'axios';
import { ref } from 'vue';
import UpperLine from '../Profile/components/UpperLine.vue';

let user = ref(null);

function setProfile(profile) {
  user.value = profile;
}

let complains = ref([]);

axios.get('/complains/load').then(({ data }) => {
  complains.value = data;
})

</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.main-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.complaint {
  width: 600px;
}

.complaint-reason {
  font-size: 24px;
  font-weight: 600;
}

.complaint-text {
  flex-wrap: wrap;
  font-size: 18px;
}

.complaint-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.complaint-user-name {
  color: $description-grey;
}

.complaint-date {
  color: $description-grey;
}
</style>