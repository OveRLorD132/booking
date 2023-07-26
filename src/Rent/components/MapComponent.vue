<template>
  <div class="map-component-container">
    <div class="map-top-container">
      <h2>{{ isSwitched ? isEditing ? 'Set another marker' : 'Rent location' : 'You can choose a point on a map' }}</h2>
      <img class="edit-button" id="edit-btn" src="/images/rent-edit.png" 
        v-if="user && user.id == rent.user_id && !isEditing" @click="startEditing"
      />
      <SwitchButton @button-switched="onButtonSwitched" :is-button-switched="isSwitched" v-if="isEditing"/>
    </div>

    <div id="map" v-show="isSwitched">

    </div>
    <div class="submit-cont">
      <div class="close-btn" v-if="isEditing" @click="closeEdit">Close</div>
      <div class="submit-btn" v-if="isEditing && (!marker || coords != marker.position)" @click="submitChanges">Save changes</div>
    </div>
  </div>
</template>

<script setup>
import SwitchButton from '../../components/SwitchButton.vue';

import { ref, watch } from 'vue';

import googleApi from '../../module/google-api';

import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

let props = defineProps({
  user: Object,
  coords: Object,
  rent: Object
})

let newCoords = ref(null);

let isEditing = ref(false);

function startEditing() {
  isEditing.value = true;
}

function closeEdit() {
  isEditing.value = false;
}

let isSwitched = ref(null);


watch(() => props.coords, (newValue) => {
  if(newValue) {
    isSwitched.value = true;
  } 
}, {immediate: true}) 

function onButtonSwitched(bool) {
  isSwitched.value = bool;
  if(!bool) newCoords.value = null
}

function submitChanges() {
  axios.patch('/rent/change-coords', { coords: newCoords.value, rent_id: props.rent.id}).then(({data}) => {
    emits('new-marker', data);
    isEditing.value = false;
  }).catch((err) => {
    console.error(err);
  })
}

let emits = defineEmits({
  'new-marker': null
})

let map;

let marker;

let loader = new Loader({
  apiKey: googleApi,
  version: 'weekly',
  libraries: ['places']
})

loader.load().then((google) => {
  let lat = -34.397;
  let lng = 150.644;
  if(props.coords) {
    lat = props.coords.lat;
    lng = props.coords.lng;
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng },
    zoom: 15
  })
  map.addListener('click', addMarker);
  if (props.coords) {
    marker = new google.maps.Marker({
      position: props.coords,
      map: map
    })
  }
})

function addMarker(event) {
  if(!isSwitched.value || !isEditing.value) return; 
  if (props.coords) {
    if (marker) {
      marker.setPosition(event.latLng)
    }
  } else marker = new google.maps.Marker({ position: event.latLng, map: map })
  newCoords.value = event.latLng;
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';
@import '../../../public/stylesheets/inputs.scss';

#map {
  width: 800px;
  height: 400px;
}

.map-component-container {
  align-self: flex-start;
}

.map-top-container {
  width: 800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.submit-cont {
  display: flex;
  justify-content: space-between;
}

.submit-btn {
  @include button-style;
  position: relative;
  top: 10px;
  right: 0;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  &:hover {
    background-color: $button-hover-red;
  }
}

.close-btn {
  @include button-style;
  background-color: $button-blue;
  position: relative;
  top: 10px;
  right: 0;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  &:hover {
    background-color: $button-hover-blue;
  }
}
</style>