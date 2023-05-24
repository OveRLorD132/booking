<template>
    <div class="mainStepContainer">
        <h1>Enter a header</h1>
        <input class="mainInput headerInput" type="text" placeholder="Header" v-model="header"/>
        <h1>Enter price per day</h1>
        <input type="text" class="mainInput headerInput" placeholder="Price" v-model="price"/>
        <h1>Enter description</h1>
        <textarea class="mainInput descriptionInput" v-model="description"></textarea>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let header = ref(null);

let description = ref(null);

let price = ref(null);

let emits = defineEmits({
    'header-input': (text) => typeof text === "string",
    'description-input': (text) => typeof text === "string",
    'price-input': (price) => typeof price === "number",
})

watch(header, (newValue) => {
    emits('header-input', newValue);
})

watch(description, (newValue) => {
    emits('description-input', newValue);
})

watch(price, (newValue) => {
    emits('price-input', newValue);
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