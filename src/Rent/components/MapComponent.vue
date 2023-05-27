<template>
  <div class="map-component-container">
    <h2>{{isEditing ? 'Set another marker' : 'Rent location'}}</h2>
    <div id="map">

    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

import { Loader } from '@googlemaps/js-api-loader';

let props = defineProps({
  coords: Object,
  isEditing: Boolean
})

let map;

let marker;

let googleMaps;

let clickListener;

let loader = new Loader({
  apiKey: 'AIzaSyD2WOGv4ca7LDKFt0lLP4hfKDUd-dzMoP4',
  version: 'weekly',
  libraries: ['places']
})

loader.load().then((google) => {
  googleMaps = google;
  let { lat, lng } = props.coords;
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng },
    zoom: 15
  })
  marker = new google.maps.Marker({
    position: props.coords,
    map: map
  })
})

watch(() => props.isEditing, (newValue) => {
  if(newValue) {
    clickListener = map.addListener('click', addMarker);
  } else if(!newValue) {
    googleMaps.maps.event.removeListener(clickListener)
    clickListener = null;
    marker.setPosition(props.coords)
  } 
})


function addMarker(event) {
  if(marker) {
    marker.setPosition(event.latLng)
  } else marker = new google.maps.Marker({position: props.coords, map: map})
}
</script>

<style lang="scss">
#map {
  width: 800px;
  height: 400px;
}
</style>