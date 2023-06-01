<template>
    <UpperLine @user-profile="loadProfile"/>
    <div class="filter-line">
            <div class="filter-component" v-for="component of filterComponents" 
              :style="{ borderBottomColor: component === chosenFilter ? 'black' 
              : component === hoveredComponent ? '#d1d1d1' : '#ffffff'}" 
              @mouseover="componentHover(component)" @mouseleave="componentLeave"
              @click="chooseFilter(component)"
            >
                <img class="component-image" :src="`/images/${component.toLowerCase()}.png`"/>
                <div class="component-text">{{ component }}</div>
            </div>
        </div>
    <div class="mainContainer">
        <RentComponent v-for="rent in filteredRent" @to-wish="onToWish" @remove-wish="onRemoveWish" :rent="rent" :key="rent.id" :user="user"/> 
    </div>
</template>

<script setup>
import io from 'socket.io-client';
import axios from 'axios';
let socket = io();
import Rent from './module/Rent';
import RentComponent from '../components/RentComponent.vue';
import UpperLine from '../Profile/components/UpperLine.vue';

import { ref } from 'vue';

socket = ref(socket);

let filterComponents = ref(['Apartments', 'House', 'Room', 'Villa', 'Penthouse', 'Duplex', 'Guesthouse']);

let user = ref(null);

let loadProfile = (userObj) => {
    user.value = userObj;
}

let rentList = ref([]);

let filteredRent = ref([]);

socket.value.on('load-list', (list) => {
    for(let rent of list) {
        rent = new Rent(rent);
        rentList.value.push(rent);
        filteredRent.value.push(rent);
    }
})

async function onToWish(id) {
    try {
        await axios.patch('/booking/to-wish', {id: id, user_id: user.value.id});
        if(!user.value.wishlist) user.value.wishlist = [];
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

let hoveredComponent = ref(null);

function componentHover(component) {
    hoveredComponent.value = component;
}

function componentLeave() {
    hoveredComponent.value = null;
}

let chosenFilter = ref(null);

function chooseFilter(component) {
    if(component !== chosenFilter.value){
        filteredRent.value = rentList.value.filter((rent) => rent.type === component)
        chosenFilter.value = component;
    } 
    else {
        filteredRent.value = rentList.value;
        chosenFilter.value = null;
    }
}
</script>

<style scoped lang="scss"> 
.mainContainer {
    padding-top: 90px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
}

.filter-line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30px 10px 10px 10px;
}

.filter-component {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 0.5px #ffffff solid;
}

.component-image {
    width: 40px;
    height: 40px;
}

.component-text {
    font-size: 18px;
    font-weight: 500;
}

//#d1d1d1
</style>