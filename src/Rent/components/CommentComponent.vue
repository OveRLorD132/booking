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
                <div class="rating">{{ comment.rating }}</div>
                <div v-show="isHovered" @click="showEditingForm">
                    <img class="editButton" src="/images/edit.png"/>
                </div>
            </div>
        </div>
        <div class="commentText">
            <template v-if="!isEditing">{{ comment.text }}</template>
            <textarea v-if="isEditing" v-model="editedComment"/>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

let isHovered = ref(null);

let props = defineProps({
    user: Object,
    comment: Object,
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
let isEditing = ref(false);

let showEditingForm = () => {
    if(isEditing.value) editedComment.value = "";
    else editedComment.value = props.comment.text;
    isEditing.value = !isEditing.value;
}
</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/colors.scss';
.editButton {
    cursor: pointer;
    width: 40px;
    height: 40px;
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

.commentText {
    margin-top: 10px;
}
</style>