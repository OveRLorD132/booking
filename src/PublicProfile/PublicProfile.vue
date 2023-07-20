<template>
  <UpperLine @user-profile="setUser" />
  <FlashMessages :messages="messages" />
  <div id="modal-container"></div>
  <Transition name="comments-show">
    <div class="all-comments-dialog" v-if="allCommentsAreVisible">
      <img class="close-dialog" @click="hideComments" src="/images/return.png" />
      <div class="all-comments-container">
        <CommentComponent v-for="comment in comments" :comment="comment" :user="user" @show-dialog="showComment" 
          @comment-edit="submitEdit" @comment-delete="submitDelete"
        />
      </div>
    </div>
  </Transition>
  <div class="comment-dialog" v-if="shownComment" @click="hideComment">
    <CommentComponent style="width: 600px; max-height: 400px; box-shadow: none;" :user="user" 
      :comment="shownComment" :isFull="true" @click.stop @comment-edit="submitEdit" @comment-delete="submitDelete"
    />
  </div>
  <div class="comment-dialog" @click="hideDialog" v-if="dialogIsVisible">
    <div class="input-cont" @click.stop>
      <h2 style="margin-top: 0;">Enter comment</h2>
      <textarea class="comment-input" v-model="commentInput"></textarea>
      <div class="submit-btn" @click="submitComment">Submit</div>
    </div>
  </div>
  <div class="profile-container" v-if="profile">
    <title>{{ profile.first_name + ' - Profile' }}</title>
    <div class="short-info">
      <img class="profile-small-img" :src="`/profile-images/${profile.id}.png`"
        onerror="this.src='/images/no-avatar.png'" />
      <div class="small-info">
        <div class="first-name">{{ profile.first_name }}</div>
        <div class="join-date">{{ 'Joined ' + formatJoinDate(profile.join_date) }}</div>
        <div class="account-type">{{ profile.type }}</div>
        <div class="ads-total" v-if="ads && ads.length > 0">Ads Total: {{ ads.length }}</div>
      </div>
    </div>
    <div class="description-cont">
      <h1 style="margin-top: 0;">About</h1>
      <div class="description">{{ profile.description }}</div>
      <h1 style="position: relative; display: flex; align-items: center;">
        Feedback
        <div class="comment-btn" @click="showDialog" v-if="user && user.id != profile.id">Leave a comment</div>
      </h1>
      <div class="comments-container">
        <CommentComponent v-for="comment of displayedComments" :comment="comment" @show-dialog="showComment" 
          :user="user" @comment-edit="submitEdit" @comment-delete="submitDelete"
        />
        <div class="all-comments-btn" v-if="comments.length > 4" @click="showComments">
          <img class="all-comments-img" src="/images/show-comment.png" />
          Show all comments
        </div>
      </div>
      <template v-if="profile.type === 'Host'">
        <h1 style="position: relative; display: flex; align-items: center;">
          User Ads
          <img style="right: 50px;" class="scroll-btn" src="/images/imgButton.png" @click="scrollLeft" />
          <img style="transform: scaleX(-1);" class="scroll-btn" src="/images/imgButton.png" @click="scrollRight" />
        </h1>
        <div class="ads-cont" ref="adsCont">
          <RentComponent v-for="rent of ads" :rent="rent" :user="user" />
        </div>
      </template>
      <div class="conversation-btn">
        <a class="profile-link" :href="`/conversations?id=${conversation}`" v-if="conversation">To Conversation</a>
        <div v-if="!conversation" @click="startConversation" >Start Conversation</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import UpperLine from '../components/UpperLine.vue';
import FlashMessages from '../components/FlashMessages.vue';
import RentComponent from '../components/RentComponent.vue';

import formatJoinDate from '../Rent/module/format-join-date';

import { computed, ref } from 'vue';
import CommentComponent from '../components/CommentComponent.vue';

let user = ref(null);

function setUser(obj) {
  user.value = obj;
  if(!profile.value) return;
  axios.get(`${window.location.pathname}/check-conversation`).then(({ data }) => {
    conversation.value = data;
  })
}

let profile = ref(null);

let ads = ref(null);

let conversation = ref(null);

axios.get(`${window.location.pathname}/data`).then(({ data }) => {
  profile.value = data.profile;
  ads.value = data.ads;
  if(!user.value) return;
  axios.get(`${window.location.pathname}/check-conversation`).then(({ data }) => {
    conversation.value = data;
  })
})

let comments = ref([]);

axios.get(`${window.location.pathname}/load-comments`).then(({ data }) => {
  comments.value = data;
})

let adsCont = ref();

