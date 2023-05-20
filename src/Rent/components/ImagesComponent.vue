<template>
    <div class="fullImageContainer" v-if="chosenImage" @click="hideFullImage">
        <img class="nextButton" src="/images/imgButton.png" @click.stop="nextImage" 
          v-show="chosenImage === 'Main' || chosenImage < imagesCount"
        />
        <img class="backButton" src="/images/imgButton.png" @click.stop="back" 
          v-show="chosenImage !== 'Main' || chosenImage > imagesCount"
        />
        <img :src="chosenImageSource" class="fullImage" @click.stop />
    </div>
    <div class="imagesContainer" @mouseover="showButtons" @mouseleave="hideButtons">
        <img class="nextPage" src="/images/imgButton.png" @click.stop="nextPage" v-if="isHovered && !((4 + (page * 8)) >= imagesCount)"/>
        <img class="backPage" src="/images/imgButton.png" @click.stop="backPage" v-if=" isHovered && page !== 0"/>
        <ImageComponent :name="'Main'" :image="`${directory}Main.png`" @image-chosen="setChosenImage" v-if="!page"/>
        <div class="sideImagesContainer">
            <ImageComponent v-for="num in (page === 0 ? 4 : (imagesCount - photosBefore - photosAfter))" 
              :image="`${directory}${num + photosBefore}.png`" 
              :name="num + photosBefore" @image-chosen="setChosenImage"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import ImageComponent from './ImageComponent.vue';

let props = defineProps({
    directory: String,
    imagesCount: Number,
})

let isHovered = ref(null);

let chosenImage = ref(null);

let chosenImageSource = ref(null);

let page = ref(0);

let photosAfter = ref(0);

let photosBefore = ref(null);

watch(page, (newValue, oldValue) => {
    if(newValue === 0) {
        photosBefore.value = 0;
    } else if(newValue === 1) {
        photosBefore.value = 4;
    } else {
        if(oldValue > newValue) photosBefore.value -= 8;
        else photosBefore.value += 8;
    } 
    photosAfter.value = props.imagesCount - photosBefore.value - 8;
    if(photosAfter.value < 0) photosAfter.value = 0;
})

watch(chosenImage, (newValue) => {
    chosenImageSource.value = `${props.directory}${newValue}.png`
})

function setChosenImage(name) {
    chosenImage.value = name;
}

function nextImage() {
    if(chosenImage.value === 'Main') {
        chosenImage.value = 1;
        return;
    } else chosenImage.value++;
}

function back() {
    if(chosenImage.value === 1) {
        chosenImage.value = 'Main';
        return;
    } else chosenImage.value--;
}

function hideFullImage() {
    chosenImage.value = "";
}

function nextPage() {
    page.value++;
}

function backPage() {
    page.value--;
}


function showButtons() {
    isHovered.value = true;
}

function hideButtons() {
    isHovered.value = false;
}
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
    display: flex;
    flex-direction: row;
    align-items: center;
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
    margin-bottom: 10px;
    margin-right: 10px;
}
.mainImage {
    margin-right: 10px;
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