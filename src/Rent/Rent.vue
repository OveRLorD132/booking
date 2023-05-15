<template>
    <LineComponent @load-profile="loadProfile"/>
    <div class="mainContainer" v-if="rent">
        <div class="rentContainer">
            <div class="rentTitle">
                <h2>
                    {{ rent.title }}
                </h2>
                <div class="adressContainer">
                    <div class="adressLabel">{{ rent.adress }}</div>
                    <div class="ratingLabel">{{  rent.rating }}: {{ comments.length }} 
                    {{ comments.length > 1 ? 'comments' : 'comment'}}</div>
                </div>

            </div>
            <div class="imagesContainer">
                <img class="mainImage" src="/images/no-photo.png" />
                <div class="sideImages">
                    <img class="sideImage" src="/images/no-photo.png" />
                    <img class="sideImage" src="/images/no-photo.png" />
                    <img class="sideImage" src="/images/no-photo.png" />
                    <img class="sideImage" src="/images/no-photo.png" />
                </div>
            </div>

            <div class="description">{{ rent.type }}, rent by Overlord</div>
            <div class="rentAbout">
                <h3>About</h3>
                <div class="mainDescription">{{ rent.description }}</div>
            </div>
            <div class="rentPrice">
                <h3>Price: </h3>
                {{ rent.price }} per day.
            </div>
            <div class="comments">
                <h2 :style="{ 'margin-left': '10px'}">Comments</h2>
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
import LineComponent from '../components/LineComponent.vue';
import CommentInput from './components/CommentInput.vue';
import CommentComponent from './components/CommentComponent.vue';

import Comment from './module/Comment';

let rent = ref(null);
let user = ref(null);
let comments = ref([]);
socket = ref(socket);



let loadProfile = (profile) => {
    user.value = profile;
    console.log(profile);
}
onMounted(async () => {
    try {
        axios.get(`${window.location.pathname}/rent`).then(({ data }) => {
            rent.value = data.rows[0];
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
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';

.adressContainer {
    max-width: 800px;
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
    width: 100%;
    margin-left: 200px;
    margin-right: 200px;
}

.mainImage {
    width: 400px;
    height: 400px;
}

.adressLabel {
    color: black;
    text-decoration: underline;
}

.mainDescription {
    font-family: 'Proxima-Nova';
    max-width: 800px;
}

.imagesContainer {
    display: flex;
    flex-direction: row;
}

.sideImages {
    display: flex;
    flex-direction: row;
    width: 400px;
    flex-wrap: wrap;
}

.sideImage {
    width: 200px;
    height: 200px;
}

.messagesContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>