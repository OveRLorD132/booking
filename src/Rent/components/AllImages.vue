<template>
    <div class="dialog">
        <Transition name="full-image-show">
            <div class="fullImageCont" v-if="chosenImage !== undefined">
                <img class="closeButton" src="/images/close.png" @click.stop="hideImage" />
                <img class="galleryButton galleryNext" src="/images/gallery-next.png" @click="galleryNext"
                    v-if="chosenImage !== images.length - 1" />
                <img class="galleryButton galleryBack" src="/images/gallery-next.png" @click="galleryBack"
                    v-if="chosenImage !== 0" />
                <img class="fullImage" :src="images[chosenImage]" />
            </div>
        </Transition>
        <div class="upload-dialog" v-if="isUploading" @click="closeUpload">
            <div class="upload-container" :class="isHovered ? 'expanded' : ''" @dragover="handleDragOver"
             @dragleave.stop="handleDragLeave" @drop="handleFileDrop"
            >
                <div class="upload-border">
                    <input type="file" id="img-upload" style="display: none;" ref="fileInput" @change="handleFileUpload" multiple/>
                    <img class="image-icon" :src="imageSource" @dragleave.stop/>
                    <div class="upload-text">Drop or <label for="img-upload" class="file-input">select</label> files to upload</div>
                </div>
            </div>
        </div>
        <div class="interfaceCont">
            <img class="returnImage" src="/images/return.png" @click="hideAllImages" />
            <div class="add-button" @click="showUpload" v-if="isEditing"><img class="add-image" src="/images/add.png" />Add
                Image</div>
            <img class="edit-button" v-if="!isEditing && editIsVisible" src="/images/rent-edit.png" @click="startEditing"/>
            <div class="imagesCont">
                <GalleryImage v-for="(image, index) of isEditing ? editedImages : images" :image="image" :index="index" @image-choose="onImageChoose"
                    :is-editing="isEditing" :length="images.length" @set-main="setMain" @delete-image="deleteImage"
                    @push-back="pushBack" @push-further="pushFurther" />
            </div>
        </div>
        <div class="buttons-container" v-if="isEditing">
        <div class="left">
            <div class="resetButton" @click="reset">Reset</div>
            <div class="close-button" @click="closeEditing">Close</div>
        </div>
        <div class="submit-button" @click="submitEdit">Submit</div>
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import GalleryImage from './GalleryImage.vue';
import axios from 'axios';
let props = defineProps({
    images: Array,
    editIsVisible: Boolean,
    rent: Object,
})

let editedImages = ref(null);

let isEditing = ref(false);

function startEditing() {
    isEditing.value = true;
    if(!editedImages.value) editedImages.value = props.images.slice();
}

function reset() {
    editedImages.value = props.images;
}

function closeEditing() {
    isEditing.value = false;
}

let imagesError = ref(null);

function submitEdit() {
    if(editedImages.value.length < 5) {
        imagesError.value = "You must have at least 5 photos.";
        return;
    }
    else axios.patch('/rent/change-images', {images: editedImages.value, rent_id: props.rent.id}).then(({data}) => {
        emits('images-changed', data);
        isEditing.value = false;
    })
}

let emits = defineEmits({
    'hide-dialog': null,
    'images-changed': null 
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
    if (chosenImage.value < 1) return;
    chosenImage.value--;
}

function galleryNext() {
    if (chosenImage.value > props.images.length - 2) return;
    chosenImage.value++;
}

function hideAllImages() {
    emits('hide-dialog');
}

function setMain(index) {
    if (!index) return;
    let mainImage = editedImages.value[0];
    editedImages.value[0] = editedImages.value[index];
    editedImages.value[index] = mainImage;
}

function pushFurther(index) {
    let prevImage = editedImages.value[index];
    editedImages.value[index] = editedImages.value[index + 1];
    editedImages.value[index + 1] = prevImage;
}

function pushBack(index) {
    let prevImage = editedImages.value[index];
    editedImages.value[index] = editedImages.value[index - 1];
    editedImages.value[index - 1] = prevImage;
}

function deleteImage(index) {
    editedImages.value.splice(index, 1);
}

let isUploading = ref(false);

function showUpload() {
    isUploading.value = true;
}

let isHovered = ref(false);

function handleDragOver(event) {
    event.preventDefault();
    isHovered.value = true;
    imageSource.value = '/images/cloud-upload.png';
}

let leaveTimeout = ref(null);

function handleDragLeave(event) {
    event.preventDefault()
    leaveTimeout.value = requestAnimationFrame(() => {
        isHovered.value = false;
        imageSource.value = '/images/image.png';
    })
}

let imageSource = ref('/images/image.png')

function handleFileDrop(event) {
    event.preventDefault();
    let files = event.dataTransfer.files;
    emitUpload(files);

}

function closeUpload() {
    isUploading.value = false;
}

async function emitUpload(files) {
    let processedFiles = [];
    for(let file of files) {
        processedFiles.push(processUpload(file));
    }
    processedFiles = await Promise.all(processedFiles);
    editedImages.value = [...editedImages.value, ...processedFiles]
    isUploading.value = false; 
}

function processUpload(image) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (event) => {
            resolve(event.target.result);
        }
        reader.onerror = reject;    
    })
}

let fileInput = ref();

async function handleFileUpload(event) {
    console.log(event.target.files);
    let files = fileInput.value.files;
    try {
        await emitUpload(files);
    } catch(err) {
        console.error(err);
    }
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';
@import '../../../public/stylesheets/inputs.scss';

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
    z-index: 100;
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
    z-index: 101;
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

.add-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
}

.add-image {
    width: 30px;
    height: 30px;
}

.upload-dialog {
    width: 100%;
    height: 100%;
    background-color: rgb(117, 117, 117, 0.5);
    position: fixed;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-container {
    padding: 10px 10px 10px 10px;
    width: 550px;
    height: 250px;
    background-color: #ffffff;
    border-radius: 20px;
}

.upload-container {
    &.expanded {
        width: 600px;
        height: 300px;
        transition: width 0.3s ease, height 0.3s;
    }
    &:not(.expanded) {
        transition: width 0.3s ease, height 0.3s;
    }
}


.upload-border {
    border-radius: 20px;
    width: 100%;
    height: 100%;
    border: 1px $active-grey dashed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.image-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 30px;
}

.file-input {
    text-decoration: underline;
    cursor: pointer;
}

.buttons-container {
    position: fixed;
    bottom: 0;
    padding: 0 0 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    z-index: 100;
}

.close-button {
    @include profile-buttons;
    position: relative;
    left: 30px;
    background-color: $button-blue;
}

.submit-button {
    @include profile-buttons;
    position: relative;
    right: 40px;
    background-color: $button-red;
}

.edit-button {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
}

.left {
    display: flex;
    flex-direction: row;
}


.resetButton {
    @include profile-buttons;
    position: relative;
    background-color: $button-blue;
    left: 20px;
}
</style>