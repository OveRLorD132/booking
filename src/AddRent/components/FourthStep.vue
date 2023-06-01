<template>
    <div class="mainStepContainer">
        <div class="notUploaded" v-if="uploadedFiles.length === 0">
            <div class="inputContainer">
                <h1 :style="{textAlign: 'center'}">Upload images</h1>
                <div class="dragArea" @dragover="handleDragOver" @drop="handleFileDrop">
                    <img class="imagesPic" src="/images/images.png"/>
                    <h1>Drop files here</h1>
                    <label class="imageInput" for="imgInput">Select Files</label>
                </div>
            </div>
        </div>
        <div class="uploaded" v-if="uploadedFiles.length > 0">
            <div class="addContainer">
                <h1>You need at least 5 photos</h1>
                <label class="imageInput  inputButton" for="imgInput">Select Files</label>
            </div>
            <div class="uploadedImages">
                <ImageComponent v-for="(file, index) in uploadedFiles" :index="index" :image="file" 
                  :uploaded-files="uploadedFiles" @set-main="setMain" @push-further="pushFurther" 
                  @push-back="pushBack" @delete-image="deleteImage"
                />
            </div>
        </div>
        <input :style="{display: 'none'}" id="imgInput" type="file" @change="handleFileUpload" multiple/>
    </div>
</template>

<script setup>
import ImageComponent from './ImageComponent.vue';

import { ref, watch } from 'vue';

let emits = defineEmits({
    'files-uploaded': null,
})

let uploadedFiles = ref([]);

watch(() => uploadedFiles.value.length, () => {
    emits('files-uploaded', uploadedFiles.value);
})

let handleFileUpload = (event) => {
    let images = event.target.files;
    for(let image of images) {
        processUploadedFiles(image);
    }
}

let handleDragOver = (e) => {
    e.preventDefault();
}

let handleFileDrop = (e) =>{
    e.preventDefault()
    let images = e.dataTransfer.files;
    for(let image of images) {
        processUploadedFiles(image);
    }
}

function processUploadedFiles(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        let isMain = false;
        if(uploadedFiles.value.length === 0) isMain = true;
        uploadedFiles.value.push({src: event.target.result, isMain: isMain});
    }
}

function setMain(index) {
    let firstElem = uploadedFiles.value[0];
    firstElem.isMain = false;
    uploadedFiles.value[0] = uploadedFiles.value[index];
    uploadedFiles.value[0].isMain = true;
    uploadedFiles.value[index] = firstElem;
}

function pushFurther(index) {
    if(!uploadedFiles.value[index + 1]) return;
    let indexElem = uploadedFiles.value[index];
    if(indexElem.isMain) {
        uploadedFiles.value[index].isMain = false;
        uploadedFiles.value[index + 1].isMain = true;
    }
    uploadedFiles.value[index] = uploadedFiles.value[index + 1];
    uploadedFiles.value[index + 1] = indexElem;
}

function pushBack(index) {
    if(index === 0) return;
    let indexElem = uploadedFiles.value[index];
    if(uploadedFiles.value[index - 1].isMain) {
        uploadedFiles.value[index].isMain = true;
        uploadedFiles.value[index - 1].isMain = false;
    }
    uploadedFiles.value[index] = uploadedFiles.value[index - 1];
    uploadedFiles.value[index - 1] = indexElem;
}

function deleteImage(index) {
    if(!uploadedFiles.value[index]) return;
    uploadedFiles.value.splice(index, 1);
    if(uploadedFiles.value[0]) uploadedFiles.value[0].isMain = true;
}

</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/properties.scss';
@import '../../../public/stylesheets/inputs.scss';
@import '../../../public/stylesheets/colors.scss';
.mainStepContainer {
    display: flex;
    flex-direction: column;
}
.uploadedImages {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 700px;
}
.imageInput {
    font-size: 20px;
    text-decoration: underline;
    cursor: pointer;
}

.dragArea {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 500px;
    height: 500px;
    border: 2px dashed $active-grey;
    margin-bottom: 40px;
}

.imagesPic {
    width: 160px;
    height: 160px;
}

.addContainer {
    margin-right: 10px;
    margin-bottom: 10px;
    align-items: center;
    @include space-between;
}

.inputButton {
    @include button-style;
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 20px;
    padding-right: 20px;
    text-decoration: none !important;
    height: 40px;
}
</style>