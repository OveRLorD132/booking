<template>
    <LineComponent />
    <div class="mainContainer">
        <form @submit.prevent="registration" class="registrationForm">
            <div class="registrationRow">
                First Name:
                <input type="text" v-model="firstName" />
            </div>
            <div class="error">{{ firstNameError }}</div>
            <div class="registrationRow">
                Last Name:
                <input type="text" v-model="lastName" />
            </div>
            <div class="error">{{ lastNameError }}</div>
            <div class="registrationRow">
                Username:
                <input type="text" v-model="username"/>
            </div>
            <div class="error">{{ usernameError }}</div>
            <div class="registrationRow">
                E-mail:
                <input type="text" v-model="email"/>
            </div>
            <div class="error">{{ emailError }}</div>
            <div class="registrationRow">
                Password:
                <input type="password" v-model="password"/>
            </div>
            <div class="error">{{ passwordError }}</div>
            <input type="submit" value="Sign Up"/>
        </form>
    </div>

</template>

<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import LineComponent from '../components/LineComponent.vue';
let firstNameError = ref(null);
let firstName = ref(null);

watch(firstName, (newValue) => {
    if(newValue === "") firstNameError.value = "This field mustn't be empty.";
    else if(newValue.length > 50) firstNameError.value = "Your name is too long.";
    else firstNameError.value = null;
})

let lastNameError = ref(null);
let lastName = ref(null);

watch(lastName, (newValue) => {
    if(newValue === "") lastNameError.value = "This field mustn't be empty.";
    else if(newValue.length > 50) lastNameError.value = "Your name is too long.";
    else lastNameError.value = null;
})

let usernameError = ref(null);
let username = ref(null);

watch(username, (newValue) => {
    if(newValue === "") usernameError.value = "This field mustn't be empty.";
    else if(newValue.length < 8) usernameError.value = "Your username must be at least 8 symbols.";
    else if(newValue.length > 20) usernameError.value = "Your username is too long.";
    else usernameError.value = null;
})

let emailError = ref(null);
let email = ref(null);

watch(email, (newValue) => {
    if(newValue === "") emailError.value = "This field mustn't be empty.";
    else if(newValue.length > 50) emailError.value = "Email is too long.";
    else emailError.value = null;
})

let passwordError = ref(null);
let password = ref(null);

watch(password, (newValue) => {
    if(newValue === "") passwordError.value = "This field mustn't be empty.";
    else if(newValue.length < 8) passwordError.value = "Your password must be at least 8 symbols.";
    else if(newValue.length > 30) passwordError.value = "Password is too long.";
    else passwordError.value = null;
})

let registration = async () => {
    if(firstNameError.value || lastNameError.value || usernameError.value || emailError.value || passwordError.value) return;
    else if(!firstName.value || !lastName.value || !username.value || !email.value || !password.value) return;
    try {
        await axios.post('/registration', {
            first_name: firstName.value,
            last_name: lastName.value,
            username: username.value,
            email: email.value,
            password: password.value
        })
    } catch(err) {
        console.error(err);
    }
}
</script>

<style scoped lang="scss">
@import '../../public/stylesheets/colors.scss';
.mainContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
}
.registrationForm {
    align-items: center;
    display: flex;
    flex-direction: column;
}

.error {
    margin-right: 17px;
    align-self: flex-end;
    color: #D0000C;
}

input[type="text"], 
input[type="password"] {
    margin: 10px 10px 10px 10px;
    padding: 10px 10px 10px 10px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    background-color: $input-back;
}

input[type="submit"] {
    width: 200px;
    cursor: pointer;
    background-color: $button-red;
    margin: 10px 10px 10px 10px;
    border: none;
    border-radius: 10px;
    color: #ffffff;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 18px;
}

.registrationRow {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
</style>