<template>
    <UpperLine @user-profile="loadProfile"/>
    <Transition name="show-all-images">
        <AllImages :images="isEditing ? editedImages : images" :is-editing="isEditing" @hide-dialog="hideAllImages" 
          v-if="rent && allImagesIsVisible" @set-main="setMain" @delete-image="deleteImage" 
          @push-back="pushBack" @push-further="pushFurther"
        />
    </Transition>
    <div class="mainContainer" v-if="rent">
        <title>{{ rent.header }}</title>
        <div class="rentContainer" @mouseover="showEdit" @mouseleave="hideEdit">
            <img class="rent-edit" src="/images/rent-edit.png" v-if="!isEditing && editIsVisible" @click="startEdit"/> 
            <div class="rentTitle">
                <h1 v-if="!isEditing">{{ rent.header }}</h1>
                <input type="text" v-if="isEditing" v-model="editedHeader" class="header-edit"/>
                <div class="adressContainer">
                    <div v-if="!isEditing" class="adressLabel">{{ rent.address.addressLine }}</div>
                    <input v-if="isEditing" type="text" class="address-edit" v-model="editedAddress"/>
                    <div class="ratingLabel">{{  rent.rating }}: {{ comments.length }} 
                    {{ comments.length !== 1 ? 'comments' : 'comment'}}</div>
                </div>

            </div>
            <img :src="imageSource" />
            <ImagesComponent :images="images" @click="showAllImages"/>
            <div class="description"><h2>{{ rent.type }}, rent by {{ rent.user_name }}</h2></div>
            <div class="rentAbout">
                <h1>About</h1>
                <div class="mainDescription" v-if="!isEditing">{{ rent.description }}</div>
                <textarea v-if="isEditing" class="description-edit" v-model="editedDescription"/>
            </div>
            <div class="rentPrice">
                <h2>{{isEditing ? 'Enter price per day' : 'Price'}} </h2><template v-if="!isEditing">{{ rent.price }} per day.</template>
                <input v-if="isEditing" type="text" class="price-edit" v-model="editedPrice"/>
            </div>
            <div class="comments">
                <h1>Comments</h1>
                <div class="commentsContainer">
                    <CommentInput :user="user" :rent="rent" :socket="socket"/>

                    <div class="messagesContainer" >
                        <CommentComponent v-for="(comment, index) in comments" :key="comment.id" 
                          :comment="comment" :user="user" :socket="socket" :index="index" :rent="rent"
                        />
                    </div>
                </div>
            </div>
            <MapComponent v-if="rent.address.coords" :coords="rent.address.coords" :is-editing="isEditing"/>
        </div>  
    </div>
    <div class="buttons-container" v-if="isEditing">
        <div class="close-button" @click="closeEditing">Close</div>
        <div class="submit-button" @click="submitEdit">Submit</div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
let socket = io();
import AllImages from './components/AllImages.vue';
import CommentInput from './components/CommentInput.vue';
import CommentComponent from './components/CommentComponent.vue';
import ImagesComponent from './components/ImagesComponent.vue';

import Comment from './module/Comment';
import UpperLine from '../Profile/components/UpperLine.vue';
import MapComponent from './components/MapComponent.vue';

let rent = ref(null);
let user = ref(null);
let comments = ref([]);
let allImagesIsVisible = ref(false);
socket = ref(socket);

let images = ref(null);

let directory = ref(null);

let loadProfile = (profile) => {
    user.value = profile;
    console.log(profile);
}
onMounted(async () => {
    try {
        axios.get(`${window.location.pathname}/rent`).then(({ data }) => {
            rent.value = data;
            rent.value.address = JSON.parse(data.address);
            directory.value = `/rent-photos/${rent.value.user_name + rent.value.user_id}/${rent.value.id}/`;
            socket.value.emit('load-request', rent.value.id);
        }).then(() => {
            console.log(rent)
            axios.get(`/load-photos?id=${rent.value.id}`).then(({data}) => {
                images.value = data.map((file) => 'data:image/jpeg;base64,' + file)
                console.log(images);
            })
        })

    } catch(err) {
        console.error(err);
    }
})

