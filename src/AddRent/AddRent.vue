<template>
    <LineComponent @load-profile="loadProfile"/>
    <div class="mainContainer">
        <FirstStep v-show="step === 1" @type-chosen="setType" :rent_type="rent_type"/>
        <SecondStep v-show="step === 2" @address-chosen="setAddress"/>
        <ThirdStep v-show="step === 3" @files-uploaded="filesUploaded"/>
        <FourthStep v-show="step === 4" @description-input="setDescription" @header-input="setHeader" @price-input="setPrice"/>
        <FifthStep v-show="step === 5" :rent="rent" :user-profile="profile"/>
    </div>
    <div class="bottomLine">
        <div class="progressLine">
            <div class="stepProgress" :style="firstStep"></div>
            <div class="stepProgress" :style="secondStep"></div>
            <div class="stepProgress" :style="thirdStep"></div>
            <div class="stepProgress" :style="fourthStep"></div>
        </div>
        <div class="buttons">
            <button class="lineButton backButton" @click="returnBack">Back</button>
            <button class="lineButton nextButton" @click="nextStep">{{step === 4 ? "Complete" : "Next"}}</button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';

import { computed, ref } from 'vue';
import LineComponent from '../components/LineComponent.vue';

import FirstStep from './components/FirstStep.vue'; 
import SecondStep from './components/SecondStep.vue';
import ThirdStep from './components/ThirdStep.vue';
import FourthStep from './components/FourthStep.vue';
import FifthStep from './components/FifthStep.vue';

let step = ref(1);

let rent = ref(null);

let rent_type = ref(null);

let profile = ref(null);

function loadProfile(userProfile) {
    profile.value = userProfile;
}

let setType = (type) => {
    rent_type.value = type;
    console.log(rent_type);
}

let address = ref(null);

let setAddress = (addressArray) => {
    address.value = addressArray;
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
        console.log(rent_type);
            if(!rent_type.value) return;
            step.value++;
            return;
        case 2:
            if(!address.value) return;
            step.value++;
            return;
        case 3:
            if(images.value.length < 5) return;
            step.value++;
            break;
        case 4: 
            if(rent_type.value && address.value && images.value.length >= 5 && description.value && header.value 
            && price.value && typeof +price.value === 'number') {
                setRent(rent_type.value, address.value, images.value, description.value, header.value, price.value);
                step.value++;
            }
        case 5:
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
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/inputs.scss';
.mainContainer {
    overflow-x: hidden;
    overflow-x: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 125px);
    width: 100%;
    margin-bottom: 75px;
    margin-top: 50px;
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
</style>