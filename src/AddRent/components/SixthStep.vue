<template>
    <div class="mainStepContainer" v-if="rent">
        <h1>Check all info and submit</h1>
        <h2>{{ rent.header }}</h2>
        <div class="addressLabel">{{ rent.address.addressLine }}</div>
        <div class="imagesContainer">
            <img :src="rent.images[0].src" class="rentImage" 
              :style="{gridColumn: '1 / 2', gridRow: '1 / 2', width: '410px', height: '410px'}" 
            />
            <template v-for="(image, index) in rent.images">
                <img class="rentImage" v-if="!image.isMain"
                    :style="{gridColumn: index === 1 || index === 3 ? '3 / 3' : '', width: '200px', height: '200px'}" 
                    :src="image.src" />
            </template>
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
    display: grid;
    grid-template-columns: repeat(4, minmax(200px, 1fr));
    grid-auto-rows: 200px;
    gap: 10px;
    width: 800px;
}

.otherImagesContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.rentImage {
    object-position: center;
    object-fit: cover;
}

.type {
    margin-top: 15px;
    color: $active-grey;
}

.addressLabel {
    text-decoration: underline;
}

.description {
    display: flex;
    flex-wrap: wrap;
    font-family: 'Proxima-Nova';
    font-size: 17px;
    max-width: 500px;
    overflow-wrap: anywhere;
}
</style>