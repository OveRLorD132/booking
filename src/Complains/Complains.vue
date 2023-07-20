<template>
  <FlashMessages :messages="messages" />
  <UpperLine @user-profile="setProfile" />
  <div class="text-dialog" v-if="dialogIsVisible" @click="hideDialog">
    <div class="input-container" @click.stop>
      <div class="submit-header">Type additional text</div>
      <textarea class="additional-text" v-model="additionalText"></textarea>
      <div class="submit-btn" @click="acceptComplaint">Accept</div>
    </div>
  </div>
  <div class="main-container">
    <div class="complains-cont">
      <h1>Users Complains</h1>
      <div class="buttons-cont">
        <div class="left-btns">
          <div class="sort-btn" @click="pickOption('New')"
            :style="{ borderColor: pickedOption === 'New' ? '#FF2F69 !important' : '' }">New complains</div>
          <div class="sort-btn" @click="pickOption('Accepted')"
            :style="{ borderColor: pickedOption === 'Accepted' ? '#FF2F69 !important' : '' }">Accepted</div>
        </div>
        <div class="right-btn" @click="showSortPanel">
          Sort by:
          <div class="sort-option">{{ pickedSortOption }}<img class="pick-img" src="/images/choose-arrow.png" /></div>
          <div class="option-panel" v-if="optionPicking">
            <div class="panel-option" @click="pickSortOption('Date')">Date</div>
            <div class="panel-option" @click="pickSortOption('Type')">Type</div>
          </div>
        </div>
      </div>
      <TransitionGroup name="complains-show">
        <template v-if="pickedSortOption === 'Date'">
          <template v-if="filteredComplains.length > 0">
            <ComplaintComponent v-for="complaint in filteredComplains" :complaint="complaint"
            @complaint-accepted="showDialog" @complaint-deleted="deleteComplaint" />
          </template>
          <div style="margin-top: 10px; font-size: 18px;" v-else>There is no complaints left</div>
        </template>
        <template v-else>
          <div class="complaint-type" v-for="complaintType in complaintTypes">
            <div class="type-header" @click="toggleColumns(complaintType)">
              {{ complaintType }}
              <img src="/images/choose-arrow.png" class="column-btn" style="transition: transform .3s;"
                :style="{ transform: columnIsVisible(complaintType) ? 'scaleY(-100%)' : '' }" />
            </div>
            <TransitionGroup name="complains-show">
              <template v-if="columnIsVisible(complaintType)">
                <ComplaintComponent v-for="complaint in filteredComplains.filter((elem) => elem.reason == complaintType)"
                  :complaint="complaint" @complaint-accepted="showDialog" @complaint-deleted="deleteComplaint" />
              </template>
            </TransitionGroup>
          </div>
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>

import axios from 'axios';
import { io } from 'socket.io-client';
import { reactive, ref } from 'vue';
import FlashMessages from '../components/FlashMessages.vue';
import UpperLine from '../components/UpperLine.vue';
import ComplaintComponent from './components/ComplaintComponent.vue';

let user = ref(null);

function setProfile(profile) {
  user.value = profile;
}

let complains = ref([]);

let filteredComplains = ref([]);

axios.get('/complains/load').then(({ data }) => {
  complains.value = data;
  filteredComplains.value = complains.value.filter((elem) => !elem.is_accepted).sort((elem1, elem2) => elem1.id - elem2.id);;
})

let messages = ref(null);

