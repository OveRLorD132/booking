<template>
    <FlashMessages :messages="messages"/>
    <div class="mainContainer">
        <UpperLine @user-profile="setProfile" @wish-deleted="onRemoveWish"/>
        <div class="profileContainer" v-if="profile">
            <div class="profileLeftContainer">
                <div class="profileEdit">
                    <img class="fullProfileImage" src="/images/no-avatar.png" />
                    <div class="leftSideButton">LogOut</div>
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
                        <div class="shortInfo wishedInfo">In wishlist: {{ profile.wishlist ? profile.wishlist.length : '0'}}</div>
                    </div>
                </div>
                <div class="logoutContainer">
                    <div class="logoutButton">Delete My Account</div>
                </div>
            </div>
            <ProfileRight :profile="profile" @profile-change="commitChanges" 
              @account-change="commitChanges" @remove-wish="onRemoveWish" ref="profileRight"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import FlashMessages from '../components/FlashMessages.vue';
import UpperLine from './components/UpperLine.vue';
import ProfileRight from './components/ProfileRight.vue';
import axios from 'axios';

let profile = ref(null);

let messages = ref(null);

let profileRight = ref(null);

function setProfile(user) {
    profile.value = user;
    console.log(profile);
} 

async function commitChanges(obj) {
    for(let key in obj) {
        profile.value[key] = obj[key];
    }
    let { data } = await axios.get('/flash-messages');
    messages.value = data;
}

function onRemoveWish(id) {
    for(let i = 0; i < profile.value.wishlist.length; i++) {
        if(profile.value.wishlist[i] == id) profile.value.wishlist.splice(i, 1);
    }
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';
@import '../../public/stylesheets/inputs.scss';

.mainContainer {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.profileContainer {
    flex: 1;
    display: flex;
    flex-direction: row;
}

.profileLeftContainer {
    flex-grow: 1;
    width: auto !important;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-right: .5px solid #767676;
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
}

.logoutButton {
  @include profile-buttons;
  background-color: #86E9CE;
}

.logoutContainer {
    padding: 40px 80px 40px 80px;
    display: flex;
    justify-content: center;
}

</style>