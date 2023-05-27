<template>
    <div class="dialog">
        <Transition name="full-image-show">
            <div class="fullImageCont" v-if="chosenImage !== undefined">
                <img class="closeButton" src="/images/close.png" @click="hideImage"/>
                <img class="galleryButton galleryNext" src="/images/gallery-next.png" 
                  @click="galleryNext" v-if="chosenImage !== images.length - 1"
                />
                <img class="galleryButton galleryBack" src="/images/gallery-next.png"
                  @click="galleryBack" v-if="chosenImage !== 0"
                />
                <img class="fullImage" :src="images[chosenImage]"/>
            </div>
        </Transition>

        <div class="interfaceCont">
            <img class="returnImage" src="/images/return.png" @click="hideAllImages"/>
            <div class="imagesCont">
                <GalleryImage v-for="(image, index) of images"
                 :image="image" :index="index" @image-choose="onImageChoose" :is-editing="isEditing" 
                 :length="images.length" @set-main="setMain" @delete-image="deleteImage" 
                 @push-back="pushBack" @push-further="pushFurther"
                />
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, watch } from 'vue';

import GalleryImage from './GalleryImage.vue';
let props = defineProps({
    images: Array,
    isEditing: Boolean
})

let emits = defineEmits({
    'hide-dialog': null,
    'set-main': (index) => typeof index === 'number',
    'push-further': (index) => typeof index === 'number',
    'push-back': (index) => typeof index === 'number',
    'delete-image': (index) => typeof index === 'number',
})

let chosenImage = ref(undefined);

function onImageChoose(index) {
    console.log(index);
    chosenImage.value = index;
}

function hideImage() {
    chosenImage.value = undefined;
}

function galleryBack() {
    if(chosenImage.value < 1) return;
    chosenImage.value--; 
}

function galleryNext() {
    if(chosenImage.value > props.images.length - 2) return;
    chosenImage.value++;
}

function findImageNumber(path) {
    return path.replace(props.directory, '').replace('.png', '');
}

function hideAllImages() {
    emits('hide-dialog');
}

function setMain(index) {
    emits('set-main', index);
} 

function pushFurther(index) {
    emits('push-further', index);
}

function pushBack(index) {
    emits('push-back', index);
}

function deleteImage(index) {
    emits('delete-image', index);
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