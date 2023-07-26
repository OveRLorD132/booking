<template>
    <UpperLine @user-profile="loadProfile"/>
    <div class="mainContainer">
        <FirstStep v-show="step === 1" @type-chosen="setType" :rent_type="rent_type"/>
        <SecondStep v-show="step === 2" @address-chosen="setAddressObject"/>
        <ThirdStep v-show="step === 3" :address="addressObject" @address-input="setAddress" @city-input="setCity"
          @country-input="setCountry" @post-index-input="setPostIndex" @coords-input="setCoords"
        />
        <FourthStep v-show="step === 4" @files-uploaded="filesUploaded"/>
        <FifthStep v-show="step === 5" @description-input="setDescription" @header-input="setHeader" @price-input="setPrice"/>
        <SixthStep v-show="step === 6" :rent="rent" :user-profile="profile"/>
    </div>
    <div class="bottomLine">
        <div class="progressLine">
            <div class="stepProgress" :style="firstStep"></div>
            <div class="stepProgress" :style="secondStep"></div>
            <div class="stepProgress" :style="thirdStep"></div>
            <div class="stepProgress" :style="fourthStep"></div>
            <div class="stepProgress" :style="fifthStep"></div>
        </div>
        <div class="buttons">
            <button class="lineButton backButton" @click="returnBack">Back</button>
            <button class="lineButton nextButton" @click="nextStep">{{step === 6 ? "Complete" : "Next"}}</button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';

import { computed, ref } from 'vue';
import UpperLine from '../components/UpperLine.vue';

import FirstStep from './components/FirstStep.vue'; 
import SecondStep from './components/SecondStep.vue';
import ThirdStep from './components/ThirdStep.vue';
import FourthStep from './components/FourthStep.vue';
import FifthStep from './components/FifthStep.vue';
import SixthStep from './components/SixthStep.vue';

let step = ref(1);

let rent = ref(null);

let rent_type = ref(null);

let profile = ref(null);

let addressObject = ref(null);

function setAddressObject(obj) {
    addressObject.value = obj;
    step.value++;
}

function loadProfile(userProfile) {
    profile.value = userProfile;
}

let setType = (type) => {
    rent_type.value = type;
    console.log(rent_type);
}

let address = ref({});

let setAddress = (addressLine) => {
    address.value.addressLine = addressLine;
}

function setCity(city) {
    address.value.city = city;
}

function setCountry(country) {
    address.value.country = country;
}

function setPostIndex(postIndex) {
    address.value.postIndex = postIndex;
}

function setCoords(coords) {
    address.value.coords = coords;
}

let returnBack = () => {
    if(step.value <= 1) return;
    step.value--;
}

let images = ref([])

function filesUploaded(imgArray) {
    images.value = imgArray;
    console.log(images);
}

let header = ref(null);

function setHeader(newHeader) {
    header.value = newHeader;
}

let description = ref(null);

function setDescription(newDescription) {
    description.value = newDescription;
}

let price = ref(null);

function setPrice(newPrice) {
    price.value = newPrice;
}

let nextStep = () => {
    switch (step.value) {
        case 1: 
            if(!rent_type.value) return;
            step.value++;
            return;
        case 2:
            if(!addressObject.value) return;
            step.value++;
            return;
        case 3: 
            if(!address.value.country || !address.value.addressLine 
              || address.value.city === 'Invalid' || address.value.postIndex === 'Invalid') return;
            step.value++;
            return;
        case 4:
            if(images.value.length < 5) return;
            step.value++;
            break;
        case 5: 
            if(rent_type.value && address.value && images.value.length >= 5 && description.value && header.value 
            && price.value) {
                setRent(rent_type.value, address.value, images.value, description.value, header.value, price.value);
                step.value++;
            }
            return;
        case 6:
            try {
                axios.post('/new-rent', {rent: rent.value, user: {id: profile.value.id, name: profile.value.first_name}}).then(({data}) => {
                    window.location.href = `/booking/rent/${data}`;
                })
            } catch(err) {
                window.location.reload();
            }

            
            break;
        default: 
            break;
    }
    //step.value++;
}

function setRent(type, address, images, description, header, price) {
    rent.value = { type, address, images, description, header, price};
}



let firstStep = computed(() => {
    return {
        backgroundColor: step.value >= 2 ? "black" : "#ADADAD"
    }
})

let secondStep = computed(() => {
    return {
        backgroundColor: step.value >= 3 ? "black" : "#ADADAD"
    }
})

let thirdStep = computed(() => {
    return {
        backgroundColor: step.value >= 4 ? "black" : "#ADADAD"
    }
})

let fourthStep = computed(() => {
    return {
        backgroundColor: step.value >= 5 ? "black" : "#ADADAD"
    }
})

let fifthStep = computed(() => {
    return {
        backgroundColor: step.value >= 6 ? "black" : "#ADADAD"
    }
})
</script>

<style lang="scss">
@import '../../public/stylesheets/inputs.scss';
.mainContainer {
    overflow-x: hidden;
    overflow-x: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 80px;
    margin-top: 70px;
} 

.bottomLine {
    width: 100%;
    position: fixed;
    bottom: 0;
}

.progressLine {
    display: flex;
    height: 5px;
}

.stepProgress {
    flex: 1;
    height: 100%;
}

.buttons {
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
}

.lineButton {
    font-size: 15px;
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
}

.nextButton {
    @include button-style;
    margin-right: 30px;
    &:hover {
        background-color: $button-hover-red;
    }
}

.backButton {
    margin-left: 30px;
    background-color: transparent;
    border: 2px solid black;
    outline: none;
    font-family: 'Proxima-Nova';
    border-radius: 10px;
    cursor: pointer;
}

.error-text {
    color: $error-red;
    font-size: 20px;
}
</style>