async function deleteComplaint(id) {
  try {
    await axios.delete('/complains/delete', { data: { id } });
    for (let i = 0; i < complains.value.length; i++) {
      if (complains.value[i].id == id) {
        complains.value.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < filteredComplains.value.length; i++) {
      if (filteredComplains.value[i].id == id) {
        filteredComplains.value.splice(i, 1);
        break;
      }
    }
  } catch (err) {
    axios.get('/flash-messages').then(({ data }) => {
      messages.value = data;
    })
  }
}

let socket = io();

socket.on('complaint-accepted', (id) => {
  for (let i = 0; i < complains.value.length; i++) {
    if (complains.value[i].id == id) {
      complains.value[i].is_accepted = true;
      break;
    }
  }
  if (pickedOption.value === 'New') {
    for (let i = 0; i < filteredComplains.value.length; i++) {
      if (filteredComplains.value[i].id == id) {
        filteredComplains.value.splice(i, 1);
        break;
      }
    }
    filteredComplains.value = complains.value.filter((elem) => !elem.is_accepted).sort((elem1, elem2) => elem1.id - elem2.id);;
  } 
})

let additionalText = ref('');

let acceptedComplaint = ref(null);

let dialogIsVisible = ref(false);

function showDialog(complaint) {
  console.log(complaint);
  acceptedComplaint.value = complaint;
  dialogIsVisible.value = true;
}

function hideDialog() {
  acceptedComplaint.value = null;
  dialogIsVisible.value = false;
}

function acceptComplaint() {
  let complaint = acceptedComplaint.value;
  complaint.additionalText = additionalText.value;
  socket.emit('complaint-accept', complaint);
  hideDialog();
}

let pickedOption = ref('New');


function pickOption(option) {
  pickedOption.value = option;
  if (option === 'New') filteredComplains.value = complains.value.filter((elem) => !elem.is_accepted);
  else filteredComplains.value = complains.value.filter((elem) => elem.is_accepted);
}

let pickedSortOption = ref('Date');

function pickSortOption(option) {
  pickedSortOption.value = option;
}

let optionPicking = ref(false);

function showSortPanel() {
  optionPicking.value = !optionPicking.value;
}

let complaintTypes = ['Misleading Information', 'Fraudulent Activity',
  'Inappropriate Content', 'Privacy Violation', 'Payment and Refund Issues', 'Other Issues'];

let visibleColumns = reactive({});

function toggleColumns(type) {
  visibleColumns[type] = !visibleColumns[type];
}

function columnIsVisible(type) {
  return visibleColumns[type];
}

</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.main-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.complains-cont {
  width: 1020px;
}

.sort-option {
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: $calendar-grey;
  height: 15px;
  padding: 5px 5px 5px 5px;
}

.buttons-cont {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.left-btns {
  display: flex;
  flex-direction: row;
}

.sort-btn {
  margin-right: 4px;
  cursor: pointer;
  font-size: 22px;
  padding: 15px 10px 15px 10px;
  border-bottom: 4px solid #fff;
}

.sort-btn:hover {
  border-color: $calendar-grey;
}

.right-btn {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.option-panel {
  position: absolute;
  right: 0;
  z-index: 10;
  top: 25px;
  background-color: #ffffff;
  box-shadow: -2px 2px 7px -3px rgba(0, 0, 0, 0.75);
}

.panel-option {
  cursor: pointer;
  padding: 10px 12.5px 10px 12.5px;
}

.panel-option:hover {
  background-color: $calendar-grey;
}

.pick-img {
  width: 16px;
  height: 16px;
}

.type-header {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 26px;
  font-weight: 500;
}

.column-btn {
  padding: 5px 5px 5px 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 50%;
}

.complains-show-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.complains-show-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.complains-show-enter-active {
  transition: all .3s;
}

.complains-show-leave-active {
  transition: all .3s;
}


.text-dialog {
  background-color: rgb(117, 117, 117, 0.5);
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.input-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
}

.additional-text {
  font-size: 16px;
  font-family: 'Roboto';
  resize: vertical;
  border-radius: 10px;
  padding: 10px 10px 10px 10px;
  width: 500px;
  height: 300px;
  border: 3px solid $border-grey;
}

.submit-btn {
  margin-top: 10px;
  color: #fff;
  background-color: $button-red;
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  font-size: 18px;
  align-self: flex-end;
  cursor: pointer;
  width: max-content;
}

.submit-header {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.submit-btn:hover {
  background-color: $button-hover-red;
}
</style>