<template>
    <div class="galleryImageContainer">
        <img :src="image" class="galleryImage" :style="{width: /Main\.png/.test(image) ? '770px' : '250px',
        height: /Main\.png/.test(image) ? '770px' : '250px'}" 
        @click="showFullImage"/>
    </div>
</template>

<script setup>
let props = defineProps({
    image: String
})

let emits = defineEmits({
    'image-choose': (source) => typeof source === 'string'
})

function showFullImage() {
    emits('image-choose', props.image);
}
</script>

<style lang="scss">
.galleryImageContainer {
    margin-right: 10px;
    margin-bottom: 10px;
}
.galleryImage {
    width: 250px;
    height: 250px;
    object-fit: cover;
    cursor: pointer;
}
</style>