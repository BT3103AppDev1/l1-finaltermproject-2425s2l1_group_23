<template>
    <h1>Login</h1>
    <p><input type = "text" placeholder = "Email" v-model = "email"/></p>
    <p><input type = "password" placeholder = "Password" v-model = "password"/></p>
    <p><button @click="login">Submit</button></p>

</template>
<script setup>

import { app }  from '../../../firebase/firebase.js';
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");

const login = async () => {
    try {
        const auth = getAuth(app);
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log('Successfully logged in', userCredential);
    } catch (error) {
        console.error('Error logging in', error);
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>