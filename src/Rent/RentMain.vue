<template>
  <UpperLine @user-profile="loadProfile" />
  <div>
    <RouterView :user="user" :rent="rent" v-if="rent !== 'Not found'"/>
    <Error404 v-else />
  </div>
</template>

<script setup>
import axios from 'axios';

import UpperLine from '../components/UpperLine.vue';

import { ref } from 'vue';
import Error404 from '../ErrorPage/Error404.vue';

let user = ref(null);

let rent = ref(null);

let loadProfile = (profile) => {
  user.value = profile;
}

axios.get(`${window.location.pathname}/rent`).then(({ data }) => {
  rent.value = data;
  if(!data) rent.value = 'Not found';
  rent.value.address = JSON.parse(data.address);
  let rating = +rent.value.rating;
  rent.value.rating = rating.toFixed(2);
});
</script>

<style lang="scss">

</style>