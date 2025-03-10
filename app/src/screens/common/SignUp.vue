<template>
    <h1>Create an account</h1>
    <p><input type = "text" placeholder = "Email" v-model = "email"/></p>
    <p><input type = "password" placeholder = "Password" v-model = "password"/></p>
    <p><button @click="register">Submit</button></p>

</template>
<script setup>

import { app }  from '../../../firebase/firebase.js';
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");

const register = async () => {
    try {
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log('Successfully registered', userCredential);
    } catch (error) {
        console.error('Error registering', error);
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>