<template>
    <Transition name="show-all-images">
        <AllImages :images="images" @hide-dialog="hideAllImages" :edit-is-visible="editIsVisible" :rent="rent"
            v-if="rent && allImagesIsVisible" @images-changed="onImagesChanged" />
    </Transition>
    <ComplainComponent @complaint-end="showComplaintEnd" @close-dialog="closeComplain" v-if="complainIsVisible" :rent="rent"/>
    <div class="mainContainer" v-if="rent">
        <FlashMessages :messages="messages"/>
        <title>{{ rent.header }}</title>
        <div class="rentContainer">
            <img class="rent-edit" src="/images/rent-edit.png" v-if="!isEditing && editIsVisible" @click="startEdit" />
            <div class="rentTitle">
                <h1 class="rent-header" v-if="!isEditing">
                    {{ rent.header }}
                    <img class="complain-btn" v-if="user && user.id != rent.user_id" @click="showComplain" src="/images/complain.png"/>
                </h1>
                <input type="text" v-if="isEditing" v-model="editedHeader" class="header-edit" />
                <div class="error-text" v-if="isEditing && headerError">{{ headerError }}</div>
                <div class="adressContainer">
                    <div class="address-left-side">
                        <div v-if="!isEditing" class="adressLabel">{{ rent.address.addressLine }}</div>
                        <input v-if="isEditing" type="text" class="address-edit" v-model="editedAddress" />
                        <div class="error-text" v-if="isEditing && addressError">{{ addressError }}</div>
                    </div>
                    <div class="ratingLabel">{{ rent.rating }}: {{ comments.length }}
                        {{ comments.length !== 1 ? 'comments' : 'comment' }}</div>
                </div>
            </div>
            <ImagesComponent :images="images" @click="showAllImages" />
            <div class="description">
                <h2 class="desc-header">
                    <div v-if="!isEditing">{{ rent.type }}</div>
                    <select class="select-type" v-model="editedType" v-if="isEditing">
                        <option class="type-option">Apartments</option>
                        <option class="type-option">House</option>
                        <option class="type-option">Room</option>
                        <option class="type-option">Villa</option>
                        <option class="type-option">Penthouse</option>
                        <option class="type-option">Duplex</option>
                        <option class="type-option">Guesthouse</option>
                    </select>
                    , rent by {{ rent.first_name }}
                </h2>
            </div>
            <div class="rentAbout">
                <h1>About</h1>
                <div class="mainDescription" v-if="!isEditing">{{ rent.description }}</div>
                <textarea v-if="isEditing" class="description-edit" v-model="editedDescription" />
                <div class="error-text" v-if="isEditing && descriptionError">{{ descriptionError }}</div>
            </div>
            <div class="rentPrice">
                <h2>{{ isEditing ? 'Enter price per day' : 'Price' }} </h2><template v-if="!isEditing">{{ rent.price }} per
                    day.</template>
                <input v-if="isEditing" type="text" class="price-edit" v-model="editedPrice" />
            </div>
            <div class="error-text" v-if="isEditing && priceError">{{ priceError }}</div>
            <div class="comments">
                <h1>Comments</h1>
                <div class="commentsContainer">
                    <CommentInput :user="user" :rent="rent" :socket="socket" />

                    <div class="messagesContainer">
                        <CommentComponent v-for="(comment, index) in comments" :key="comment.id" :comment="comment"
                          :user="user" :socket="socket" :index="index" :rent="rent" />
                    </div>
                </div>
            </div>
            <MapComponent :coords="rent.address.coords" :rent="rent" v-if="rent.address.coords || editIsVisible"
                @new-marker="setMarker" />
            <div class="host-info">
                <h2 class="host-info-label">About host</h2>
                <div class="user-short-info">
                    <img class="user-image" src="/images/no-avatar.png"/>
                    <div class="right-info-cont">
                        <div class="first-name">{{ rent.first_name }}</div>
                        <div class="joined-date">Joined {{ formatJoinDate(rent.join_date) }}</div>
                    </div>
                </div>
                <div class="host-description">{{ rent.user_description }}</div>
                <div class="contact-btn" @click="showHost">Contact host</div>
            </div>
        </div>
    </div>
    <div class="buttons-container" v-if="isEditing">
        <div class="left">
            <div class="resetButton" @click="reset">Reset</div>
            <div class="close-button" @click="closeEditing">Close</div>
        </div>
        <div class="submit-button" @click="submitEdit">Submit</div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import io from 'socket.io-client';
