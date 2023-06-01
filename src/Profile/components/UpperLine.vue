<template>
    <div class="lineMainContainer">
        <div class="line">
            <div class="leftSide">
                <div class="leftSideElem"><a class="upperLineLinks" href="/booking">Booking</a></div>
            </div>
            <div class="rightSide">
                <div class="rightSideElem wishlistButton" @click="showWishlist" id="wishlistButton">
                    <div>Wishlist</div>
                </div>
                <img class="rightSideElem notificationsImage" src="/images/notifications.png" />
                <img class="rightSideElem profileImage" src="/images/no-avatar.png" />
            </div>
        </div>
        <ShortWishlist v-if="wishlistIsVisible" @wish-deleted="onWishDeleted" :profile="profile"/>
    </div>
</template>

<script setup>
import axios from 'axios';

import ShortWishlist from './ShortWishlist.vue';
import { ref } from 'vue';

let profile = ref(null);

let emits = defineEmits({
    'user-profile': null,
    'wish-deleted': null
})

try {
    axios.get('/booking/user-profile').then(({ data }) => {
        data.join_date = formatDate(data.join_date);
        data.birth_date = formatDate(data.birth_date);
        profile.value = data;
        emits('user-profile', data);
    })
} catch(err) {
    console.error(err);
}

function formatDate(date) {
    let dateArray = [];
    date = new Date(date);
    dateArray[0] = date.getUTCDate();
    dateArray[1] = date.getUTCMonth() + 1;
    dateArray[1] = dateArray[1] < 10 ? '0' + dateArray[1] : dateArray[1];
    dateArray[2] = date.getUTCFullYear();
    return dateArray.join('.');
}

let wishlistIsVisible = ref(false);

function showWishlist() {
    wishlistIsVisible.value = !wishlistIsVisible.value;   
}

function onWishDeleted(id) {
    emits('wish-deleted', id);
}

document.addEventListener('click', (event) => {
    let wishlistContainer  = document.getElementById('shortWishlistContainer');
    let button = document.getElementById('wishlistButton');
  if((wishlistContainer && wishlistContainer.contains(event.target)) || button.contains(event.target)) return;
  wishlistIsVisible.value = false;
})
</script>

<style lang="scss">
.lineMainContainer {
    position: sticky;
    z-index: 1;
    width: 100%;
    top:0;
    background-color: #ffffff;
}

.line {
    height: 35px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding: 15px 15px 15px 15px;
    border-bottom: .5px solid #d1d1d1;
}

.rightSide {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.upperLineLinks {
    text-decoration: none;
    color: black;
}

.upperLineLinks:hover {
    text-decoration: underline;
}

.rightSideElem {
    cursor: pointer;
    margin-right: 20px;
}

.rightSideElem:hover {
    text-decoration: underline;
}

.notificationsImage {
    width: 25px;
    height: 25px;
}

.profileImage {
    width: 35px;
    height: 35px;
    border-radius: 50%;
}
</style>