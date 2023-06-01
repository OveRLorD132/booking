<template>
    <div class="galleryImageContainer" @mouseover="showEdit" @mouseleave="hideEdit">
        <img :src="image" class="galleryImage" :style="{width: index === 0 ? '770px' : '250px',
          height: index === 0 ? '770px' : '250px'}" 
          @click="showFullImage"
        />
        <img class="edit-btn" src="/images/more.png" v-if="isHovered" @click="showPanel"/>
        <div class="panel-cont" v-if="panelIsVisible && isHovered">
            <div class="panel-elem" v-if="index" @click="setMain">Set Main</div>
            <div class="panel-elem" v-if="index !== (length - 1)" @click="pushFurther">Push Further</div>
            <div class="panel-elem" v-if="index" @click="pushBack">Push Back</div>
            <div class="panel-elem" @click="deleteImage">Delete</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps({
    image: String,
    index: Number,
    isEditing: Boolean,
    length: Number
})

let emits = defineEmits({
    'image-choose': (index) => typeof index === 'number',
    'set-main': (index) => typeof index === 'number',
    'push-further': (index) => typeof index === 'number',
    'push-back': (index) => typeof index === 'number',
    'delete-image': (index) => typeof index === 'number'
})

function showFullImage() {
    emits('image-choose', props.index);
}

let isHovered = ref(false);

function showEdit() {
    if(!props.isEditing) return;
    isHovered.value = true;
}

function hideEdit() {
    if(!props.isEditing) return;
    isHovered.value = false;
}

let panelIsVisible = ref(false);

function showPanel() {
    panelIsVisible.value = !panelIsVisible.value;
}

function setMain() {
    emits('set-main', props.index);
    panelIsVisible.value = false;
}

function pushFurther() {
    emits('push-further', props.index);
    panelIsVisible.value = false;
}

function pushBack() {
    emits('push-back', props.index);
    panelIsVisible.value = false;
}

function deleteImage() {
    emits('delete-image', props.index);
    panelIsVisible.value = false;
}
</script>

<style lang="scss">
.galleryImageContainer {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
}
.galleryImage {
    width: 250px;
    height: 250px;
    object-fit: cover;
    cursor: pointer;
}

.edit-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    padding: 5px 5px 5px 5px;
    cursor: pointer;
    background-color: #ffffff;
}

.panel-cont {
    position: absolute;
    right: 10px;
    top: 50px;
    background-color: #ffffff;
    padding: 10px 0 10px 0;
    border-radius: 10px;
}

.panel-elem {
    padding: 5px 10px 5px 10px;
    cursor: pointer;
}

.panel-elem:hover {
    background-color: #f0f0f0;
}
</style>