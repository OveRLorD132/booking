<template>
  <div class="for-host-cont" v-if="user && rent.user_id == user.id">
    for host
  </div>
  <ForGuest v-else :rent="rent" :user="user"/>
</template>

<script setup>
import ForGuest from './ForGuest.vue';

import { ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

let props = defineProps({
    user: {type: Object, required: true},
    rent: {type: Object, required: true}
})

let route = useRoute();


console.log(props);
</script>

<style lang="scss">

</style>