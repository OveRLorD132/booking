<template>
    <div class="secondStepContainer">
        <h1 class="mainLabel">Add an adress</h1>
        <div class="mapContainer">
            <input class="mainInput adressInput" ref="adressInput" placeholder="Enter address..." type="text" v-model="adress"/>
            <div ref="gMap" id="map"></div>
        </div>
    </div>
</template>

<script setup>
import { Loader } from '@googlemaps/js-api-loader';
import { ref } from 'vue';

let gMap = ref(null);

let adress = ref(null);

let adressInput = ref(null);

let map;

let emits = defineEmits({
    'address-chosen': null
})

let loader = new Loader({
        apiKey: 'AIzaSyD2WOGv4ca7LDKFt0lLP4hfKDUd-dzMoP4',
        version: 'weekly',
        libraries: ['places']
    });

loader.load().then((google) => {
    let geocoder = new google.maps.Geocoder();

    let initMap = function() {
        console.log(gMap);
        map = new google.maps.Map(gMap.value, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
        });
    }
    initMap();

    console.log(map);

    let autocomplete = new google.maps.places.Autocomplete(adressInput.value);

    autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        emits('address-chosen', place.address_components);
    })
})


// onMounted(async () => {

//     try {

//         let placeMarker = function(location) {
//             if (marker.value) {
//                 marker.value.setPosition(location);
//             } else {
//                 marker.value = new google.maps.Marker({
//                     position: location,
//                     map: map,
//                 });
//             }
//         }
//         if(place.geometry && place.geometry.location) {
//         map.panTo(place.geometry.location);
//         map.setZoom(15);
//         if(marker.value) {
//             marker.value.setPosition(place.geometry.location);
//             return;
//         }
//         marker.value = new google.maps.Marker({
//             position: place.geometry.location,
//             map: map
//         })
//     }
//         let reverseGeocode = (latLng) => {
//             geocoder.geocode({ 'location' : latLng}, (results, status) => {
//                 adress.value = processAdress(results);
//             })
//         }
//         watch(adress, (value) => {
//             geocoder.geocode({ 'address': value}, (results, status) => {
//                 emits('address-chosen', results ? results.formatted_address: null);
//             })
//         })
//         map.addListener('click', (event) => {
//             placeMarker(event.latLng);
//             reverseGeocode(event.latLng);
//         })
//     } catch(err) {
//         console.error(err);
//     }
// })

// function processAdress(results) {
//     let markAdress = results[0];
//     let processedAdress = "";
//     for(let i = 0; i < markAdress.address_components.length; i++) {
//         if(markAdress.address_components[i].types[0] === 'country' 
//         || markAdress.address_components[i].types[0] === 'locality'
//         || markAdress.address_components[i].types[0] === 'route'
//         || markAdress.address_components[i].types[0] === 'street_number'
//         || markAdress.address_components[i].types[0] === 'administrative_area_level_1') {
//             if(markAdress.address_components[i].types[0] === 'country') processedAdress += markAdress.address_components[i].long_name;
//             else processedAdress += markAdress.address_components[i].long_name + ', ';
//         }
//     }
//     return processedAdress;
// } 

</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/inputs.scss';
.secondStepContainer {
    display: flex;
    flex-direction: column;
}

.mainLabel {
    align-self: center;
}

.mapContainer {
    display: flex;
    justify-content: center;
    position: relative;
}

.adressInput {
    position: absolute;
    z-index: 999;
    top: 10px;
    width: 400px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
}

#map {
    border-radius: 10px;
    width: 800px;
    height: 600px;
}
</style>