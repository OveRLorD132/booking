<template>
  <div class="month-calendar-container" v-if="chosenMonth === undefined">
    <div class="year-container">
      <img class="calendar-btn" style="transform: scaleX(-100%);" src="/images/calendar-next.png" @click="yearBack"/>
      {{ year }}
      <img class="calendar-btn" src="/images/calendar-next.png" @click="nextYear"/>
    </div>
    <div class="month-grid">
      <div class="calendar-month" v-for="(monthName, index) of monthPickNames" @click="monthPick(index)"
      :style="{gridRow: index > 7 ? '3 / 3' : index > 3 ? '2 / 2' : ''}">{{ monthName }}</div>
    </div>
  </div>
  <div class="day-calendar-container" v-if="chosenMonth !== undefined">
    <h2 class="month-header">
      <div class="left-header" @click="calendarBack">
        <img class="back-btn" src="/images/return.png"/>
        <div class="year-lbl">{{ getCurrentMonth() }} {{ year }}</div>
      </div>

      <div class="btn-container">
        <img src="/images/calendar-next.png" style="transform: scaleX(-100%);" class="calendar-btn back-image" @click="monthBack"/>
        <img src="/images/calendar-next.png" class="calendar-btn next-image" @click="nextMonth"/>
      </div>
    </h2>
    <table>
      <tr>
        <th class="calendar-day" v-for="day in daysOfWeek" :key="day">{{ day }}</th>
      </tr>
      <tr v-for="(week, index) of calendar" :key="week">
        <td @click="chooseDate(date, index)" class="calendar-day" 
        :style="{color: date.getMonth() < chosenMonth ? '#ADADAD' : ''}" v-for="date in week" :key="date">
          <div :style="{
            backgroundColor: compareDates(date, chosenDate) ? '#FF2F69 !important' : '',
            color: compareDates(date, chosenDate) ? '#ffffff !important' : ''
          }" class="calendar-day-text">{{ date.getDate() }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let daysOfWeek = ref(['S', 'M', 'T', 'W', 'T', 'F', 'S']);

let monthPickNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let calendar = ref(null);

let emits = defineEmits({
  'date-picked': null
})

let year = ref(new Date().getFullYear());

let month = ref(new Date().getMonth());

let chosenMonth = ref(undefined);

let chosenDate = ref(new Date());

function monthBack() {
  if(!chosenMonth.value) {
    year.value--;
    chosenMonth.value = 11;
  } 
  else chosenMonth.value--;
  generateCalendar();
}

function nextMonth() {
  if(chosenMonth.value === 11) {
    year.value++;
    chosenMonth.value = 0;
  } else chosenMonth.value++;
  generateCalendar();
}

function nextYear() {
  year.value++;
}

function yearBack() {
  year.value--;
}

function generateCalendar() {
  let firstDay = new Date(year.value, chosenMonth.value, 1);
  let startingDay = firstDay.getDay();
  let monthLength = new Date(year.value, chosenMonth.value + 1, 0).getDate();
  let date = 1;
  let generatedCalendar = [];
  generatedCalendar[0] = [];
  let previousMonth = chosenMonth.value - 1;
  let previousMonthYear = year.value;
  if(previousMonth < 0) {
    previousMonth = 11;
    previousMonthYear--;
  }
  let previousMonthLength = new Date(previousMonthYear, previousMonth + 1, 0).getDate();
  let previousMonthStart = previousMonthLength - startingDay + 1;
  console.log(previousMonthStart);
  for (let i = 0; i < startingDay; i++) {
    generatedCalendar[0].push(new Date(previousMonthYear, previousMonth, previousMonthStart++));
  }
  console.log(generatedCalendar)
  for (let i = 0; i < 6; i++) {
    let week = [];
    let firstLineLength = generatedCalendar[0].length;
    for (let j = 0; j < 7; j++) {
      if (i === 0) {
        if(j >= firstLineLength) generatedCalendar[0].push(new Date(year.value, chosenMonth.value, date++))
      } else if (date > monthLength || date > 31) {
        break;
      } else week.push(new Date(year.value, chosenMonth.value, date++));
    }
    generatedCalendar.push(week);
  }
  calendar.value = generatedCalendar;
}

function monthPick(num) {
  chosenMonth.value = num;
  generateCalendar();
  console.log(calendar.value);
}

function chooseDate(date) {
  chosenDate.value = date
  emits('date-picked', chosenDate.value);
}

function getCurrentMonth() {
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[chosenMonth.value];
}

function calendarBack() {
  chosenMonth.value = undefined;
}

function compareDates(date1, date2) {
  if(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) return true;
  return false;
}
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.month-header {
  width: 220px;
  margin-left: 10px;
  margin-bottom: 5px;
  font-size: 20px;
  color: $button-red;
  display: flex;
  justify-content: space-between;
}

.day-calendar-container {
  background-color: #ffffff;
  position: absolute;
  top: 50px;
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
}

.month-calendar-container {
  background-color: #ffffff;
  position: absolute;
  top: 50px;
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
  display: flex;
  flex-direction: column;
  width: 200px;
}

.year-container {
  margin-top: 5px;
  margin-bottom: 5px;
  align-self: center;
  width: 180px;
  display: flex;
  justify-content: space-between;
}

.month-grid {
  display: grid;
  align-items: center;
  justify-content: center;
  justify-items: center;
  grid-template-columns: repeat(4, 50px);
  grid-template-rows: repeat(3, 50px);
}

.calendar-day {
  //text-align: start;
  font-weight: 700;
  width: 30px;
  height: 30px;
}

.calendar-month {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: $active-grey;
}

.calendar-month:hover {
  background-color: $calendar-grey;
}

.calendar-day-text:hover {
  background-color: $calendar-grey;
}

.calendar-day-text {
  cursor: pointer;
  display: flex;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.calendar-btn {
  width: 17px;
  height: 17px;
  cursor: pointer;
}

.left-header {
  display: flex;
  align-items: center;
}

.back-btn {
  margin-right: 5px;
  cursor: pointer;
  width: 25px;
  height: 25px;
}

.year-lbl {
  cursor: pointer;
}

.year-lbl:hover {
  text-decoration: underline;
}
</style>