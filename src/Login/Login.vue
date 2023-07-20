<template>
    <UpperLine />
    <FlashMessages :messages="messages"/>
    <div class="login-container">
        <form class="login-form" method="post" action="/login">
            <div class="input-lbl">Username</div>
            <div class="text-input-cont" :style="{borderColor: focusedInput == 'username' ? '#FF2F69' : '#d1d1d1'}">
                <img class="login-img" 
                  :src="focusedInput === 'username' ? `/images/user-focused.png` :`/images/username.png`"
                />
                <input class="text-input" type="text" name="username" @blur="setUnfocused" 
                @focus="setFocused('username')">
            </div>
            <div class="input-lbl">Password</div>
            <div class="text-input-cont" :style="{borderColor: focusedInput == 'password' ? '#FF2F69' : '#d1d1d1'}">
                <img class="login-img" style="width: 27px !important; height: 27px !important; left: 7px !important;"
                  :src="focusedInput === 'password' ? `/images/password-focused.png` :`/images/password.png`"
                />
                <input class="text-input" :type="isHidden ? 'text' : 'password'" name="password" @blur="setUnfocused" 
                @focus="setFocused('password')"/>
                <img class="hide-btn" @click="hidePassword" 
                  :src="!isHidden && focusedInput === 'password'? `/images/hide-password-focused.png`
                  : isHidden && focusedInput === 'password' ? `/images/show-password-focused.png`
                  : !isHidden && focusedInput !== 'password' ? `/images/hide-password.png`
                  : `/images/show-password.png`"
                />
            </div>
            <input class="submit-btn" type="submit" value="Sign In"/>
            <div class="register-lbl">
                Don't have an account?
                <a href="/registration" class="sign-up-link">Sign Up</a>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import UpperLine from '../components/UpperLine.vue';
import FlashMessages from '../components/FlashMessages.vue';
import axios from 'axios';

let messages = ref(null);

axios.get('/flash-messages').then(({ data }) => {
    messages.value = data;
})

let focusedInput = ref(null);

function setFocused(input) {
    focusedInput.value = input;
}

function setUnfocused() {
    focusedInput.value = null;
}

let isHidden = ref(false);

function hidePassword() {
    isHidden.value = !isHidden.value;
}
</script>

<style lang="scss">
@import '../../public/stylesheets/colors.scss';

.login-container {
    height: calc(100vh - 71px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-form {
    display: flex;
    flex-direction: column;
}

.login-img {
    height: 30px;
    position: absolute;
    left: 5px;
    width: 30px;
}

.text-input-cont {
    margin: 10px;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    position: relative;
    border: 2px solid $border-grey;
    padding-left: 40px;
    width: 230px;
}

.text-input {
    border: none;
    outline: none;
    font-family: 'Roboto';
    font-size: 16px;
    &:focus {
        color: $button-red;
        border-color: $button-red;
    }
}

.submit-btn {
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    border: none;
    outline: none;
    font-family: 'Roboto';
    font-size: 18px;
    color: #fff;
    font-size: 20px;
    background-color: $button-red;
    cursor: pointer;
    &:hover {
        background-color: $button-hover-red;
    }
}

.input-lbl {
    margin-left: 10px;
    font-size: 22px;
}

.sign-up-link {
    color: $link-blue;
    text-decoration: none;

}

.register-lbl {
    margin-left: 10px;
}

.hide-btn {
    cursor: pointer;
    right: 5px;
    position: absolute;
    width: 28px;
    height: 28px;
}
</style>