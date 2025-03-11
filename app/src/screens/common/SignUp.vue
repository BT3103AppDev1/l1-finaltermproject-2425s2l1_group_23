<template>
  <div class="signup">
    <img src="../../assets/images/PawfectHome.png" alt="Pawfect Home Logo" />
    <div class="signup-main">
      <div class="image-container">
        <div class="welcome">Welcome! We’re excited to have you.</div>
        <div class="cat-border">
          <img
            class="signup-cat"
            src="../../assets/images/SignUpCat.png"
            alt="Signup"
          />
        </div>
      </div>
      <div class="signup-form-container">
        <input
          type="file"
          @change="handleProfileImage"
          accept="image/*"
          style="display: none"
          ref="fileInputRef"
        />
        <div class="upload-image" @click="$refs.fileInputRef.click()">
          <img
            :src="previewImage || cameraIcon"
            :class="{ preview: previewImage }"
            alt="Upload"
          />
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
              placeholder="81234567"
              v-model="contactNumber"
              required
            />
            <p
              v-if="!isContactNumberValid && contactNumber"
              class="error-message"
            >
              Invalid contact number
            </p>
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
import cameraIcon from "@/assets/images/Camera.png";
import { app } from "../../../firebase/firebase.js";
import { ref, computed } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);

const fileInputRef = ref(null);
const profileImage = ref(null);
const previewImage = ref(null);
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const password = ref("");
const contactNumber = ref("");
const confirmPassword = ref("");

const passwordMismatch = computed(
  () => password.value !== confirmPassword.value
);

const isContactNumberValid = computed(() => {
  const contactNumberPattern = /^[89][0-9]{7}$/;
  return contactNumberPattern.test(contactNumber.value);
});

const handleProfileImage = (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
    console.log("Selected File:", file); // Check if file is correctly captured
    profileImage.value = file; // Store the file, not the input element
    console.log("Profile Image Value:", profileImage.value); // Should log a File object
    previewImage.value = URL.createObjectURL(file); // Generate preview
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error("Invalid file format or file is null"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const register = async () => {
  if (passwordMismatch.value) {
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
    const userId = userCredential.user.uid;
    console.log("Profile Image Value:", profileImage.value);

    let profileImageBase64 = null;

    if (profileImage.value && profileImage.value instanceof File) {
      profileImageBase64 = await convertToBase64(profileImage.value);
    } else {
      console.error("Invalid file selected:", profileImage.value);
    }

    console.log("Profile Image Base64:", profileImageBase64);

    const userData = {
      firstName: firstname.value,
      lastName: lastname.value,
      email: email.value,
      password: password.value,
      contactNumber: contactNumber.value,
      profileImage: profileImageBase64,
      hasOnboard: false,
    };

    await setDoc(doc(db, "Users", userId), userData);

    console.log("User registered and data stored in Firestore:", userData);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
</script>

<style scoped>
@import url("../../assets/styles/SignUp.css");
</style>
