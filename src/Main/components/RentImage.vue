<template>
    <div class="imageContainer" @mouseover="hoverShow" @mouseleave="hoverHide">
        <div class="hoverContainer" v-if="isHovered">
            <img src="/images/wish.png" class="wishListButton" 
              v-if="!user || !user.wishlist.includes(+rent.id)" @click="toWishList"
            />
            <img src="/images/wished.png" class="wishListButton" 
              v-if="user && user.wishlist.includes(+rent.id)" @click="removeFromWishlist"
            />
            <img src="/images/imgButton.png" class="next" v-if="page < rent.images_count" @click.stop="nextPage"/>
            <img src="/images/imgButton.png" class="back" v-if="page > 0" @click.stop="back"/>
        </div>
        <a class="rentLink" :href="rentLink">
            <div class="imagesContainer" :style="{transform: `translateX(${-page * 250}px)`}">
                <div class="rentImageContainer"><img class="rentImage" :src="directory + 'Main.png'"/></div>
                <div class="rentImageContainer" v-for="num in rent.images_count">
                    <img class="rentImage" :src="directory + num + '.png'"/>
                </div>
                
            </div>
        </a>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
    directory: String,
    rent: Object,
    user: Object
})

let emits = defineEmits({
    'to-wish': (id) => typeof id === 'number',
    'remove-wish': (id) => typeof id ==='number', 
})

let rentLink = ref(`/booking/rent/${props.rent.id}`);


let page = ref(null);

let isHovered = ref(false);

let hoverShow = () => {
    isHovered.value = true;
}

let hoverHide = () => {
    isHovered.value = false;
}

function nextPage() {
    page.value++;
}

function back() {
    page.value--;
}

function toWishList() {
    emits('to-wish', props.rent.id);
}

function removeFromWishlist() {
    emits('remove-wish', props.rent.id);
}

</script>

<style lang="scss">
@mixin imageButtons {
    padding-left: 5px;
    padding-bottom: 5px;
    padding-top: 5px;
    padding-right: 8px;
    background-color: rgb(256, 256, 256, 0.5);
    border-radius: 50%;
    width: 27px;
    height: 30px;
    cursor: pointer;
    position: absolute;
    z-index: 9;
    top: 45%;
}
.next {
    @include imageButtons;
    transform: scaleX(-1);
    right: 5px;
}

.back {
    @include imageButtons;
    left: 5px;
}

.rentImageContainer {
    width: 250px;
    height: 250px;
}
.rentImage {
    cursor: pointer;
    object-position: center;
    object-fit: cover;
    width: 250px;
    height: 250px;
}

.wishListButton {
    position: absolute;
    z-index: 10;
    top: 10px;
    left: 10px;
    width: 30px;
    height: 30px;
}

.imageContainer {
    border-radius: 10px;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
}

.hoverContainer {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
}

.imagesContainer {
    width: 250px;
    height: 250px;
    display: flex;
    transition: all .1s;
    flex-direction: row;
}
</style>