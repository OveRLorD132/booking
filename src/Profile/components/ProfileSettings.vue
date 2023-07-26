<template>
  <div class="mainSettingsContainer">
    <div class="settingsContainer">
      <div class="property" style="border-bottom: 3px solid #FF2F69;">
        <div class="propertyLabel">Type</div>
        <div class="propertyValue" v-if="!isEditing">{{ profile.type }}</div>
        <select class="option-select" style="width: 250px;" v-if="isEditing" v-model="editedType">
          <option class="prop-option">Guest</option>
          <option class="prop-option">Host</option>
        </select>
      </div>
      <div class="property" style="width: 550px;">
        <div class="propertyLabel" style="margin-bottom: 10px;">Description</div>
        <div class="account-description" v-if="!isEditing">{{ profile.description }}</div>
        <textarea v-if="isEditing" class="description-edit" v-model="editedDescription"></textarea>
        <div class="edit-error">{{ descriptionError }}</div>
      </div>
      <a class="profile-link" :href="`/public-profile/${profile.id}`">My Public Profile</a>
    </div>
    <div class="buttons">
      <div class="editButton" @click="editProperties">{{isEditing ? 'Exit' : 'Edit Profile'}}</div>
      <div class="saveChangesButton" v-if="isEditing" @click="saveChanges">Save Changes</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import validation from '../../../module/user-properties-change/validation';
import axios from 'axios';

let isEditing = ref(false);

let editedType = ref(props.profile.type);

let editedDescription = ref(props.profile.description);

function editProperties() {
  isEditing.value = !isEditing.value;
}

let props = defineProps({
  profile: Object
})

let emits = defineEmits({
  'profile-change': null,
  'change-error': null
})

let descriptionError = ref('');

watch(editedDescription, (newValue) => {
  try {
    validation.validateDescription(newValue, editedType.value);
    descriptionError.value = '';
  } catch(err) {
    descriptionError.value = err.message;
  }
})

watch(editedType, (newValue) => {
  try {
    validation.validateDescription(editedDescription.value, newValue);
    descriptionError.value = '';
  } catch(err) {
    descriptionError.value = err.message;
  }
})

async function saveChanges() {
  if(descriptionError.value) return;
  try {
    await axios.patch('/profile/change-settings', {type: editedType.value, description: editedDescription.value});
    emits('profile-change', {type: editedType.value, description: editedDescription.value});
  } catch(err) {
    emits('change-error');
  }
  isEditing.value = false;
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.mainSettingsContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.passwordLabel {
  margin-bottom: 10px;
}
.changeLink {
  text-decoration: underline;
  color: $button-blue;
}

.account-description {
  font-size: 15px;
  max-width: 550px;
  word-wrap: break-word;
}

.description-edit {
  border-radius: 10px;
  border: 2px solid $calendar-grey;
  width: 550px;
  padding: 10px;
  height: 250px;
  resize: none;
  font-family: 'Roboto';
  font-size: 15px;
}

.profile-link {
  margin-left: 10px;
  font-size: 18px;
  color: $dialog-blue;
  &:hover {
    text-decoration: underline;
  }
}
</style>