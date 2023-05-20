<template>
    <div class="imageContainer" @click="setChosenImage">
        <img :src="image" class="rentImage" @click="showImage" 
          :class=" name === 'Main' ? 'mainImage' : 'subImage'"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
    image: null,
    name: Number
})

let emits = defineEmits({
    'image-chosen': (name) => typeof name === 'number' || typeof name === 'string',
})

function setChosenImage() {
    emits('image-chosen', props.name);
}
</script>

<style lang="scss">

</style>
