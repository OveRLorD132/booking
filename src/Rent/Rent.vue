<template>
    <LineComponent @load-profile="loadProfile"/>
    <Transition name="show-all-images">
        <AllImages :directory="directory" :imagesCount="rent.images_count" 
          @hide-dialog="hideAllImages" v-if="rent && allImagesIsVisible"
        />
    </Transition>
    
    <div class="mainContainer" v-if="rent">
        <div class="rentContainer">
            <div class="rentTitle">
                <h1>
                    {{ rent.header }}
                </h1>
                <div class="adressContainer">
                    <div class="adressLabel">{{ rent.address.addressLine }}</div>
                    <div class="ratingLabel">{{  rent.rating }}: {{ comments.length }} 
                    {{ comments.length !== 1 ? 'comments' : 'comment'}}</div>
                </div>

            </div>
            <ImagesComponent :images-count="rent.images_count" :directory="directory" @click="showAllImages"/>
            <div class="description"><h2>{{ rent.type }}, rent by {{ rent.user_name }}</h2></div>
            <div class="rentAbout">
                <h1>About</h1>
                <div class="mainDescription">{{ rent.description }}</div>
            </div>
            <div class="rentPrice">
                <h2>Price: </h2>
                {{ rent.price }} per day.
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
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
let socket = io();
import AllImages from './components/AllImages.vue';
import LineComponent from '../components/LineComponent.vue';
import CommentInput from './components/CommentInput.vue';
import CommentComponent from './components/CommentComponent.vue';
import ImagesComponent from './components/ImagesComponent.vue';

import Comment from './module/Comment';

let rent = ref(null);
let user = ref(null);
let comments = ref([]);
let allImagesIsVisible = ref(false);
socket = ref(socket);

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
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';
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
    margin-top: 45px;
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
</style>