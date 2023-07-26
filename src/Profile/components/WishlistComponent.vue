<template>
  <div class="wishlistMainContainer">
    <div class="wishlistContainer" v-if="wishlist">
      <RentComponent v-for="(rent, index) in wishlist" :rent="rent" :user="user" :key="rent.id"
        @remove-wish="removeWish(rent.id, index)" @rent-hide="rentHide" @hide-error="showError"
      />
    </div>
    <div class="wishlistLabel" v-if="!wishlist || !wishlist.length">You haven't added anything to wishlist.</div>
  </div>
</template>

<script setup>
import axios from 'axios';

import { ref, watch } from 'vue';

import RentComponent from '../../components/RentComponent.vue';

let props = defineProps({
  user: Object
})

let emits = defineEmits({
  'remove-wish': (id) => typeof id === 'number',
  'hide-error': null
})

let wishlist = ref(null)

axios.get('/load-wishlist').then(({data}) => {
  wishlist.value = data;
})

watch(props.user.wishlist, (newValue) => {
  for(let wish of wishlist.value) {
    if(newValue.indexOf(+wish.id) === -1) wishlist.value.splice(wishlist.value.indexOf(wish), 1) 
  }
},{deep: true})

async function removeWish(id, index) {
  try {
    await axios.patch('/booking/remove-wish', {id: id, user_id: props.user.id});
    wishlist.value.splice(index, 1);
    emits('remove-wish', id);
  } catch(err) {
    console.error(err);
  }

}

function rentHide(id) {
  for(let wish of wishlist.value) {
    if(wish.id == id) { wish.is_hidden = !wish.is_hidden; break; }
  }
}

function showError() {
  emits('hide-error');
}
</script>

<style lang="scss">
.wishlistContainer {
  flex-wrap: wrap;
  display: flex;
} 

.wishlistLabel {
  font-size: 20px;
}
</style>