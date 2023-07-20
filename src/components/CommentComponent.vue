<template>
  <div class="comment" @mouseover="showHover" @mouseleave="hideHover" :style="{ maxHeight: isEditing ? 'none' : ''}">
    <Teleport to="#modal-container">
      <div class="delete-dialog" v-if="dialogIsVisible" >
        <div class="delete-dialog-cont">
          <img class="comment-cancel-img" @click="hideDialog" src="/images/dialog-cancel.png"/>
          <div class="comment-delete-header">Delete comment?</div>
          <div class="comment-delete-text" v-html="'Are you sure you want to delete this comment?\nYou could not undo this action.'"></div>
          <div class="btns-cont">
            <div class="cancel-btn" @click="hideDialog">Cancel</div>
            <div class="confirm-delete-btn" @click="submitDelete">Delete</div>
          </div>
        </div>
      </div> 
    </Teleport>
    <div class="comment-hover" v-if="isHovered">
      <img class="comment-edit" src="/images/rent-edit.png" @click="startEdit"/>
      <img class="comment-delete" src="/images/delete-wish.png" v-if="!isEditing" @click="showDialog"/>
    </div>
    <div class="user-info-cont">
      <img class="user-img" :src="`/profile-images/${comment.user_id}.png`" onerror="this.src='/images/no-avatar.png'"/>
      <div class="right-info">
        <div class="user-name"><a class="profile-link" :href="`/public-profile/${comment.user_id}`">{{ comment.first_name }}</a></div>
        <div class="join-date">{{ formatCommentDate(comment.date) }}</div>
        <div class="comment-rating" v-if="comment.rating && !isEditing">
          {{ comment.rating }}
          <img class="comment-rating-img" src="/images/rating.png" />
        </div>
      </div>
    </div>
    <div class="comment-text" ref="commentText" v-if="!isEditing">{{ comment.text }}</div>
    <div class="starContainer" v-if="isEditing && comment.rating">
        <div class="star" 
          v-for="index in 5" 
          :key="index"
          @mouseover="highlightStars(index)"
          @mouseleave="hideHighlight"
          @click="setRating(index)"
        >{{ starDisplay(index) }}</div>
        <input class="rating-input" type="text" v-model="rating" />
    </div>
    <div class="comment-edit-error">{{ ratingError }}</div>
    <textarea class="comment-edit-input" v-if="isEditing" v-model="editedComment"></textarea>
    <div class="comment-edit-error">{{ editError }}</div>
    <div class="comment-submit-btn" @click="submitEdit" v-if="isEditing">Submit</div>
    <div class="comment-overflow" v-if="!isFull && isOverflowVisible" @click="showFullComment"><img class="dialog-btn" src="/images/show-comment.png"/>Show full comment</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

let props = defineProps({
  comment: Object,
  isFull: Boolean,
  user: Object
})

let emits = defineEmits({
  'show-dialog': null,
  'comment-edit': null,
  'comment-delete': null,
})

function formatCommentDate(date) {
  date = new Date(date);
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let year = date.getFullYear();
  let hours = date.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

let commentText = ref();

let isOverflowVisible = computed(() => {
  if(!commentText.value) return;
  return commentText.value.clientHeight > 90;
})

function showFullComment() {
  emits('show-dialog', props.comment);
}

let isHovered = ref(false);

function showHover() {
  if(!props.user) return;
  if(props.user.id != props.comment.user_id) return;
  isHovered.value = true;
}

function hideHover() {
  isHovered.value = false;
}

let isEditing = ref(false);

let editedComment = ref(props.comment.text);

let editError = ref(null);

watch(editedComment, (newValue) => {
  try {
    if(!newValue) throw new Error(`Comment text mustn't be empty`);
    if(newValue.length > 500) throw new Error('Comment is too long');
    editError.value = null;
  } catch(err) {
    editError.value = err;
  }
})

function startEdit() {
  isEditing.value = !isEditing.value;
}

function submitEdit() {
  if(editedComment.value == props.comment.text && rating.value == props.comment.rating) {
    isEditing.value = false;
    return;
  }
  emits('comment-edit', { id: props.comment.id, text: editedComment.value, rating: rating.value});
  isEditing.value = false;
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

let dialogIsVisible = ref(false);

function showDialog() {
  document.body.style.overflow = 'hidden';
  dialogIsVisible.value = true;
}

function hideDialog() {
  document.body.style.overflow = '';
  dialogIsVisible.value = false;
}

function submitDelete() {
  emits('comment-delete', props.comment.id);
  hideDialog();
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.user-info-cont {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.user-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.right-info {
  width: 100%;
  position: relative;
  margin-left: 10px;
}

.user-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 5px;
}

.comment {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow-y: hidden;
  position: relative;
  box-shadow: 0px 0px 4px .1px rgba(0,0,0,0.75);
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
  width: 350px;
  max-height: 180px;
}

.comment-text {
  margin-top: 5px;
  word-break: break-all;
}

.comment-overflow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $dialog-blue;
  border-radius: 10px;
  width: 100%;
  bottom: 0;
  padding-bottom: 5px;
  padding-top: 5px;
  left: 0;
  position: absolute;
  background-color: #fff;
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}

.dialog-btn {
  cursor: pointer;
  margin-right: 5px;
  width: 18px;
  height: 18px;
}

.profile-link {
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: underline;
  }
}

.join-date {
  color: $description-grey;
}

.comment-hover {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 10px;
}

.comment-edit {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.comment-delete {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.comment-edit-input {
  margin-top: 10px;
  height: 150px;
  width: calc(100% - 35px);
  resize: vertical;
  border-radius: 10px;
  padding: 15px;
  border: 2px solid $border-grey;
  font-family: 'Roboto';
  font-size: 16px;
}

.comment-submit-btn {
  margin-top: 10px;
  align-self: flex-end;
  background-color: $button-red;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  font-family: "Roboto";
  color: #ffffff;
  top: 10px;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  width: max-content;
}

.comment-edit-error {
  color: $error-red;
}

.starContainer {
  height: 30px;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}


.star {
  cursor: pointer;
  margin-left: 5px;
  color: orange;
  font-size: 30px;
  width: 20px;
  height: 20px;
}

.rating-input {
  padding: 10px;
  border: 2px solid $border-grey;
  border-radius: 10px;
  font-family: 'Roboto';
  font-size: 16px;
  margin-top: 10px;
  width: 40px;
  margin-left: 10px;
}

.delete-dialog {
  top: 0;
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(117, 117, 117, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-dialog-cont {
  position: relative;
  padding: 40px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
}

.comment-delete-header {
  font-size: 24px;
  font-weight: 500;
} 

.comment-delete-text {
  margin-top: 10px;
  text-align: center;
  font-size: 18px;
  white-space: pre-wrap;
}

.btns-cont {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
}

.cancel-btn {
  margin-left: 10px;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 10px;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  width: max-content;
  &:hover {
    background-color: $calendar-grey;
  }
}

.confirm-delete-btn {
  margin-right: 10px;
  display: flex;
  align-items: center;
  background-color: $button-red;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  font-family: "Roboto";
  color: #ffffff;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  width: max-content;
  &:hover {
    background-color: $button-hover-red;
  }
}

.comment-cancel-img {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.comment-rating {
  right: 10px;
  position: absolute;
  font-size: 18px;
  bottom: 0;
}

.comment-rating-img {
  width: 20px;
  height: 20px;
}
</style>