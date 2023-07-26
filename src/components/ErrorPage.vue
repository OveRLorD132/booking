<template>
  <title>{{ code === 404 ? 'Error! Not Found' : ''}}</title>
  <div class="error-main-cont">
    <div class="error-cont">
      <div class="error-code">{{ code }}</div>
      <div class="error-description">
        {{ code === 404 ? 'Sorry, we were unable to find that page.' : 'Internal Server Error' }} Go to <a href="/" class="link">main</a> page.
      </div>
    </div>
  </div>
</template>

<script setup>
let props = defineProps({
  code: Number
})
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.error-main-cont {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 71px);
}

.error-cont {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-code {
  font-size: 380px;
}

.error-description {
  align-self: flex-start;
  font-size: 20px;
}

.link {
  color: $link-blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>