let socket = io();
import AllImages from './components/AllImages.vue';
import CommentInput from './components/CommentInput.vue';
import CommentComponent from './components/CommentComponent.vue';
import ImagesComponent from './components/ImagesComponent.vue';

import Comment from './module/Comment';
import MapComponent from './components/MapComponent.vue';

import validator from '../../module/rent-change/rent-validation';

import formatJoinDate from './module/format-join-date';
import ComplainComponent from './components/ComplainComponent.vue';

import FlashMessages from '../components/FlashMessages.vue';

let rent = ref(null);
let comments = ref([]);
let allImagesIsVisible = ref(false);
socket = ref(socket);

let router = useRouter();

let route = useRoute();

let props = defineProps({
    user: {type: Object, required: true},
    rent: {type: Object, required: true}
})

let emits = defineEmits({
})

onMounted(() => {
    rent.value = props.rent;
    console.log(props);
})

watch(() => props.user, (newValue) => {
    if (rent.value) {
        if (rent.value.user_id == newValue.id) editIsVisible.value = true;
    }
})

console.log(route);

let images = ref(null);

let editIsVisible = ref(false);

watch(() => props.rent, (newValue) => {
    console.log(props.rent);
    rent.value = newValue;
    socket.value.emit('load-request', rent.value.id);
    if (props.user) {
        if (rent.value.user_id == props.user.id) editIsVisible.value = true;
    }
    axios.get(`/load-photos?id=${rent.value.id}`).then(({ data }) => {
        images.value = data.map((file) => 'data:image/jpeg;base64,' + file)
    })
})

// axios.get(`${window.location.pathname}/rent`).then(({ data }) => {
//     rent.value = data;
//     rent.value.address = JSON.parse(data.address);
//     let rating = +rent.value.rating;
//     rent.value.rating = rating.toFixed(2);

    
// }).then(() => {
    
// }).catch((err) => {
//     console.error(err);
// })

socket.value.on('load-result', (response) => {
    for (let comment of response) {
        comment = new Comment(comment);
        comments.value.push(comment);
    }
})

socket.value.on('add-result', (comment) => {
    comment = new Comment(comment);
    comments.value.push(comment);
    calculateAvg();
})

socket.value.on('edit-result', (obj) => {
    for (let comment of comments.value) {
        if (obj.id === comment.id) comment.editComment(obj.text, obj.rating);
    }
    calculateAvg();
})
socket.value.on('delete-result', (index) => {
    comments.value.splice(index, 1);
    calculateAvg();
})

function showAllImages() {
    console.log(props);
    allImagesIsVisible.value = true;
    document.documentElement.classList.add('hide-html-overflow');
}

function hideAllImages() {
    allImagesIsVisible.value = false;
    document.documentElement.classList.remove('hide-html-overflow');
}

let isEditing = ref(false);

let editedHeader = ref(null);

let editedDescription = ref(null);

let editedPrice = ref(null);

let editedAddress = ref(null);

let editedType = ref(null);

function startEdit() {
    if (!props.user) return;
    if (rent.value.user_id != props.user.id) return;
    isEditing.value = true;
    if (!editedHeader.value) editedHeader.value = rent.value.header;
    if (!editedDescription.value) editedDescription.value = rent.value.description;
    if (!editedPrice.value) editedPrice.value = rent.value.price;
    if (!editedAddress.value) editedAddress.value = rent.value.address.addressLine;
    if (!editedType.value) editedType.value = rent.value.type;
}

function closeEditing() {
    isEditing.value = false;
}

function calculateAvg() {
    let ratingArray = comments.value.map((comment) => comment.rating);
    let fullRating = 0;
    for (let rating of ratingArray) {
        fullRating += +rating;
    }
    rent.value.rating = (fullRating / ratingArray.length).toFixed(2);
}

function reset() {
    editedAddress.value = rent.value.address.addressLine;
    editedDescription.value = rent.value.description;
    editedHeader.value = rent.value.header;
    editedImages.value = images.value.slice();
    editedPrice.value = rent.value.price;
    editedType.value = rent.value.type;
}

let addressError = ref(null);

watch(editedAddress, (newValue) => {
    try {
        validator.validateAddress(newValue);
        addressError.value = null;
    } catch (err) {
        addressError.value = err;
    }
})

let headerError = ref(null);

