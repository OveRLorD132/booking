<template>
  <div class="profileRightContainer">
    <h1>Settings</h1>
    <div class="settingsChoose">
      <div class="settingsOption" v-for="settingsName in settings" @click="changeActive(settingsName)" 
        :style="{borderColor: settingsName === optionActive ? '#FF2F69' : '#767676'}">{{ settingsName }}
      </div>
    </div>
    <ProfileSettings v-show="optionActive === 'Profile Settings'" :profile="profile" @profile-change="emitChange"/>
    <AccountSettings v-show="optionActive === 'Account Settings'" :profile="profile" @account-change="emitAccountChange"/>
    <WishlistComponent v-show="optionActive === 'Wishlist'" :user="profile" @remove-wish="onRemoveWish"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import AccountSettings from './AccountSettings.vue';
import ProfileSettings from './ProfileSettings.vue';
import WishlistComponent from './WishlistComponent.vue';

let props = defineProps({
  profile: Object
})

let emits = defineEmits({
  'profile-change': null,
  'account-change': null,
  'remove-wish': (id) => typeof id === 'number',
})

let optionActive = ref('Profile Settings'); 

console.log(optionActive);

let settings = ['Profile Settings', 'Account Settings', 'Wishlist']

function changeActive(name) {
  optionActive.value = name;
}

function emitChange(obj) {
  emits('profile-change', obj);
}

function emitAccountChange(obj) {
  emits('account-change', obj);
}

function onRemoveWish(id) {
  emits('remove-wish', id);
} 
</script>

<style lang="scss">
.profileRightContainer {
  display: flex;
  flex-direction: column;
  padding: 80px 80px 40px 80px;
}
.settingsChoose {
  display: flex;
  flex-direction: row;
}

.settingsChoose {
  padding: 20px 20px 20px 0;
}

.settingsOption {
  cursor: pointer;
  padding: 10px 20px 10px 0;
  font-size: 24px;
  border-bottom: 3px solid #767676;
}

.settingsOption:hover {
  border-color: #FF2F69;
}
</style>