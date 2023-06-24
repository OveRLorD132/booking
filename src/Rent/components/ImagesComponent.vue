<template>
    <div class="imagesContainer">
        <template v-for="(image, index) of images">
            <ImageComponent :image="image" :index="index" v-if="index < 5" @image-chosen="showAllImages" />
        </template>
    </div>
</template>

<script setup>

import ImageComponent from './ImageComponent.vue';

let props = defineProps({
    images: Array,
})

</script>

<style lang="scss">
@mixin imageButtons {
    padding-left: 5px;
    padding-bottom: 5px;
    padding-top: 5px;
    padding-right: 8px;
    background-color: rgb(256, 256, 256, 0.5);
    border-radius: 50%;
    width: 27px;
    height: 30px;
    cursor: pointer;
    position: absolute;
}

.imagesContainer {
    position: relative;
    min-height: 620px;
    max-width: 1240px;
    margin-top: 10px;
    display: grid;
    align-content: center;
    align-items: center;
    grid-template-columns: repeat(4, 300px);
    gap: 10px;
}

.sideImagesContainer {
    align-self: flex-start;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.rentImage {
    border-radius: 10px;
    cursor: pointer;
    object-position: center;
    object-fit: cover;
}

.mainImage {
    width: 610px;
    height: 610px;
}

.subImage {
    width: 300px;
    height: 300px;
}

.fullImageContainer {
    position: fixed;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(41, 41, 41, 0.5);
}

.fullImage {
    max-width: 1000px;
    max-height: 1000px;
}

.nextButton {
    @include imageButtons;
    transform: scaleX(-1);
    right: 10px;
}

.backButton {
    @include imageButtons;
    left: 10px;
}

@mixin galleryButtons {
    width: 37px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50%;
    padding-left: 5px;
    padding-bottom: 5px;
    padding-top: 5px;
    padding-right: 8px;
    cursor: pointer;
    position: absolute;
}

.nextPage {
    @include galleryButtons;
    transform: scaleX(-1);
    right: 10px;
}

.backPage {
    @include galleryButtons;
    left: 10px;
}
</style>