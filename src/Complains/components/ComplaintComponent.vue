<template>
  <div class="complaint" @mouseover="showPanel" @mouseleave="hidePanel"
    :style="{ backgroundColor: panelIsVisible ? '#f5f5f5' : '' }">
    <div class="complaint-reason">{{ complaint.reason }}</div>
    <div class="complaint-text">Text: {{ complaint.text ? complaint.text : 'No text added' }}</div>
    <div class="complaint-rent">From:
      <a class="rent-link" :href="`/booking/rent/${complaint.rent_id}`">{{ complaint.rent_header }}</a>
    </div>
    <div class="complaint-info">
      <div class="complaint-user-name">Posted by: {{ complaint.username }}</div>
      <div class="complaint-date">Date: {{ formatJoinDate(new Date(complaint.date)) }}</div>
    </div>
    <div class="panel" v-if="panelIsVisible">
      <img class="panel-btn" v-if="!complaint.is_accepted" src="/images/Add.png" @click="acceptComplaint" />
      <img class="panel-btn" src="/images/delete-wish.png" @click="deleteComplaint" />
    </div>
  </div>
</template>

<script setup>
import formatJoinDate from '../../Rent/module/format-join-date';
import { ref } from 'vue';

let props = defineProps({
  complaint: Object
})

let emits = defineEmits({
  'complaint-accepted': null,
  'complaint-deleted': null
})

let panelIsVisible = ref(null);

function showPanel() {
  panelIsVisible.value = true;
}

function hidePanel() {
  panelIsVisible.value = false;
}

function acceptComplaint() {
  emits('complaint-accepted', props.complaint);
}

function deleteComplaint() {
  emits('complaint-deleted', props.complaint.id);
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.complaint {
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  position: relative;
  width: 1000px;
}

.complaint-reason {
  font-size: 26px;
  font-weight: 600;
}

.complaint-text {
  flex-wrap: wrap;
  font-size: 20px;
}

.complaint-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.complaint-user-name {
  color: $description-grey;
}

.complaint-date {
  color: $description-grey;
}

.rent-link {
  text-decoration: none;
  color: black;
}

.rent-link:hover {
  text-decoration: underline;
}

.panel {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}

.panel-btn {
  width: 30px;
  height: 30px;
}
</style>