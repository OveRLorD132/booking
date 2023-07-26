<template>
    <div class="mainLineContainer">
        <div class="lineLeft"><a class="lineLinks" href="/booking">Booking</a></div>
        <div class="lineRight"><a class="lineLinks" href="/profile">Profile</a></div>
    </div>
</template>

<script setup>
import axios from 'axios';
let emit = defineEmits(['load-profile'])
try {
    axios.get('/booking/user-profile').then(({ data }) => {
        emit('load-profile', data);
    })
} catch(err) {
    console.error(err);
}
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/properties.scss';
@import '../../public/stylesheets/colors.scss';
.mainLineContainer {
    @include space-between;
    position: fixed;
    z-index: 999;
    top: 0;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: $line-color;
}

.lineLinks {
    color: $color;
    text-decoration: underline;
    font-size: 16px;
    margin-right: 15px;
    margin-left: 15px;
}
</style>