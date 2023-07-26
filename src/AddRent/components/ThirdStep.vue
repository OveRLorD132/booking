<template>
    <div class="thirdStepValue">
        <h1 class="header">Enter Address</h1>
        <div class="addressInputContainer">
            <div class="addressLine firstLine">
                Country
                <input type="text" class="lineInput" placeholder="Enter country..." v-model="country"/>
                <div class="error-text">{{ countryError }}</div>
            </div>
            <div class="addressLine firstLine">
                Address
                <input type="text" class="lineInput" placeholder="Enter address...." v-model="addressLine"/>
                <div class="error-text">{{ lineError }}</div>
            </div>
            <div class="addressLine firstLine">
                City
                <input type="text" class="lineInput" placeholder="Enter city..." v-model="city"/>
                <div class="error-text">{{ cityError }}</div>
            </div>
            <div class="addressLine">
                Index
                <input type="text" class="lineInput" placeholder="Enter index..." v-model="postIndex"/>
                <div class="error-text">{{ indexError }}</div>
            </div>
        </div>
        <div class="useMapCont">
            <div class="useMap">
                <h2>Use map?</h2>
                <div class="switchButton" :class="isSwitched ? 'switchOn' : ''" @click="switchButton"></div>
            </div>
            <div class="mapCont" :style="{backgroundColor: '#0d8cd6'}">
                <Transition name="mapShow">
                    <div id="markerSet" v-show="isSwitched"></div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import { Loader } from '@googlemaps/js-api-loader';
import rentValidation from '../../../module/rent-change/rent-validation';

import googleApi from '../../module/google-api';

let props = defineProps({
    address: Array,
})

let emits = defineEmits({
    'address-input': null,
    'country-input': null,
    'city-input': null,
    'post-index-input': null,
    'coords-input': null
})

let addressLine = ref(null);

let lineError = ref(null);

watch(addressLine, (newValue) => {
    try {
        rentValidation.validateAddress(newValue);
        emits('address-input', newValue);
        lineError.value = null;
    } catch(err) {
        emits('address-input', '');
        lineError.value = err;
    }
})

let country = ref(null);

let countryError = ref(null);

watch(country, (newValue) => {
    try {
        rentValidation.validateCountry(newValue);
        emits('country-input', newValue);
        countryError.value = null;
    } catch(err) {
        emits('country-input', '');
        countryError.value = err;
    }
})

let city = ref(null);

let cityError = ref(null);

watch(city, (newValue) => {
    try {
        rentValidation.validateCity(newValue);
        emits('city-input', newValue);
        cityError.value = null;
    } catch(err) {
        emits('city-input', 'Invalid');
        cityError.value = err;
    } 
})

let postIndex = ref(null);

let indexError = ref(null);

watch(postIndex, (newValue) => {
    try {
        rentValidation.validateIndex(newValue);
        emits('post-index-input', newValue);
        indexError.value = null;
    } catch(err) {
        emits('post-index-input', 'Invalid');
        indexError.value = err;
    }
})

let isSwitched = ref(false);

let map;

let geocoder

let marker;

let coords = ref(null);

watch(coords, (newValue) => {
    emits('coords-input', newValue);
})

let loader = new Loader({
    apiKey: googleApi,
    version: 'weekly',
    libraries: ['places']
})

loader.load().then((google) => {
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('markerSet'), {
        center: { lat: -34.397, lng: 150.644},
        zoom: 8,
    });

    map.addListener('click', (event) => {
        placeMarker(event.latLng);
    })
})

function placeMarker(location) {
    if(marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map
        })
    }
    coords.value = location;
}

watch(props, (newValue) => {
    let address = newValue.address;
    country.value = address.filter((component) => component.types[0] === 'country').map((component) => component.long_name);
    postIndex.value = address.filter((component) => component.types[0] === 'postal_code').map((component) => component.long_name);
    city.value = address.filter((component) => component.types[0] === 'locality').map((component) => component.long_name);
    let addressLineComponents = address.filter((component) => component.types[0] === 'street_number' || component.types[0] === 'route');
    addressLine.value =  addressLineComponents[1] && addressLineComponents[0] ? addressLineComponents[0] ?
        addressLineComponents[1].long_name + ', ' + addressLineComponents[0].long_name : 
        addressLineComponents[0].long_name :  "";
})


function switchButton() {
    isSwitched.value = !isSwitched.value;
    if(!isSwitched.value) coords.value = "";
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.addressInputContainer {
    border: .5px solid #767676;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.header {
    text-align: center;
}

.addressLine {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 10px 10px;
}

.lineInput {
    font-size: 20px;
    font-family: 'Proxima-Nova';
    padding: 15px 15px 15px 15px;
    width: 400px;
    border: none;
    outline: none;
}

.firstLine {
    border-bottom: .5px #767676 solid;
}

.switchButton {
    display: inline-block;
    width: 64px;
    height: 35px;
    border-radius: 16px;
    background: #bfbfbf;
    z-index: 0;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
}

.switchButton::after {
    content: "";
    border-radius: 50%;
    height: 29px;
    width: 29px;
    background: #ffffff;
    top: 3px;
    left: 2px;
    transition: all .3s;
    position: absolute;
    z-index: 1;
}

.switchOn {
    background: $button-red;
}

.switchOn::after {
    left: 33px;
}

.useMap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
}

.mapCont {
    border-radius: 10px;
    width: 500px;
    height: 500px;
}

#markerSet {
    width: 500px;
    height: 500px;
}

.mapShow-enter-from,
.mapShow-leave-to {
    opacity: 0;
}

.mapShow-enter-active,
.mapShow-leave-active {
    transition: all 1s;
}
</style>