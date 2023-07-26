<template>
  <div class="delete-dialog">
    <div class="delete-dialog-cont">
      <img class="dialog-cancel-img" @click="hideDialog" src="/images/dialog-cancel.png" />
      <div class="dialog-delete-header">{{ header }}</div>
      <div class="dialog-delete-text">{{ lowerText }}</div>
      <div class="dialog-btns-cont">
        <div class="dialog-cancel-btn" @click="hideDialog">Cancel</div>
        <div class="dialog-confirm-delete-btn" @click="submitDelete">Delete</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let props = defineProps({
  header: String,
  lowerText: String 
}) 

let emits = defineEmits({
  'hide-dialog': null,
  'submit-delete': null
})

function hideDialog() {
  emits('hide-dialog');
}

function submitDelete() {
  emits('submit-delete');
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.delete-dialog {
  top: 0;
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(117, 117, 117, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-dialog-cont {
  position: relative;
  padding: 40px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
}

.dialog-delete-header {
  font-size: 24px;
  font-weight: 500;
} 

.dialog-delete-text {
  margin-top: 10px;
  text-align: center;
  font-size: 18px;
  white-space: pre-wrap;
}

.dialog-btns-cont {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
}

.dialog-cancel-btn {
  margin-left: 10px;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 10px;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  width: max-content;
  &:hover {
    background-color: $calendar-grey;
  }
}

.dialog-confirm-delete-btn {
  margin-right: 10px;
  display: flex;
  align-items: center;
  background-color: $button-red;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  font-family: "Roboto";
  color: #ffffff;
  padding: 10px 10px 10px 10px;
  font-size: 18px;
  width: max-content;
  &:hover {
    background-color: $button-hover-red;
  }
}

.dialog-cancel-img {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}
</style>