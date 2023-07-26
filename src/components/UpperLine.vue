<template>
    <div class="lineMainContainer">
        <div class="line">
            <div class="leftSide">
                <div class="leftSideElem"><a class="upperLineLinks" href="/booking">Main Page</a></div>
            </div>
            <div class="rightSide">
                <div class="rightSideElem hostLink"><a class="option-link" href="/become-a-host">Become a host</a></div>
                <div class="rightSideElem wishlistButton" @click="showWishlist" id="wishlistButton" v-if="profile">
                    <div>Wishlist</div>
                </div>
                <img class="rightSideElem notificationsImage" id="notifications-btn" src="/images/notifications.png" @click="showNotifications" v-if="profile"/>
                <img class="rightSideElem profileImage" :src="profile ? `/profile-images/${profile.id}.png` : '/images/no-avatar.png'" onerror="this.src=`/images/no-avatar.png`" id="panel-btn" @click="showPanel"/>
            </div>
        </div>
        <NotificationsComponent v-if="profile" v-show="notificationsAreVisible" :user="profile"/>
        <ShortWishlist v-if="profile" v-show="wishlistIsVisible" @wish-deleted="onWishDeleted" :profile="profile"/>
        <div class="profilePanel" v-show="panelIsVisible" id="panel-container">
            <template v-if="profile">
                <div class="profile-option">
                    <img class="link-icon" src="/images/user.png"/>
                    <a href="/profile" name="My Profile" class="option-link">My Profile</a>
                </div>
                <div class="profile-option" style="padding-left: 5px;">
                    <img class="link-icon" style="height: 40px; width: 40px;" src="/images/house-icon.png"/>
                    <a href="/become-a-host" name="Add Rent" class="option-link">Add Rent</a>
                </div>
                <div class="profile-option">
                    <img class="link-icon" src="/images/chat.png"/>
                    <a href="/conversations" name="My Conversations" class="option-link">My conversations</a>
                </div>
                <div class="profile-option">
                    <img class="link-icon" src="/images/log-out.png"/>
                    <a href="/logout" name="Log Out" class="option-link">Log Out</a>
                </div>
            </template>
            <template v-else>
                <div class="profile-option">
                    <img class="link-icon" src="/images/user.png"/>
                    <a href="/login" name="My Profile" class="option-link">Login</a>
                </div>
                <div class="profile-option">
                    <img class="link-icon" src="/images/registration.png"/>
                    <a href="/registration" name="My Profile" class="option-link">Registration</a>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';

import ShortWishlist from './ShortWishlist.vue';
import { ref } from 'vue';
import NotificationsComponent from './NotificationsComponent.vue';

let profile = ref(null);

let emits = defineEmits({
    'user-profile': null,
    'wish-deleted': null
})

try {
    axios.get('/booking/user-profile').then(({ data }) => {
        profile.value = data;
        if(profile.value.join_date) profile.value.join_date = formatDate(profile.value.join_date);
        if(profile.value.birth_date) profile.value.birth_date = formatDate(profile.value.birth_date);
        emits('user-profile', profile.value);
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
    document.addEventListener('click', hideWishlist);
}

function hideWishlist(e) {
    let wishlistContainer  = document.getElementById('shortWishlistContainer');
    let button = document.getElementById('wishlistButton');
    if((wishlistContainer && wishlistContainer.contains(e.target)) || button.contains(e.target)) return;
    wishlistIsVisible.value = false;
    document.removeEventListener('click', hideWishlist);
} 

function onWishDeleted(id) {
    emits('wish-deleted', id);
}

let panelIsVisible = ref(false);

function showPanel() {
    panelIsVisible.value = !panelIsVisible.value;
    if(panelIsVisible.value) {
        document.addEventListener('click', hidePanel);
    } else document.removeEventListener('click', hidePanel);
} 

function hidePanel(e) {
    let button = document.getElementById('panel-btn');
    if(document.getElementById('panel-container').contains(e.target) || button.contains(e.target)) return;
    panelIsVisible.value = false;
    document.removeEventListener('click', hidePanel);
}

let notificationsAreVisible = ref(null);

function showNotifications() {
    notificationsAreVisible.value = !notificationsAreVisible.value;
    if(notificationsAreVisible.value) {
        document.addEventListener('click', hideNotifications);
    } else document.removeEventListener('click', hideNotifications);
}

function hideNotifications(e) {
    let button = document.getElementById('notifications-btn');
    if(document.getElementById('notifications-container').contains(e.target) || button.contains(e.target)) return;
    notificationsAreVisible.value = false;
    document.removeEventListener('click', hideNotifications);
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.lineMainContainer {
    position: sticky;
    z-index: 2;
    width: 100%;
    top:0;
    background-color: #ffffff;
}

.line {
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding-left: 15px;
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

.profilePanel {
    position: absolute;
    right: 0;
    background-color: #ffffff;
    box-shadow: -2px 2px 7px -3px rgba(0, 0, 0, 0.75);
}

.profile-option {
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 10px;
}

.profile-option:hover {
    background-color: $calendar-grey;
}

.link-icon {
    padding-right: 5px;
    width: 30px;
    height: 30px;
}

.option-link {
    cursor: pointer;
    text-decoration: none;
    color: black;
    font-size: 20px;
}
</style>