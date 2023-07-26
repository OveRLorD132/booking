<template>
  <UpperLine/>
  <ErrorPage :code="500"/>
</template>

<script setup>
import UpperLine from '../components/UpperLine.vue';

import ErrorPage from '../components/ErrorPage.vue';
</script>