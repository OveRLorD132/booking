<template>
    <div class="rentContainer" @mouseover="hoverShow" @mouseleave="hoverHide">
        <a class="rentLink" :href="rentLink">
            <div class="mainImage">
                <div class="hoverContainer" v-if="isHovered"></div>
                <img src="/images/no-photo.png" />
            </div>
        </a>
        <div class="rentDescription">
            <a class="rentLink" href="/booking/rent">
                <div class="adressLabel">
                    {{ rent.adress }}
                </div>
            </a>
            <div class="descriptionLabel">
                {{ rent }}
            </div>
            <div class="priceLabel">
                price: {{  rent.price }}$ per day.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let props = defineProps({
    rent: Object,
})

let rentLink = ref(`/booking/rent/${props.rent.id}`);

let isHovered = ref(false);

let hoverShow = () => {
    isHovered.value = true;
}

let hoverHide = () => {
    isHovered.value = false;
}


</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/colors.scss';

.mainImage {
    cursor: pointer;
}
.hoverContainer {
    width: 200px;
    height: 200px;
    border-radius: 10px;
    position: fixed;
    background-color: rgb(245, 245, 245, 0.5);
}
.rentContainer {
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
}
.rentDescription {
    margin-left: 10px;
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