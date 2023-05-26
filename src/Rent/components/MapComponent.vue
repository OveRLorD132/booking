<template>
  <div class="map-component-container">
    <h2>Rent location</h2>
    <div id="map">

    </div>
  </div>
</template>

<script setup>
import { Loader } from '@googlemaps/js-api-loader';

let props = defineProps({
  coords: Object
})

let map;

let loader = new Loader({
  apiKey: 'AIzaSyD2WOGv4ca7LDKFt0lLP4hfKDUd-dzMoP4',
  version: 'weekly',
  libraries: ['places']
})

loader.load().then((google) => {
  let { lat, lng } = props.coords;
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng },
    zoom: 15
  })
  new google.maps.Marker({
    position: props.coords,
    map: map
  })
})


</script>

<style lang="scss">
#map {
  width: 800px;
  height: 400px;
}
</style>