<template>
  <div class="profileRightContainer">
    <h1>Settings</h1>
    <div class="settingsChoose">
      <div class="settingsOption" v-for="settingsName in settings" @click="changeActive(settingsName)" 
        :style="{borderColor: settingsName === optionActive ? '#FF2F69' : '#767676'}">{{ settingsName }}
      </div>
    </div>
    <ProfileSettings v-show="optionActive === 'Profile Settings'" 
      :profile="profile" @profile-change="emitProfileChange" @change-error="emitError"
    />
    <AccountSettings v-show="optionActive === 'Account Settings'" 
      :profile="profile" @profile-change="emitChange" @change-error="emitError"
    />
    <WishlistComponent v-show="optionActive === 'Wishlist'" :user="profile" @remove-wish="onRemoveWish" @hide-error="showError"/>
    <div style="display: flex; flex-wrap: wrap;" v-show="optionActive === 'Rent Ads'">
      <template v-if="rentAds && rentAds.length > 0">
        <RentComponent style="width: 340px;" v-for="ad of rentAds" :rent="ad" :user="profile"
          @hide-error="showError" @rent-hide="rentHide"
        />
      </template>
      <template v-else>You don't have any ad</template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import AccountSettings from './AccountSettings.vue';
import ProfileSettings from './ProfileSettings.vue';
import WishlistComponent from './WishlistComponent.vue';
import RentComponent from '../../components/RentComponent.vue'
import axios from 'axios';

let props = defineProps({
  profile: Object
})

let emits = defineEmits({
  'profile-change': null,
  'profile-props-change': null,
  'remove-wish': (id) => typeof id === 'number',
  'change-error': null,
  'hide-error': null
})

let optionActive = ref('Profile Settings'); 


let settings = ['Profile Settings', 'Account Settings', 'Wishlist', 'Rent Ads']

function changeActive(name) {
  optionActive.value = name;
}

function emitChange(obj) {
  emits('profile-change', obj);
}

function emitError() {
  emits('change-error');
}

function emitProfileChange(obj) {
  emits('profile-props-change', obj);
} 

function onRemoveWish(id) {
  emits('remove-wish', id);
} 

let rentAds = ref(null);

axios.get('/booking/your-ads').then(({ data }) => {
  rentAds.value = data;
})

function showError() {
  emits('hide-error');
}

function rentHide(id) {
  for(let ad of rentAds.value) {
    if(ad.id == id) { ad.is_hidden = !ad.is_hidden; break; }
  }
}
</script>

<style lang="scss">
.profileRightContainer {
  overflow-y: auto;
  max-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  padding: 40px 40px 40px 40px;
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