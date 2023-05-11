<template>
    <form method="post" action="/login">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="submit" />
    </form>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent ({
    setup() {
        console.log(123);
    }
})
</script>

<style>

</style>