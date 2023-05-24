<template>
    <div class="dialog">
        <Transition name="full-image-show">
            <div class="fullImageCont" v-if="chosenImage">
                <img class="closeButton" src="/images/close.png" @click="hideImage"/>
                <img class="galleryButton galleryNext" src="/images/gallery-next.png" 
                  @click="galleryNext" v-if="chosenImage !== (directory + imagesCount + '.png')"
                />
                <img class="galleryButton galleryBack" src="/images/gallery-next.png"
                  @click="galleryBack" v-if="chosenImage !== (directory + 'Main.png')"
                />
                <img class="fullImage" :src="chosenImage"/>
            </div>
        </Transition>

        <div class="interfaceCont">
            <img class="returnImage" src="/images/return.png" @click="hideAllImages"/>
            <div class="imagesCont">
                <GalleryImage :image="directory + 'Main.png'" @image-choose="onImageChoose"/>
                <GalleryImage v-for="num in imagesCount" :image="directory + num + '.png'" @image-choose="onImageChoose"/>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref } from 'vue';

import GalleryImage from './GalleryImage.vue';
let props = defineProps({
    directory: String,
    imagesCount: Number
})

let emits = defineEmits({
    'hide-dialog': null
})

let chosenImage = ref(null);

function onImageChoose(source) {
    chosenImage.value = source;
}

function hideImage() {
    chosenImage.value = null;
}

function galleryBack() {
    let imageNumber = findImageNumber(chosenImage.value);
    if(imageNumber == 1) {
        imageNumber = 'Main.png';
        chosenImage.value = props.directory + imageNumber;
        return;
    } else chosenImage.value = props.directory + --imageNumber + '.png';
}

function galleryNext() {
    let imageNumber = findImageNumber(chosenImage.value);
    if(imageNumber == 'Main') {
        imageNumber = 1;
        chosenImage.value = props.directory + imageNumber + '.png';
        return;
    } else chosenImage.value = props.directory + ++imageNumber + '.png';
}

function findImageNumber(path) {
    return path.replace(props.directory, '').replace('.png', '');
}

function hideAllImages() {
    emits('hide-dialog');
}
</script>

<style lang="scss">
.dialog {
    top: 0;
    position: fixed;
    background-color: #ffffff;
    z-index: 10001;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.interfaceCont {
    top: 0;
    left: 0;
    position: absolute;
    z-index: 10001;
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 70px;
    padding-bottom: 70px;
}

.fullImageCont {
    position: fixed;
    top: 0;
    z-index: 10002;
    height: 100%;
    width: 100%;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fullImage {
    max-width: 1000px;
    max-height: 1000px;
}

.imagesCont {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 800px;
}

.returnImage {
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 10001;
    top: 20px;
    left: 20px;
}

.galleryButton {
    position: absolute;
    cursor: pointer;
    width: 13px;
    height: 26px;
}

.galleryBack {
    left: 20px;
    transform: scaleX(-1);
}

.galleryNext {
    right: 20px;
}

.closeButton {
    cursor: pointer;
    width: 20px;
    height: 20px;
    position: absolute;
    z-index: 10002;
    top: 20px;
    left: 20px;
}

.full-image-show-enter-active {
    transition: all .3s ease;
}

.full-image-show-leave-active {
    transition: all .3s ease;
}

.full-image-show-enter-from {
    opacity: 0;
    transform: translateY(100vh);
}

.full-image-show-leave-to {
    opacity: 0;
    transform: translateY(100vh);
}
</style>