function scrollLeft() {
  adsCont.value.scrollLeft -= adsCont.value.offsetWidth * 0.6;
}

function scrollRight() {
  console.log(adsCont.value.scrollLeft);
  adsCont.value.scrollLeft += adsCont.value.offsetWidth * 0.6;
}

let dialogIsVisible = ref(false);

function showDialog() {
  dialogIsVisible.value = true;
}

function hideDialog() {
  dialogIsVisible.value = false;
  commentInput.value = '';
}

let messages = ref(null);

let commentInput = ref('');

async function submitComment() {
  try {
    let comment = await axios.post(`/public-profile/${profile.value.id}/comment`, { text: commentInput.value });
    comments.value.push(comment.data);
  } catch (err) {
    messages.value = axios.get('/flash-messages');
  } finally {
    hideDialog();
  }
}

let displayedComments = computed(() => {
  return comments.value.slice(0, 4);
})

let allCommentsAreVisible = ref(false);

function showComments() {
  allCommentsAreVisible.value = true;
  document.body.style.overflowY = 'hidden';
}

function hideComments() {
  allCommentsAreVisible.value = false;
  document.body.style.overflowY = '';
}

let shownComment = ref(null);

function showComment(comment) {
  shownComment.value = comment;
}

function hideComment() {
  shownComment.value = null;
}

async function startConversation() {
  try {
    let { data } = await axios.post('/conversations/start', {id: profile.value.id});
    window.location.href = (`/conversations?id=${data}`);
  } catch(err) {
    messages.value = await axios.get('/flash-messages');
  }
}

async function submitEdit(obj) {
  try {
    if (!obj.id || !obj.text) return;
    if (obj.text.length > 500) return;
    await axios.patch(`/public-profile/${profile.value.id}/comment/edit`, { text: obj.text, id: obj.id});
    for(let comment of comments.value) {
      if(comment.id == obj.id) comment.text = obj.text;
    }
  } catch {}
  messages.value = await axios.get('/flash-messages');
}

async function submitDelete(id) {
  try {
    await axios.delete(`/public-profile/${profile.value.id}/comment/delete`, { data: { id }});
    for(let comment of comments.value) {
      if(comment.id == id) comments.value.splice(comments.value.indexOf(comment), 1);
    }
  } catch {}
  messages.value = await axios.get('/flash-messages');
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.profile-container {
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.profile-small-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 10px;
}

.short-info {
  top: 91px;
  position: sticky;
  margin-top: 20px;
  height: max-content;
  display: flex;
  flex-direction: row;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.75);
}

.first-name {
  font-size: 28px;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 3px;
}

.join-date {
  color: $description-grey;
}

.account-type {
  margin-top: 5px;
  font-size: 20px;
}

.description-cont {
  padding: 20px;
  width: 800px;
}

.description {
  word-wrap: break-word;
  font-size: 18px;
}

.scroll-btn {
  border-radius: 50%;
  padding: 7px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
  position: absolute;
  right: 5px;
}

.ads-cont {
  display: flex;
  flex-direction: row;
  width: 800px;
  overflow-x: hidden;
  transition: scroll-behavior .3s ease;
  scroll-behavior: smooth;
}

.comments-container {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.comment-btn {
  cursor: pointer;
  position: absolute;
  right: 5px;
  text-decoration: underline;
  font-size: 18px;
  font-weight: 200;
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

.input-cont {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
}

.comment-input {
  width: 600px;
  height: 370px;
  resize: vertical;
  padding: 10px;
  border-radius: 15px;
  border: 2px solid $border-grey;
  font-size: 16px;
  font-family: 'Roboto';
}

.submit-btn {
  background-color: $button-red;
  color: #fff;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
  align-self: flex-end;
  margin-top: 10px;

  &:hover {
    background-color: $button-hover-red;
  }
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

.close-dialog {
  height: 35px;
  width: 35px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 4;
  cursor: pointer;
}

.all-comments-container {
  padding: 20px;
  display: flex;
  flex-direction: row;
  width: 800px;
  flex-wrap: wrap;
}

.comments-show-leave-to {
  opacity: 0;
  transform: translateY(100vh);
} 

.comments-show-enter-from {
  opacity: 0;
  transform: translateY(100vh);
}

.comments-show-enter-active {
  transition: all .3s;
}

.comments-show-leave-active {
  transition: all .3s;
}

.conversation-btn {
  margin-top: 10px;
  padding: 15px;
  font-size: 18px;
  border: 2px solid black;
  cursor: pointer;
  border-radius: 10px;
  width: max-content;
}
</style>