<template>
    <div class="imagesContainer">
        <ImageComponent v-for="(image, index) of images" :image="image" :index="index"
          @image-chosen="showAllImages" 
        />
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
    min-height: 420px;
    max-width: 840px;
    margin-top: 10px;
    display: grid;
    align-content: center;
    align-items: center;
    grid-template-columns: repeat(4, 200px);
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
    width: 410px;
    height: 410px;
}

.subImage {
    width: 200px;
    height: 200px;
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