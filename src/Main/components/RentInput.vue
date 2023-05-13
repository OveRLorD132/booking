<template>
    <form @submit.prevent="addRent">
        <input type="text" v-model="adress" />
        <input type="text" v-model="description" />
        <input type="text" v-model="price" />
        <input type="text" v-model="type" />
        <input type="text" v-model="title" />
        <input type="submit" />
    </form>

</template>

<script setup>
import { ref, defineProps } from 'vue';
let props = defineProps({
    socket: Object,
    userId: Number,
})

let socket = props.socket;

console.log(socket);
let description = ref(null);
let adress = ref(null);
let price = ref(null);
let type = ref(null);
let title = ref(null);

let addRent = () => {
    socket.emit('rent-add', {
        price: price.value, 
        description: description.value, 
        adress: adress.value,
        type: type.value,
        title: title.value,
    });
}

socket.on('rent-added', (newRent) => {
    console.log(newRent);
});

</script>

<style>

</style>