watch(editedHeader, (newValue) => {
    try {
        validator.validateHeader(newValue);
        headerError.value = null;
    } catch (err) {
        headerError.value = err;
    }
})

let descriptionError = ref(null);

watch(editedDescription, (newValue) => {
    try {
        validator.validateDescription(newValue);
        descriptionError.value = null;
    } catch (err) {
        descriptionError.value = err;
    }
})

let priceError = ref(null);

watch(editedPrice, (newValue) => {
    try {
        validator.validatePrice(newValue);
        priceError.value = null;
    } catch (err) {
        priceError.value = err;
    }
})

let typeError = ref(null);

async function submitEdit() {
    try {
        validator.validateAddress(editedAddress.value);
    } catch (err) {
        addressError.value = err;
    }
    try {
        validator.validateDescription(editedDescription.value);
    } catch (err) {
        descriptionError.value = err;
    }
    try {
        validator.validateHeader(editedHeader.value);
    } catch (err) {
        headerError.value = err;
    }
    try {
        validator.validatePrice(editedPrice.value);
    } catch (err) {
        priceError.value = err;
    }
    try {
        validator.validateType(editedType.value);
    } catch (err) {
        typeError.value = err;
    }
    if (!addressError.value && !descriptionError.value && !headerError.value && !priceError.value && !typeError.value) {
        axios.patch('/rent/change-properties', {
            rent_id: rent.value.id,
            addressLine: editedAddress.value,
            description: editedDescription.value,
            header: editedHeader.value,
            price: editedPrice.value,
            type: editedType.value
        }).then(({ data }) => {
            console.log(data);
            for (let key in data) {
                if (key === 'addressLine') rent.value.address.addressLine = data.addressLine;
                else rent.value[key] = data[key];
                isEditing.value = false;
            }
        })
    }

}

function onImagesChanged(changedImages) {
    images.value = changedImages;
}

function setMarker(marker) {
    rent.value.address.coords = marker;
} 

function showHost() {
    router.push('/host');
}

let complainIsVisible = ref(false);

function showComplain() {
    if(!props.user) return;
    if(props.user.id == rent.value.user_id) return;
    complainIsVisible.value = true;
}

function closeComplain() {
    complainIsVisible.value = false;
}

let messages = ref([]);

async function showComplaintEnd() {
    complainIsVisible.value = false;
    axios.get('/flash-messages').then(({ data }) => {
        messages.value = data;
    })
}
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';
@import '../../public/stylesheets/inputs.scss';

@mixin edit-input {
    font-family: 'Roboto';
    margin-bottom: 10px;
    margin-top: 10px;
    border: none;
    outline: none;
    padding: 10px 10px 10px 10px;
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
    font-family: 'Roboto';
    font-size: 17px;
    max-width: 500px;
}

.messagesContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.description {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-start;
}

.user-image {
    margin-right: 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.desc-header {
    display: flex;
    align-items: center;
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
    font-weight: 500;
}

.description-edit {
    @include edit-input;
    width: 500px;
    height: 300px;
}

.address-edit {
    text-decoration: underline;
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

.left {
    display: flex;
    flex-direction: row;
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
    right: 20px;
    background-color: $button-red;
}

.resetButton {
    @include profile-buttons;
    position: relative;
    background-color: $button-blue;
    left: 20px;
}

.select-type {
    @include edit-input;
    border-radius: 0 !important;
    font-size: 20px;
}

.type-option {
    background-color: #f2f2f2;
    font-family: 'Roboto';
    font-size: 15px;
}

.error-text {
    color: #de0000;
    align-self: flex-start;
    font-size: 20px;
}

.address-left-side {
    display: flex;
    flex-direction: column;
} 

.host-info {
    align-self: flex-start;
}

.first-name {
    margin-left: 5px;
    font-size: 24px;
    font-weight: 600;
}

.joined-date {
    color: $description-grey;
}

.user-short-info {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
}

.host-description {
    max-width: 700px;
}

.contact-btn {
    width: 250px;
    text-align: center;
    cursor: pointer;
    border: 2px black solid;
    border-radius: 10px;
    font-size: 18px;
    padding: 10px 10px 10px 10px;
    margin: 10px 10px 10px 0;
}

.contact-btn:hover {
    background-color: $calendar-grey;
}

.rent-header {
    display: flex; 
    align-items: center;
    justify-content: space-between;
}

.complain-btn {
    width: 30px;
    height: 30px;
    cursor: pointer;
}
</style>

