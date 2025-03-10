<template>
  <div>
    <img src="../../assets/images/PawfectHome.png" alt="Pawfect Home Logo" />
    <div class="signup-main">
      <div class="image-container">
        <div class="welcome">Welcome! We’re excited to have you.</div>
        <img
          class="signup-cat"
          src="../../assets/images/SignUpCat.png"
          alt="Signup"
        />
      </div>
      <div class="signup-form-container">
        <div class="upload-image">
          <img src="../../assets/images/Camera.png" alt="Upload" />
        </div>
        <div class="signup-form">
          <div class="signup-form-input">
            <p>First name</p>
            <input
              type="text"
              placeholder="Samuel"
              v-model="firstname"
              required
            />
          </div>
          <div class="signup-form-input">
            <p>Last name</p>
            <input type="text" placeholder="Tan" v-model="lastname" required />
          </div>
          <div class="signup-form-input">
            <p>Email</p>
            <input
              type="text"
              placeholder="crapcake@gmail.com"
              v-model="email"
              required
            />
          </div>
          <div class="signup-form-input">
            <p>Contact number</p>
            <input
              type="text"
              placeholder="crapcake@gmail.com"
              v-model="email"
              required
            />
          </div>
          <div class="signup-form-input">
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              required
            />
          </div>
          <div class="signup-form-input">
            <p>Confirm Password</p>
            <input
              type="password"
              placeholder="Re-Enter Password"
              v-model="confirmPassword"
              required
            />
            <p v-if="passwordMismatch && confirmPassword" class="error-message">
              Passwords do not match
            </p>
          </div>
        </div>
        <div class="signup-form-button" @click="register">
          <div class="next-button">Next</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { app } from "../../../firebase/firebase.js";
import { ref, computed } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const passwordMismatch = computed(
  () => password.value !== confirmPassword.value
);

const register = async () => {
  if (passwordMismatch.value && confirmPassword.value) {
    console.error("Passwords do not match");
    return;
  }
  try {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("Successfully registered", userCredential);
  } catch (error) {
    console.error("Error registering", error);
  }
};
</script>

<style scoped>
@import url("../../assets/styles/SignUp.css");
</style>
