<template>
    <LineComponent @load-profile="loadProfile"/>
    <RentInput :style="{'display': 'none'}" :socket="socket" :user-id="user ? user.id : null"/>
    <div class="mainContainer">
        <RentComponent v-for="rent in rentList" :rent="rent" :key="rent.id" /> 
    </div>
</template>

<script setup>
import io from 'socket.io-client';
let socket = io();
import Rent from './module/Rent';
import RentComponent from './components/RentComponent.vue';
import RentInput from './components/RentInput.vue';
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
</script>

<style scoped lang="scss"> 
.mainContainer {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 10px;
}
</style>