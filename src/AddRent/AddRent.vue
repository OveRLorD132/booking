<template>
    <LineComponent />
    <div class="mainContainer">
        <FirstStep v-if="step === 1" @type-chosen="setType" :rent_type="rent_type"/>
        <SecondStep v-if="step === 2"/>
    </div>
    <div class="bottomLine">
        <button class="lineButton backButton" @click="returnBack">Back</button>
        <button class="lineButton nextButton" @click="nextStep">Next</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LineComponent from '../components/LineComponent.vue';

import FirstStep from './components/FirstStep.vue'; 
import SecondStep from './components/SecondStep.vue';

let step = ref(1);

let rent_type = ref(null);

let setType = (type) => {
    rent_type.value = type;
    console.log(rent_type);
}

let returnBack = () => {
    if(step.value <= 1) return;
    step.value--;
}

let nextStep = () => {
    switch (step.value) {
        case 1: 
        console.log(rent_type);
            if(!rent_type.value) return;
            step.value++;
            return;
        default: 
            break;
    }
    //step.value++;
}

</script>

<style scoped lang="scss">
@import '../../public/stylesheets/inputs.scss';
.mainContainer {
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
} 

.bottomLine {
    position: fixed;
    bottom: 0;
    height: 70px;
    width: 100%;
    box-shadow: 0px -1px 2px 0px rgba(0,0,0,0.75);
    display: flex;
    justify-content: space-between;
    align-items: center;
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