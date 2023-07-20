<template>
  <div class="image-dialog">
    <img class="close-btn" @click="hideDialog" src="/images/delete.png"/>
    <img class="back-button" v-if="isLoading" @click="uploadBack" src="/images/return.png"/>
    <div class="image-cont" v-if="!isLoading">
      <img class="profile-full-img" :src="`/profile-images/${user.id}.png`" onerror="this.src=`/images/no-avatar.png`"/>
      <div class="buttons">
        <div class="delete-btn" @click="deleteImg">Delete</div>
        <div class="change-btn" @click="showUpload">Change</div>
      </div>
    </div>
    <template v-if="isLoading">
      <div class="img-input" v-if="!uploadedFile" :class="isHovered ? 'expanded' : ''"
        @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleFileDrop">
        <div class="border-cont">
          <input type="file" style="display: none;" id="img-upload" ref="fileInput" @change="handleFileUpload"/>
          <img class="image-icon" src="/images/image.png"/>
          <div class="upload-text">Drop or <label for="img-upload" class="file-input">select</label> file</div>
        </div>
      </div>
      <div v-else>
        <div class="upload-cont">
          <img class="crop-img" ref="userImage" :src="uploadedFile"/>
          <div class="buttons-cont">
            <div class="delete-btn" @click="deletePicked">Delete</div>
            <div class="submit-btn" @click="submitChange">Submit</div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import axios from 'axios';
import Cropper from 'cropperjs';
import { nextTick, ref } from 'vue';

let isLoading = ref(false);

let props = defineProps({
  user: Object
})

let emits = defineEmits({
  'dialog-close': null,
})

function hideDialog() {
  uploadedFile.value = null;
  isLoading.value = false;
  emits('dialog-close');
}

function showUpload() {
  isLoading.value = true;
}

let isHovered = ref(false);

function handleDragOver() {
  isHovered.value = true;
}

function handleDragLeave() {
  isHovered.value = false;
}

function handleFileDrop(event) {
  processUpload(event.dataTransfer.files[0]);
}

let fileInput = ref();

function handleFileUpload() {
  processUpload(fileInput.value.files[0]);
  fileInput.value.files = null;
}

let uploadedFile = ref(null);

let cropper = ref(null);

let userImage = ref();

async function processUpload(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    uploadedFile.value = event.target.result;
    nextTick(() => {
      console.log(uploadedFile.value);
      cropper.value = new Cropper(userImage.value, {
        aspectRatio: 1,
        viewMode: 1,
        minCropBoxHeight: 256,
        minCropBoxWidth: 256,
        dragMode: 'move',
        background: false,
        cropBoxResizable: false,
        cropBoxMovable: false,
      })
    })
  }
}

function uploadBack() {
  if(uploadedFile.value) uploadedFile.value = null;
  else isLoading.value = false;
}

function deleteImg() {
  try {
    axios.delete('/profile/image-delete')
    location.reload();
  } catch(err) {
    console.error(err);
  }
}

function submitChange() {
  let file = cropper.value.getCroppedCanvas();
  try {
    axios.post('/profile/image-upload', {img: file.toDataURL('image/png')})
    location.reload()
  } catch(err) {
    console.error(err);
  }
}

function deletePicked() {
  uploadedFile.value = null;
}
</script>

<style lang="scss">
@import 'cropperjs/dist/cropper.css';

@import '../../../public/stylesheets/colors.scss';
@import '../../../public/stylesheets/inputs.scss';

.image-dialog {
  width: 100%;
  height: 100%;
  background-color: rgb(117, 117, 117, 0.5);
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-full-img {
  width: 380px;
  height: 380px;
}

.image-cont {
  padding: 20px 20px 20px 20px;
  background-color: #fff;
  border-radius: 10px;
}

.delete-btn {
  @include profile-buttons;
  margin-top: 10px;
  background-color: $button-blue;
  &:hover {
    background-color: $button-hover-blue;
  }
}

.change-btn {
  @include profile-buttons;
  margin-top: 10px;
  background-color: $button-red;
}

.buttons-cont {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.submit-btn {
  @include profile-buttons;
  margin-top: 10px;
  background-color: $button-red;
  &:hover {
    background-color: $button-hover-red;
  }
}

.change-btn:hover {
  background-color: $button-hover-red;
}

.delete-btn:hover {
  background-color: $button-hover-blue;
}

.img-input {
  &.expanded {
    width: 600px;
    height: 300px;
    transition: width 0.3s ease, height 0.3s;
  }
  &:not(.expanded) {
    transition: width 0.3s ease, height 0.3s;
  }
  width: 550px;
  height: 250px;
  background-color: #fff;
  padding: 10px;
  border-radius: 20px;
}

.border-cont {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px dashed $active-grey;
}

.image-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 30px;
}

.file-input {
  cursor: pointer;
  text-decoration: underline;
}

.upload-cont {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
}

.crop-img {
  max-width: 480px;
  max-height: 480px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
}

.back-button {
  top: 10px;
  left: 10px;
  position: absolute;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
}
</style>