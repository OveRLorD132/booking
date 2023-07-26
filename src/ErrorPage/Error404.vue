<template>
  <UpperLine/>
  <ErrorPage :code="404"/>
</template>

<script setup>
import ErrorPage from '../components/ErrorPage.vue';
import '../components/UpperLine.vue';
</script>

<style lang="scss">

</style>