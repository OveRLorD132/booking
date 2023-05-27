<template>
    <div class="imageContainer" @click="setChosenImage"          
      :style="{gridColumn: index === 0 ? '1 / 3' : '', gridRow: index === 0 ?  '1 / 3' : ''}"
    >
        <img :src="image" class="rentImage" @click="showImage" 
          :class=" index === 0 ? 'mainImage' : 'subImage'"

        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
    image: null,
    index: Number
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