socket.value.on('load-result', (response) => {
    for(let comment of response) {
        comment = new Comment(comment);
        comments.value.push(comment);
    }
})

socket.value.on('add-result', ({comment, rating}) => {
    console.log(arguments);
    comment = new Comment(comment);
    comments.value.push(comment);
    rent.value.rating = rating;
})

socket.value.on('edit-result', (obj) => {
    for(let comment of comments.value) {
        if(obj.id === comment.id) comment.editComment(obj.text, obj.rating);
    } 
    rent.value.rating = obj.rent_rating;
})
socket.value.on('delete-result', ({index, rating}) => {
    rent.value.rating = rating;
    comments.value.splice(index, 1);
})

function showAllImages() {
    allImagesIsVisible.value = true;
}

function hideAllImages() {
    allImagesIsVisible.value = false;
}

let editIsVisible = ref(false);

function showEdit() {
    if(!user.value) return;
    if(rent.value.user_id !== user.value.id) return;
    editIsVisible.value = true;
}

function hideEdit() {
    if(!user.value) return;
    if(rent.value.user_id !== user.value.id) return;
    editIsVisible.value = false;
}

let isEditing = ref(false);

let editedHeader = ref(null);

let editedDescription = ref(null);

let editedPrice = ref(null);

let editedAddress = ref(null);

function startEdit() {
    if(!user.value) return;
    if(rent.value.user_id !== user.value.id) return;
    isEditing.value = true;
    if(!editedHeader.value) editedHeader.value = rent.value.header;
    if(!editedDescription.value) editedDescription.value = rent.value.description;
    if(!editedPrice.value) editedPrice.value = rent.value.price;
    if(!editedAddress.value) editedAddress.value = rent.value.address.addressLine;
    if(!editedImages.value) {
        editedImages.value =  [];
        for(let image of images.value) {
            editedImages.value.push(image);
        } 
    } 
}

function closeEditing() {
    isEditing.value = false;
}

let editedImages = ref(null);

function setMain(index) {
    console.log(index);
    if(!index) return;
    let mainImage = editedImages.value[0];
    editedImages.value[0] = editedImages.value[index];
    editedImages.value[index] = mainImage;
    console.log(editedImages);
}

function deleteImage(index) {
    editedImages.value.splice(index, 1);
}
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';
@import '../../public/stylesheets/inputs.scss';

@mixin edit-input {
    margin-bottom: 10px;
    margin-top: 10px;
    border: none;
    outline: none;
    padding: 10px 10px 10px 10px;
    border-radius: 10px;
    background-color: #f2f2f2;
}

.rentTitle {
    align-self: flex-start;
    width: 100%;
}

.rentPrice {
    align-self: flex-start;
}

.adressContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.mainContainer {
    margin-top: 70px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.rentContainer {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-left: 100px;
    padding-right: 100px;
    position: relative;
}

.adressLabel {
    color: black;
    text-decoration: underline;
}

.rentAbout {
    align-self: flex-start;
}

.mainDescription {
    font-family: 'Proxima-Nova';
    font-size: 17px;
    max-width: 500px;
}

.messagesContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.description {
    align-self: flex-start;
}

.comments {
    align-self: flex-start;
}

.show-all-images-enter-active {
    transition: all .3s;
}

.show-all-images-leave-active {
    transition: all .3s;
}

.show-all-images-enter-from {
    opacity: 0;
    transform: translateY(100vh);
}

.show-all-images-leave-to {
    opacity: 0;
    transform: translateY(100vh);
}

.rent-edit {
    position: absolute;
    right: 120px;
    top: 20px;
    width: 40px;
    height: 40px;
    cursor: pointer;
}
.header-edit {
    @include edit-input;
    font-size: 2em;
}

.description-edit {
    @include edit-input;
    width: 500px;
    height: 300px;
}

.address-edit {
    @include edit-input;
}

.price-edit {
    @include edit-input;
}

.buttons-container {
    position: fixed;
    bottom: 0;
    padding: 0 0 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

.close-button {
    @include profile-buttons;
    position: relative;
    left: 20px;
    background-color: $button-blue;
}

.submit-button {
    @include profile-buttons;
    position: relative;
    right: 20px;
    background-color: $button-red;
}

</style>

