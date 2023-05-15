<template>
    <div class="comment" @mouseover="showEdit" @mouseleave="hideEdit" 
      :style="{ backgroundColor: isHovered ? '#F4F4F4' : 'transparent'}"
      >
        <div class="userContainer">
            <div class="commentLeft">
                <img class="commentProfileImg" src="/images/no-avatar.png"/>
                <div class="username">{{ comment.first_name }}</div>
            </div>
            <div class="commentRight">
                <div v-show="isHovered" @click="showEditingForm">
                    <img class="commentButtons" src="/images/edit.png"/>
                </div>
                <div class="rating" v-if="!isEditing">{{ comment.rating }}</div>
                <div v-if="isEditing"><input class="ratingInput" type="text" v-model="editedRating" /></div>
                <div v-show="isHovered" @click="deleteComment">
                    <img class="commentButtons" src="/images/delete.png"/>
                </div>
            </div>
        </div>
        <div class="commentText">
            <template v-if="!isEditing">{{ comment.text }}</template>
            <textarea v-if="isEditing" class="editingArea" v-model="editedComment"/>
        </div>
        <div >
            <button class="changeButton" @click="editText" v-if="isEditing">OK</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let isHovered = ref(null);

let props = defineProps({
    user: Object,
    comment: Object,
    socket: Object,
    index: Number,
    rent: Object
})

let showEdit = () => {
    if(props.user && props.user.id === props.comment.user_id) {
        isHovered.value = true;
    } 
}

let hideEdit = () => {
    if(props.user && props.user.id === props.comment.user_id) {
        isHovered.value = false;
    } 
}

let editedComment = ref(null);
let editedRating = ref(null);
let isEditing = ref(false);

let showEditingForm = () => {
    if(isEditing.value) {
        editedComment.value = "";
        editedRating.value = 0;
    } 
    else {
        editedComment.value = props.comment.text;
        editedRating.value = props.comment.rating;
    } 
    isEditing.value = !isEditing.value;
}

let editText = () => {
    if(props.comment.text === editedComment.value && props.comment.rating === editedRating.value) return;
    props.comment.emitEditing(props.socket, editedComment.value, props.comment.id, editedRating.value, props.rent.id);
    isEditing.value = false;
}

let deleteComment = () => {
    props.comment.emitDeleting(props.socket, props.comment.id, props.index, props.rent.id);
}
</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/inputs.scss';
@import '../../../public/stylesheets/colors.scss';
.commentButtons {
    cursor: pointer;
    width: 30px;
    height: 30px;
}
.comment {
    border-radius: 10px;
    padding: 5px 5px 5px 5px;
    width: 360px;
    margin: 10px 10px 10px 10px;
}
.commentProfileImg {
    width: 25px;
    height: 25px;
    border-radius: 50%;
}

.userContainer {
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.username {
    margin-left: 5px;
}

.rating {
    margin-left: 5px;
}

.commentLeft {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.commentRight {
    max-height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.editingArea {
    background-color: transparent;
    border: none;
    font-family: 'Proxima-Nova';
    width: 100%;
    height: 125px;
    resize: none;
    overflow: hidden;
}

.commentText {
    margin-top: 10px;
}

.changeButton {
    @include button-style;
    font-size: 14px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
}
</style>