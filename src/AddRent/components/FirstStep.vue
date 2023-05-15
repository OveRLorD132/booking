<template>
    <div class="firstStepContainer">
        <h1 class="chooseLabel">Choose type of rent</h1>
        <div class="buttonsContainer">
            <template v-for="rent in rentList">
                <div class="typeButtonContainer" @click="chooseType(rent)" 
                  @mouseover="changeColor(rent)" @mouseleave="restoreColor"
                  :style="{backgroundColor: rent === rent_type ? '#EAEAEA' : rent === hoveredType ? '#F4F4F4' : 'transparent'}"
                >
                    <img class="typeButtonImage" :src="`/images/${rent.toLowerCase()}.png`"/>
                    <div class="typeButtonText">{{ rent }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
    rent_type: String
})

let emits = defineEmits({
    'type-chosen': (type) => typeof type === 'string' 
})

let rentList = ['Apartments', 'House', 'Room', 'Villa', 'Penthouse', 'Duplex', 'Guesthouse'];
rentList = ref(rentList)

let hoveredType = ref(null);

let changeColor = (type) => {
    hoveredType.value = type;
}

let restoreColor = () => {
    hoveredType.value = null;
}

let chosenType = ref(props.rent_type);

let chooseType = (type) => {
    if(chosenType.value === type) chosenType.value = "";
    else chosenType.value = type;
    emits('type-chosen', chosenType.value);
}
</script>

<style scoped lang="scss">
@import '../style/style.scss';
//@import '../../../public/stylesheets/colors.scss';
.firstStepContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.buttonsContainer {
    display: flex;
    flex-direction: column;
}
.typeButtonContainer {
    cursor: pointer;
    padding: 5px 5px 5px 5px;
    margin-top: 25px;
    min-width: 600px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 2px solid $button-grey;
    border-radius: 5px;
}

.typeButtonText {
    font-size: 20px;
    margin-left: 20px;
}

.typeButtonImage {
    width: 50px;
    height: 50px;
}

</style>