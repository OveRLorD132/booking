<template>
  <div class="propertiesContainer" v-if="profile">
    <div class="propertyContainer">
      <div class="propertyColumn">
        <PropertyComponent :name="'Username'" :value="profile.username" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
        <PropertyComponent :name="'Gender'" :value="profile.gender" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
        <PropertyComponent :name="'Phone Number'" :value="profile.phone_number" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
        <div class="property">
          <div class="passwordLabel">Password</div>
          <a class="changeLink" href="/profile/change-password">Change password</a>
        </div>
      </div>
      <div class="propertyColumn">
        <PropertyComponent :name="'First Name'" :value="profile.first_name" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
        <PropertyComponent :name="'Birth Date'" :value="profile.birth_date" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
        <PropertyComponent :name="'E-mail'" :value="profile.email" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
      </div>
      <div class="propertyColumn">
        <PropertyComponent :name="'Last Name'" :value="profile.last_name" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
        <PropertyComponent :name="'Join Date'" :value="profile.join_date" />
        <PropertyComponent :name="'Country'" :value="profile.country" 
          @change-error="emitError" @value-changed="emitsChange" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import PropertyComponent from './PropertyComponent.vue';

let props = defineProps({
  profile: Object
})

let emits = defineEmits({
  'profile-change': null,
  'change-error': null
})

function emitsChange(obj) {
  emits('profile-change', obj);
}

function emitError() {
  emits('change-error');
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/inputs.scss';
@import '../../../public/stylesheets/colors.scss';

.propertiesContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 800px;
}

.propertyContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.editButton {
  @include profile-buttons;
  text-align: center;
  background-color: $dialog-blue;
  &:hover {
    background-color: $button-hover-blue;
  }
  min-width: 50px;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.saveChangesButton {
  @include profile-buttons;
  background-color: $button-red;
  &:hover {
    background-color: $button-hover-red;
  }
}
</style>