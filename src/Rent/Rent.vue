<template>
    <div class="comment-dialog" v-if="inputIsVisible" @click="hideInput">
        <div class="comment-input-container" @click.stop>
            <h2>Enter comment</h2>
            <div class="starContainer">
                <div class="star" 
                  v-for="index in 5" 
                  :key="index"
                  @mouseover="highlightStars(index)"
                  @mouseleave="hideHighlight"
                  @click="setRating(index)"
                >{{ starDisplay(index) }}</div>
                <input class="rating-input" type="text" v-model="rating" />
            </div>
            <div class="error-text">{{ ratingError }}</div>
            <textarea class="comment-input" v-model="enteredComment"></textarea>
            <div class="error-text">{{ commentError }}</div>
            <div class="submit-btn" style="align-self: flex-end;" @click="submitComment">Submit</div>
        </div>
    </div>
    <div id="modal-container"></div>
    <Transition name="show-all-images">
        <div class="all-comments-dialog" v-if="fullCommentsAreVisible">
        <img class="close-dialog" @click="hideComments" src="/images/return.png" />
        <div class="all-comments-container">
            <CommentComponent v-for="comment in comments" :comment="comment" @show-dialog="showComment" 
              @comment-edit="submitCommentEdit" :user="user" @comment-delete="deleteComment"
            />
        </div>
        </div>
    </Transition>
    <Transition name="show-all-images">
        <AllImages :images="images" @hide-dialog="hideAllImages" :edit-is-visible="editIsVisible" :rent="rent"
            v-if="rent && allImagesIsVisible" @images-changed="onImagesChanged" />
    </Transition>
    <ComplainComponent @complaint-end="showComplaintEnd" @close-dialog="closeComplain" v-if="complainIsVisible"
        :rent="rent" />
    <div class="comment-dialog" v-if="shownComment" @click="hideComment">
        <CommentComponent style="width: 600px; max-height: 400px; box-shadow: none;" @comment-delete="deleteComment"
          @click.stop :comment="shownComment" :isFull="true" :user="user" @comment-edit="submitCommentEdit"
        />
    </div>
    <div class="mainContainer" v-if="rent">
        <FlashMessages :messages="messages" />
        <title>{{ rent.header }}</title>
        <div class="rentContainer">
            <img class="rent-edit" src="/images/rent-edit.png" v-if="!isEditing && editIsVisible" @click="startEdit" />
            <div class="rentTitle">
                <h1 class="rent-header" v-if="!isEditing">
                    {{ rent.header }}
                    <img class="complain-btn" v-if="user && user.id != rent.user_id" @click="showComplain"
                        src="/images/complain.png" />
                </h1>
                <input type="text" v-if="isEditing" v-model="editedHeader" class="header-edit" />
                <div class="error-text" v-if="isEditing && headerError">{{ headerError }}</div>
                <div class="adressContainer">
                    <div class="address-left-side">
                        <div v-if="!isEditing" class="adressLabel">{{ rent.address.addressLine }}</div>
                        <div v-if="isEditing" class="address-edit-cont">
                            <div class="address-prop" style="border-bottom: .5px solid #767676;">
                                Country
                                <input placeholder="Enter country..." class="address-prop-input" v-model="editedCountry" />
                                <div class="error-text">{{ countryError }}</div>
                            </div>
                            <div class="address-prop" style="border-bottom: .5px solid #767676;">
                                Address
                                <input placeholder="Enter country..." class="address-prop-input" v-model="editedAddress" />
                                <div class="error-text">{{ addressError }}</div>
                            </div>
                            <div class="address-prop" style="border-bottom: .5px solid #767676;">
                                City
                                <input placeholder="Enter city..." class="address-prop-input" v-model="editedCity" />
                                <div class="error-text">{{ cityError }}</div>
                            </div>
                            <div class="address-prop">
                                Index
                                <input placeholder="Enter index..." class="address-prop-input" v-model="editedIndex" />
                                <div class="error-text">{{ indexError }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="ratingLabel"><img class="rating-img" src="/images/rating.png"/>{{ rent.rating }}: {{ comments.length }}
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
                <h1 style="position: relative; display: flex; flex-direction: row; align-items: center;">
                    Comments
                    <div class="input-btn" v-if="user && user.id != rent.user_id" @click="showInput">Leave a comment</div>
                </h1>
                <div class="commentsContainer">
                    <div class="messagesContainer">
                        <CommentComponent v-for="comment in shownComments" @show-dialog="showComment" :comment="comment" 
                          :user="user" @comment-edit="submitCommentEdit" @comment-delete="deleteComment"
                        />
                    </div>
                    <div class="all-comments-btn" v-if="comments.length > 4" @click="showComments">
                        <img class="all-comments-img" src="/images/show-comment.png" />
                        Show all comments
                    </div>
                </div>
            </div>
            <MapComponent :coords="rent.address.coords" :rent="rent" :user="user" v-if="rent.address.coords || editIsVisible"
                @new-marker="setMarker" />
            <div class="host-info">
                <h2 class="host-info-label">About host</h2>
                <div class="user-short-info">
                    <img class="user-image" :src="`/profile-images/${rent.user_id}.png`"
                        onerror="this.src=`/images/no-avatar.png`" />
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
import { onMounted, ref, watch, computed } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import io from 'socket.io-client';
let socket = io();
import AllImages from './components/AllImages.vue';
import CommentComponent from '../components/CommentComponent.vue';
import ImagesComponent from './components/ImagesComponent.vue';

import MapComponent from './components/MapComponent.vue';

import validator from '../../module/rent-change/rent-validation';

import formatJoinDate from './module/format-join-date';
import ComplainComponent from './components/ComplainComponent.vue';

import FlashMessages from '../components/FlashMessages.vue';

let rent = ref(null);
let comments = ref([]);

let shownComments = computed(() => {
    return comments.value.slice(0, 4);
})
let allImagesIsVisible = ref(false);
socket = ref(socket);

let router = useRouter();

let route = useRoute();

let props = defineProps({
    user: { type: Object, required: true },
    rent: { type: Object, required: true }
})

let emits = defineEmits({
})

onMounted(() => {
    rent.value = props.rent;
    if(!rent.value) return;
    socket.value.emit('load-request', rent.value.id);
    axios.get(`/load-photos?id=${rent.value.id}`).then(({ data }) => {
        images.value = data.map((file) => 'data:image/jpeg;base64,' + file)
    })
})

watch(() => props.user, (newValue) => {
    if (rent.value) {
        if (rent.value.user_id == newValue.id) editIsVisible.value = true;
    }
})

let images = ref(null);

let editIsVisible = ref(false);

watch(() => props.rent, (newValue) => {
    rent.value = newValue;
    axios.get('/rent/comments/load', { rent_id: props.rent.id}).then(({ data }) => {
        comments.value = data;
    })
    if (props.user) {
        if (rent.value.user_id == props.user.id) editIsVisible.value = true;
    }
    axios.get(`/load-photos?id=${rent.value.id}`).then(({ data }) => {
        images.value = data.map((file) => 'data:image/jpeg;base64,' + file)
    })
})


function showAllImages() {
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

let editedCountry = ref(null);

let editedAddress = ref(null);

let editedCity = ref(null);

let editedIndex = ref(null);

let editedType = ref(null);

function startEdit() {
    if (!props.user) return;
    if (rent.value.user_id != props.user.id) return;
    isEditing.value = true;
    if (!editedHeader.value) editedHeader.value = rent.value.header;
    if (!editedDescription.value) editedDescription.value = rent.value.description;
    if (!editedPrice.value) editedPrice.value = rent.value.price;
    if (!editedAddress.value) editedAddress.value = rent.value.address.addressLine;
    if (!editedCity.value) editedCity.value = rent.value.address.city;
    if (!editedCountry.value) editedCountry.value = rent.value.address.country;
    if (!editedIndex.value) editedIndex.value = rent.value.address.postIndex;
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
        addressError.value = '';
    } catch (err) {
        addressError.value = err;
    }
})

