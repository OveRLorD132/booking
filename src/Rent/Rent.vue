<template>
    <LineComponent @load-profile="loadProfile"/>
    <div class="mainContainer" v-if="rent">
        <div class="rentContainer">
            <div class="rentTitle">
                <h2>
                    {{ rent.title }}
                </h2>
                <div class="adressLabel">{{ rent.adress }}</div>
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
                <div class="mainDescription" v-html="rent.description"></div>
            </div>
            <div class="rentPrice">
                <h3>Price: </h3>
                {{ rent.price }} per day.
            </div>
            <div class="comments">
                <h2>Comments</h2>
                <div class="commentsContainer">
                    <form @submit.prevent="addComment">
                        <input type="text" v-model="newComment" />
                        <input type="submit" value="Send" /> 
                    </form>
                    <template v-for="comment in comments" :key="comment.id">
                        <div >{{ comment.text }}</div>
                    </template>
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

let rent = ref(null);
let user = ref(null);
let comments = ref([]);


let loadProfile = (profile) => {
    user.value = profile;
    console.log(profile);
}
onMounted(async () => {
    try {
        axios.get(`${window.location.pathname}/rent`).then(({ data }) => {
            rent.value = data.rows[0];
            socket.emit('load-request', rent.value.id);
        })
    } catch(err) {
        console.error(err);
    }
})
let newComment = ref(null);

let addComment = () => {
    socket.emit('add-comment', {
        rent_id: rent.value.id,
        text: newComment.value,
        user_id: user.value.id,
    });
}
socket.on('load-result', (response) => {
    comments.value = response;
})

socket.on('comment-added', (comment) => {
    comments.value.push(comment);
})
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';
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
</style>