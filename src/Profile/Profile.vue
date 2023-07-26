<template>
    <FlashMessages :messages="messages" />
    <div class="mainContainer">
        <FullImage @dialog-close="hideDialog" :user="profile" v-if="fullImageIsVisible" />
        <UpperLine @user-profile="setProfile" @wish-deleted="onRemoveWish" />
        <div class="profileContainer" v-if="profile">
            <div class="profileLeftContainer">
                <div class="profileEdit">
                    <img class="fullProfileImage" @click="showFullImage" :src="`/profile-images/${profile.id}.png`"
                        onerror="this.src=`/images/no-avatar.png`" />
                    <div class="leftSideButton"><a href="/logout" class="btn-link">LogOut</a></div>
                </div>
                <div class="profileShortInfo">
                    <div class="infoContainer">
                        <img src="/images/user.png" class="shortInfoIcon" />
                        <div class="shortInfo usernameShortInfo">{{ profile.username }}</div>
                    </div>
                    <div class="infoContainer">
                        <img src="/images/place.png" class="shortInfoIcon" />
                        <div class="shortInfo countryShortInfo">Country: {{ profile.country }}</div>
                    </div>
                    <div class="infoContainer">
                        <img src="/images/joined.png" class="shortInfoIcon" />
                        <div class="shortInfo joinedInfo">Joined: {{ profile.join_date }}</div>
                    </div>
                    <div class="infoContainer">
                        <img src="/images/wishlist.png" class="shortInfoIcon" />
                        <div class="shortInfo wishedInfo">In wishlist: {{ profile.wishlist ? profile.wishlist.length : '0' }}
                        </div>
                    </div>
                </div>
                <div class="logoutContainer">
                    <div class="logoutButton">Delete My Account</div>
                </div>
            </div>
            <ProfileRight :profile="profile" @profile-change="commitChanges" @profile-props-change="commitProfileChanges"
                @remove-wish="onRemoveWish" ref="profileRight" @change-error="showError" @hide-error="showError"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import FlashMessages from '../components/FlashMessages.vue';
import UpperLine from '../components/UpperLine.vue';
import ProfileRight from './components/ProfileRight.vue';
import FullImage from './components/FullImage.vue';
import axios from 'axios';

let profile = ref(null);

let messages = ref(null);

axios.get('/flash-messages').then(({ data }) => messages.value = data);

let profileRight = ref(null);

function setProfile(user) {
    profile.value = user;
}

async function commitChanges(obj) {
    switch(obj.name) {
        case 'First Name':
            profile.value.first_name = obj.value;
            break;
        case 'Username':
            profile.value.username = obj.value;
            break;
        case 'Last Name':
            profile.value.last_name = obj.value;
            break;
        case 'Birth Date':
            profile.value.birth_date = obj.value;
            break;
        case 'Gender':
            profile.value.gender = obj.value;
            break;
        case 'Email':
            profile.value.email = obj.value;
            break;
        case 'Country': 
            profile.value.country = obj.value;
            break;
        case 'Phone Number':
            profile.value.phone_number = obj.value;
            break;
        default:
            break;
    }
    let { data } = await axios.get('/flash-messages');
    messages.value = data;
}

async function commitProfileChanges(obj) {
    profile.value.type = obj.type;
    profile.value.description = obj.description;
    let { data } = await axios.get('/flash-messages');
    messages.value = data;
}

function onRemoveWish(id) {
    for (let i = 0; i < profile.value.wishlist.length; i++) {
        if (profile.value.wishlist[i] == id) profile.value.wishlist.splice(i, 1);
    }
}

let fullImageIsVisible = ref(false);

function showFullImage() {
    fullImageIsVisible.value = true;
}

function hideDialog() {
    fullImageIsVisible.value = false;
}

async function showError() {
    let { data } = await axios.get('/flash-messages');
    messages.value = data;
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';
@import '../../public/stylesheets/inputs.scss';

#app {
    overflow-y: hidden;
}

.mainContainer {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.profileContainer {
    display: flex;
    flex-direction: row;
}

.profileLeftContainer {
    height: calc(100vh - 70px);
    width: auto !important;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-right: .5px solid $border-grey;
}

.profileRightContainer {
    width: 100%;
}

.profileEdit {
    width: 200px;
    padding: 40px 80px 40px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.fullProfileImage {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    cursor: pointer;
}

.infoContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.shortInfoIcon {
    width: 25px;
    height: 25px;
}

.profileShortInfo {
    padding: 40px 80px 40px 80px;
    display: flex;
    flex-direction: column;
}

.shortInfo {
    margin: 10px 10px 10px 10px;
    font-size: 16px;
}

.leftSideButton {
    text-align: center;
    padding: 10px 10px 10px 10px;
    margin-top: 40px;
    font-size: 20px;
    @include profile-buttons;
    background-color: $button-red;
    &:hover {
        background-color: $button-hover-red;
    }
}

.logoutButton {
    @include profile-buttons;
    background-color: $button-blue;
    &:hover {
        background-color: $button-hover-blue;
    }
}

.logoutContainer {
    padding: 40px 80px 40px 80px;
    display: flex;
    justify-content: center;
}

.btn-link {
    text-decoration: none;
    color: #fff;
}
</style>