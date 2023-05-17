<template>
    <div class="imageContainer" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
        <div class="moreContainer">
            <img class="moreButtonImage" @click="showMore" src="/images/more.png"/>
            <div class="panel" v-if="panelIsVisible">
                <div class="panelElement" v-if="!image.isMain" @click="setMain">Set main</div>
                <div class="panelElement" v-if="index !== (uploadedFiles.length - 1)" @click="pushFurther">Push further</div>
                <div class="panelElement" v-if="index !== 0" @click="pushBack">Push back</div>
                <div class="panelElement" @click="deleteImage">Delete</div>
            </div>
        </div>
        <img :style="imageStyle" class="image" :src="image.src"/>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

let isHovered = ref(null);

let props = defineProps({
    uploadedFiles: Array,
    image: Object,
    index: Number,
})

let emits = defineEmits({
    'set-main': (index) => typeof index === 'number',
    'push-further': (index) => typeof index === 'number',
    'push-back': (index) => typeof index === 'number',
    'delete-image': (index) => typeof index === 'number'
})

function handleMouseover() {
    isHovered.value = true;
}

function handleMouseleave() {
    isHovered.value = false;
}

let imageStyle = computed(() => {
    return {
        width: props.image.isMain ? '700px' : '345px',
        height: props.image.isMain ? '400px' : '200px',
        marginLeft: props.index !== 0 && props.index % 2 === 0 ? '10px': '0px'
    }
})

let panelIsVisible = ref(false);

function showMore() {
    panelIsVisible.value = !panelIsVisible.value;
}

function setMain() {
    emits('set-main', props.index);
}

function pushFurther() {
    emits('push-further', props.index);
}

function pushBack() {
    emits('push-back', props.index);
}

function deleteImage() {
    emits('delete-image', props.index);
}
</script>

<style scoped lang="scss">
.image {
    object-position: center;
    object-fit: cover;
}
.moreContainer {
    position: relative;
}
.panel {
    position: absolute;
    top: 40px;
    right: 10px;
    background-color: #ffffff;
    font-size: 16px;
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 10px;
}

.panelElement {
    margin-bottom: 10px;
}
.moreButtonImage {
    top: 10px;
    right: 10px;
    position: absolute;
    cursor: pointer;
    width: 18px;
    height: 18px;
    padding: 4px 4px 4px 4px;
    background-color: #ffffff;
    border-radius: 50%;
}
</style>