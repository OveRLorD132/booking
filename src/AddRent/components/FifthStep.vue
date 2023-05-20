<template>
    <div class="mainStepContainer" v-if="rent">
        <h2>{{ rent.header }}</h2>
        <div class="addressLabel">{{ rent.address }}</div>
        <div class="imagesContainer">
            <img :src="rent.images[0].src" class="rentImage mainImage"/>
            <div class="otherImagesContainer">
                <template v-for="(image, index) in rent.images">
                    <img  class="rentImage otherImages" v-if="!image.isMain"
                      :style="{ marginRight: index % 2 === 1 ? '10px' : '0'}" :src="image.src"
                    />
                </template>
            </div>

        </div>
        <div class="type">{{ rent.type }}, rent by {{ userProfile.first_name }}</div>
        <div class="rentAbout">
            <h3>About</h3>
            <div class="description">{{ rent.description }}</div>
        </div>
        <div class="price">
            <h3>Price</h3>
            {{ rent.price }} per day.
        </div>
    </div>
</template>

<script setup>

let props = defineProps({
    rent: Object,
    userProfile: Object
})

</script>

<style scoped lang="scss">
@import '../../../public/stylesheets/colors.scss';
.imagesContainer {
    display: flex;
    flex-direction: row;
    max-width: 830px;
    max-height: 400px;
}

.otherImagesContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.rentImage {
    object-position: center;
    object-fit: cover;
    margin-bottom: 10px;
}

.otherImages {
    width: 200px;
    height: 200px;
}

.mainImage {
    margin-right: 10px;
    width: 410px;
    height: 410px;
}

.type {
    margin-top: 15px;
    color: $active-grey;
}

.addressLabel {
    text-decoration: underline;
}
</style>