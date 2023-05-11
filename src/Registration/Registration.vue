<template>
    <form action="/registration" method="post">
        <input type="text" name="username"/>
        <input type="text" name="email"/>
        <input type="password" name="password"/>
        <input type="submit"/>
    </form>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        console.log(123);
    }
});
</script>

<style>

</style>