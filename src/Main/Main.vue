<template>
    <LineComponent @load-profile="loadProfile"/>
    <div class="mainContainer">
        <RentComponent v-for="rent in rentList" @to-wish="onToWish" @remove-wish="onRemoveWish" :rent="rent" :key="rent.id" :user="user"/> 
    </div>
</template>

<script setup>
import io from 'socket.io-client';
import axios from 'axios';
let socket = io();
import Rent from './module/Rent';
import RentComponent from './components/RentComponent.vue';
import LineComponent from '../components/LineComponent.vue';

import { ref } from 'vue';

socket = ref(socket);

let user = ref(null);

let loadProfile = (userObj) => {
    user.value = userObj;
}

let rentList = ref([]);

socket.value.on('load-list', (list) => {
    for(let rent of list) {
        rent = new Rent(rent);
        rentList.value.push(rent);
    }
    console.log(rentList);
})

async function onToWish(id) {
    try {
        await axios.patch('/booking/to-wish', {id: id, user_id: user.value.id});
        user.value.wishlist.push(+id);
        console.log(user)
    } catch(err) {
        console.error(err);
    }
}

async function onRemoveWish(id) {
    try {
        await axios.patch('/booking/remove-wish', {id: id, user_id: user.value.id});
        for(let i = 0; i < user.value.wishlist.length; i++) {
            if(user.value.wishlist[i] == id) user.value.wishlist.splice(i, 1);
        }
        console.log(user)
    } catch(err) {
        console.error(err);
    }
}
</script>

<style scoped lang="scss"> 
.mainContainer {
    padding-top: 70px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>