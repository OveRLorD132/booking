<template>
    <div class="line">
        <div class="leftSide">
            <div class="leftSideElem">Booking</div>
        </div>
        <div class="rightSide">
            <div class="rightSideElem wishlistButton">Wishlist</div>
            <img class="rightSideElem notificationsImage" src="/images/notifications.png" />
            <img class="rightSideElem profileImage" src="/images/no-avatar.png" />
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';

let emits = defineEmits({
    'user-profile': Object
})

try {
    axios.get('/booking/user-profile').then(({ data }) => {
        data.join_date = formatDate(data.join_date);
        data.birth_date = formatDate(data.birth_date);
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
</script>

<style lang="scss">
.line {
    height: 35px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding: 15px 15px 15px 15px;
    border-bottom: .5px solid #767676;
}

.rightSide {
    display: flex;
    flex-direction: row;
    align-items: center;
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