let countryError = ref(null);

watch(editedCountry, (newValue) => {
    try {
        validator.validateCountry(newValue);
        countryError.value = '';
    } catch (err) {
        countryError.value = err;
    }
})

let cityError = ref(null);

watch(editedCity, (newValue) => {
    try {
        validator.validateCity(newValue);
        cityError.value = '';
    } catch (err) {
        cityError.value = err;
    }
})

let indexError = ref(null);

watch(editedIndex, (newValue) => {
    try {
        validator.validateIndex(newValue);
        indexError.value = '';
    } catch (err) {
        indexError.value = err;
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
        validator.validateCountry(editedCountry.value);
    } catch (err) {
        countryError.value = err;
    }
    try {
        validator.validateCity(editedCity.value);
    } catch (err) {
        cityError.value = err;
    }
    try {
        validator.validateIndex(editedIndex.value);
    } catch (err) {
        indexError.value = err;
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
    if (!addressError.value && !descriptionError.value && !headerError.value && !countryError.value
        && !cityError.value && !indexError.value && !priceError.value && !typeError.value) {
        axios.patch('/rent/change-properties', {
            rent_id: rent.value.id,
            address: {
                country: editedCountry.value,
                addressLine: editedAddress.value,
                postIndex: editedIndex.value,
                city: editedCity.value
            },
            description: editedDescription.value,
            header: editedHeader.value,
            price: editedPrice.value,
            type: editedType.value
        }).then(({ data }) => {
            for (let key in data) {
                rent.value[key] = data[key];
                isEditing.value = false;
            }

        }).finally(async () => {
            messages.value = await axios.get('/flash-messages');
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
    if (!props.user) return;
    if (props.user.id == rent.value.user_id) return;
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

let fullCommentsAreVisible = ref(false);

function showComments() {
    fullCommentsAreVisible.value = true;
    document.documentElement.classList.add('hide-html-overflow');
}

function hideComments() {
    fullCommentsAreVisible.value = false;
    document.documentElement.classList.remove('hide-html-overflow');
}

let shownComment = ref(null);

function showComment(comment) {
    shownComment.value = comment;
}

function hideComment() {
    shownComment.value = null;
}

async function submitCommentEdit(obj) {
    try {
        if(!obj.id || !obj.text || !obj.rating) return;
        if (!/^\d+(\.\d{1,2})?$/.test(obj.rating)) return;
        if(obj.rating <= 0) return;
        if(obj.rating > 5) return;
        if(obj.text.length > 500) return;
        await axios.patch('/rent/comment/edit', obj);
        for(let comment of comments.value) {
            if(comment.id === obj.id) {
                comment.text = obj.text;
                comment.rating = obj.rating;
            }
        }
        calculateAvg();
    } catch {} finally {
        messages.value = await axios.get('/flash-messages');
    }
}

async function deleteComment(id) {
    try {
        await axios.delete('/rent/comment/delete', { data: { id }});
        for(let comment of comments.value) {
            if(comment.id == id) comments.value.splice(comments.value.indexOf(comment), 1);
        }
        calculateAvg();
    } catch {} finally {
        messages.value = await axios.get('/flash-messages');

    }
}

let inputIsVisible = ref(false);

function showInput() {
    document.body.style.overflow = 'hidden';
    inputIsVisible.value = true;
}

function hideInput() {
    document.body.style.overflow = '';
    inputIsVisible.value = false;
}

let rating = ref(null);

let ratingError = ref(null);

watch(rating, (newValue) => {
    try {
      if (!newValue) throw new Error("This field mustn't be empty");
      if (!/^\d+(\.\d{1,2})?$/.test(newValue)) throw new Error('Invalid format');
      if(newValue <= 0) throw new Error('Rating must be greater than zero');
      if(newValue > 5) throw new Error('Too big num');
      ratingError.value = null;
      highlightedStars.value = Math.round(newValue);
    } catch(err) {
      ratingError.value = err;
    }
})

if(props.comment && props.comment.rating) rating.value = props.comment.rating;

let highlightedStars = ref(null);

function highlightStars(index) {
  if(rating.value > 0) return;
  highlightedStars.value = index;
} 

function hideHighlight() {
  if(rating.value > 0) return;
  highlightedStars.value = 0;
}

function setRating(index) {
  if(Math.round(rating.value) === index) {
    highlightedStars.value = 0;
    rating.value = 0;
  } else {
    highlightedStars.value = index;
    rating.value = index;
  }
}

let starDisplay = computed(() => {
  return (index) => (index <= highlightedStars.value ? '★' : '☆');
})

let enteredComment = ref(null);

let commentError = ref(null);

watch(enteredComment, (newValue) => {
    try {
        if(!newValue) throw new Error(`Comment mustn't be empty`);
        if(newValue.length > 500) throw new Error('Comment is too long');
        commentError.value = null;
    } catch(err) {
        commentError.value = err;
    }
})

async function submitComment() {
    try {
        if(!props.rent.id) return;
        if(!rating.value) return;
        if(!enteredComment.value) return;
        if(!props.user) return;
        if(enteredComment.value.length > 500) return;
        if (!/^\d+(\.\d{1,2})?$/.test(rating.value)) return;
        if(rating.value <= 0) return;
        if(rating.value > 5) return;
        let comment = await axios.post('/rent/comment/new', {rent_id: props.rent.id, rating: rating.value, text: enteredComment.value});
        comments.value.push(comment.data);
        calculateAvg();
    } catch(err) {}
    messages.value = await axios.get('/flash-messages');
    hideInput();
}

</script>

<style lang="scss">
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
    width: 800px;
}

.description {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-start;
}

.ratingLabel {
    display: flex;
    align-items: center;
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

.address-edit-cont {
    border: .5px solid #767676;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.address-prop {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 10px 10px;
}

.address-prop-input {
    font-size: 20px;
    font-family: 'Roboto';
    padding: 15px;
    width: 400px;
    border: none;
    outline: none;
}

.all-comments-btn {
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding-bottom: 5px;
  padding-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $dialog-blue;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.all-comments-img {
  margin-right: 5px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.close-dialog {
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 20px;
    left: 20px;
}

.all-comments-dialog {
  overflow-y: auto;
  position: fixed;
  z-index: 3;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.all-comments-container {
  padding: 20px;
  display: flex;
  flex-direction: row;
  width: 800px;
  flex-wrap: wrap;
}

.comment-dialog {
  background-color: rgb(117, 117, 117, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 10;
}

.input-btn {
    cursor: pointer;
    position: absolute;
    right: 0;
    text-decoration: underline;
    font-size: 18px;
    font-weight: 400;
}

.comment-input {
    width: 600px;
    height: 370px;
    border-radius: 15px;
    padding: 10px;
    border: 2px solid $border-grey;
    font-size: 16px;
    font-family: 'Roboto';
}

.comment-input-container {
    padding: 25px;
    border-radius: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.rating-img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-bottom: 3px;
}
</style>

