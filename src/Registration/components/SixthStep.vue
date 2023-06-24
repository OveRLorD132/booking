<template>
  <div class="sixth-step-container">
    <img class="done-img" src="/images/done.png"/>
    <div class="done-label">Your Registration</div>
    <div class="done-label">Successfully Done!</div>
    <div class="done-btn"><a class="btn-link" href="/">Return to main page</a></div>
    <div class="done-btn"><a class="btn-link" href="/profile">Go to profile</a></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';

.sixth-step-container {
  display: flex;
  flex-direction: column;
}
.done-img {
  align-self: center;
  width: 300px;
  height: 300px;
}
.done-label {
  text-align: center;
  font-size: 30px;
}

.done-btn {
  cursor: pointer;
  text-align: center;
  font-size: 20px;
  background-color: $button-red;
  color: #fff;
  width: 300px;
  border-radius: 10px;
  padding: 10px 10px 10px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.done-btn:hover {
  background-color: $button-hover-grey;
}

.btn-link {
  text-decoration: none;
  color: #fff;
}
</style>