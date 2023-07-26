<template>
  <div class="shortWishlistContainer" id="shortWishlistContainer">
    <template v-if="shortWishlist.length > 0">
      <div class="wish" v-for="(rent, index) in shortWishlist" @mouseover="showDelete(rent)" @mouseleave="hideDelete">
        <div class="wishLeft">
          <img class="wishImage" :src="`/rent-photos/${rent.id}/0.png`" />
        </div>
        <div class="wishRight">
          <div class=wishTitle><a class="wishLink" :href="`/booking/rent/${rent.id}`">{{ rent.header }}</a></div>
          <div class="wishHost">Rent by {{ rent.first_name}}</div>
          <div class="wishPrice">{{ rent.price }}$ per day</div>
        </div>
        <div class="wishDeleteCont" v-show="hoveredWish === rent" @click="deleteWish(rent, index)">
          <img class="wishDelete" src="/images/delete.png" />
        </div>
      </div>
    </template>
    <div v-if="shortWishlist.length === 0">You haven't added anyting to wishlist.</div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';

let props = defineProps({
  profile: {type: Object, required: true}
})

let emits = defineEmits({
  'wish-deleted': null
})

let shortWishlist = ref([]);

axios.get('/short-wishlist').then(({ data }) => {
  shortWishlist.value = data;
})

let hoveredWish = ref(null);

function showDelete(rent) {
  hoveredWish.value = rent;
}

function hideDelete() {
  hoveredWish.value = "";
}

watch(props.profile.wishlist, (newValue) => {
  for (let wish of shortWishlist.value) {
    if (newValue.indexOf(+wish.id) === -1) shortWishlist.value.splice(shortWishlist.value.indexOf(wish), 1)
  }
}, { deep: true })


async function deleteWish(rent, index) {
  try {
    await axios.patch('/booking/remove-wish', {id: rent.id, user_id: props.profile.id});
    shortWishlist.value.splice(index, 1);
    emits('wish-deleted', rent.id);
  } catch (err) {
    console.error(err)
  }
} 

</script>

<style lang="scss">
@mixin ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shortWishlistContainer {
  max-height: 300px;
  position: absolute;
  background-color: #ffffff;
  overflow-x: hidden;
  display: flex;
  flex-wrap: wrap;
  right: 0;
  width: 230px;
  padding: 10px 10px 10px 10px;
  box-shadow: -2px 2px 7px -3px rgba(0, 0, 0, 0.75);
}

.wish {
  position: relative;
  @include ellipsis;
  display: flex;
  flex-direction: row;
  width: 100%;
}

.wishTitle {
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  text-decoration: none;
}

.wishTitle:hover {
  text-decoration: underline;
}

.wishHost {
  @include ellipsis;
  color: #828282;
}

.wishPrice {
  @include ellipsis;
  font-weight: bold;
}

.wishLink {
  text-decoration: none !important;
  color: black;
}

.wishImage {
  @include ellipsis;
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.wishDeleteCont {
  width: 40px;
  height: 100%;
  position: absolute;
  background-color: #ffffff;
  right: 0;
  display: flex;
  align-items: center;
}

.wishDelete {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>