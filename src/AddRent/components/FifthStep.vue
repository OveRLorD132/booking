<template>
    <div class="mainStepContainer">
        <h1>Enter a header</h1>
        <input class="mainInput headerInput" type="text" placeholder="Header" v-model="header"/>
        <div class="error-text">{{ headerError }}</div>
        <h1>Enter price per day</h1>
        <input type="text" class="mainInput headerInput" placeholder="Price" v-model="price"/>
        <div class="error-text">{{ priceError }}</div>
        <h1>Enter description</h1>
        <textarea class="mainInput descriptionInput" v-model="description"></textarea>
        <div class="error-text">{{ descriptionError }}</div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import rentValidation from '../../../module/rent-change/rent-validation';

let header = ref(null);

let description = ref(null);

let price = ref(null);

let emits = defineEmits({
    'header-input': (text) => typeof text === "string",
    'description-input': (text) => typeof text === "string",
    'price-input': (price) => typeof price === "number",
})

let headerError = ref(null);

watch(header, (newValue) => {
    try {
        rentValidation.validateHeader(newValue);
        emits('header-input', newValue);
        headerError.value = null;
    } catch (err) {
        emits('header-input', '');
        headerError.value = err;
    }
})

let descriptionError = ref(null);

watch(description, (newValue) => {
    try {
        rentValidation.validateDescription(newValue);
        emits('description-input', newValue);
        descriptionError.value = null;
    } catch (err) {
        emits('description-input', '');
        descriptionError.value = err;
    }
})

let priceError = ref(null);

watch(price, (newValue) => {
    try {
        rentValidation.validatePrice(newValue);
        emits('price-input', newValue);
        priceError.value = null;
    } catch (err) {
        emits('price-input', '');
        priceError.value = err;
    }

})
</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/inputs.scss';
.mainStepContainer {
    display: flex;
    flex-direction: column;
}
.headerInput {
    height: 50px;
    font-size: 16px;
    padding-left: 10px;
}
.descriptionInput {
    font-size: 16px;
    padding: 10px 10px 10px 10px;
    width: 600px;
    height: 300px;
    resize: none;
}
</style>