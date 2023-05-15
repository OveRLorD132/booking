<template>
    <div :style="{ 'margin-left': '10px'}">{{ user ? "Add your comment" : "You must be authenticated to add a comment"}}</div>
    <div class="starContainer">
        <div class="star" 
          v-for="index in 5" 
          :key="index"
          @mouseover="highlightStars(index)"
          @mouseleave="hideHighlight"
          @click="setRating(index)"
        >{{ starDisplay(index) }}</div>
        <input class="mainInput" id="ratingInput" type="text" v-model="rating" />
    </div>
    <form @submit.prevent="addComment">
        <textarea :disabled="!user" class="mainInput" id="commentInput" v-model="newComment" />
        <p><input id="submitButton" type="submit" value="Send" /> </p>
    </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

let rating = ref(null);

watch(rating, (newValue) => {
    highlightedStars.value = Math.round(newValue);
})

let highlightedStars = ref(null);

let newComment = ref(null);

let props = defineProps({
    rent: Object,
    user: Object,
    socket: Object
})

let highlightStars = (index) => {
    if(rating.value > 0) return;
    highlightedStars.value = index;
}

let hideHighlight = () => {
    if(rating.value > 0) return;
    highlightedStars.value = 0;
}

let setRating = (index) => {
    if(Math.round(rating.value) === index) {
        highlightedStars.value = 0;
        rating.value = 0;
        return;
    }
    highlightedStars.value = index;
    rating.value = index;
}



const starDisplay = computed(() => {
    return (index) => (index <= highlightedStars.value ? '★' : '☆');
});

let addComment = () => {
    if(!props.user) return;
    props.socket.emit('add-comment', {
        rent_id: props.rent.id,
        text: newComment.value,
        user_id: props.user.id,
        rating: rating.value ? rating.value : 5,
        first_name: props.user.first_name
    });
}
</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/inputs.scss';
@import '../../../public/stylesheets/colors.scss';
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

#commentInput {
    padding: 10px 10px 10px 10px;
    height: 150px;
    width: 600px;
    resize: none;
}

#ratingInput {
    margin-top: 15px;
    margin-left: 15px;
    height: 15px;
    max-width: 30px;
}

#submitButton {
    @include button-style;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    border-radius: 10px;
    font-size: 16px;
}
</style>