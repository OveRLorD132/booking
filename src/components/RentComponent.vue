<template>
    <div class="rentContainer">
        <div class="mainImage">
            <RentImage @to-wish="onToWish" @remove-wish="onRemoveWish" :directory="imageDirectory" :rent="rent" :user="user"/>
        </div>
        <div class="rentDescription">
            <a class="rentLink" href="/booking/rent">
                <div class="adressLabel">
                    {{ rent.adress }}
                </div>
            </a>
            <div class="descriptionLabel">
                Rent by {{ rent.user_name }}
            </div>
            <div class="priceLabel">
                {{  rent.price }}$ per day.
            </div>
        </div>
    </div>
</template>

<script setup>
import RentImage from './RentImage.vue';

import { ref } from 'vue';

let props = defineProps({
    user: Object,
    rent: Object,
})

let emits = defineEmits({
    'to-wish': (id) => typeof id === 'number',
    'remove-wish': (id) => typeof id ==='number', 
})

let imageDirectory = ref(`/rent-photos/${props.rent.user_name + props.rent.user_id}/${props.rent.id}/`);


function onToWish(id) {
    emits('to-wish', id);
}

function onRemoveWish(id) {
    emits('remove-wish', id);
}
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';

.mainImage {
    cursor: pointer;
}
.hoverContainer {
    width: 340px;
    height: 340px;
    border-radius: 10px;
    position: fixed;
    background-color: rgb(245, 245, 245, 0.5);
}
.rentContainer {
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
}
.adressLabel {
    font-weight: bold;
    font-size: 16px;
    color: $color;
}

.descriptionLabel {
    margin-top: 5px;
    font-size: 12px;
    color: $description-grey;
}

.priceLabel {
    margin-top: 5px;
    font-size: 14px;
    font-weight: bold;
    color: $color;
}

.rentLink {
    text-decoration: none;
}
</style>