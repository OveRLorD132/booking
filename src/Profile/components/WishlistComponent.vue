<template>
  <div class="wishlistContainer" v-if="wishlist">
    <RentComponent v-for="rent in wishlist" :rent="rent" :user="user" @remove-wish="removeWish"/>
  </div>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue';

import RentComponent from '../../components/RentComponent.vue';

let props = defineProps({
  user: Object
})

let emits = defineEmits({
  'remove-wish': (id) => typeof id === 'number',
})

let wishlist = ref(null)

axios.get('/load-wishlist').then(({data}) => {
  console.log(data);
  wishlist.value = data;
})

function removeWish(id) {
  emits('remove-wish', id);
}
</script>

<style lang="scss">
.wishlistContainer {
  display: flex;
  max-width: 800px;
} 
</style>