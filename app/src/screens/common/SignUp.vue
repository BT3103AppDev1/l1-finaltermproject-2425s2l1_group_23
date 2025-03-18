<template>
  <div class="signup">
    <img src="../../assets/images/PawfectHome.png" alt="Pawfect Home Logo" />
    <div class="signup-main">
      <div class="image-container">
        <div class="welcome">Welcome! We’re excited to have you.</div>
        <div class="cat-border">
          <img
            class="signup-cat"
            src="../../assets/images/signup/SignUpCat.png"
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
              placeholder="pawfecthome@pawmail.com"
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
import cameraIcon from "@/assets/images/signup/Camera.png";
import { app } from "../../../firebase/firebase.js";
import { ref, computed } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = getFirestore(app);
const router = useRouter();

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

const login = async () => {
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("Successfully logged in", userCredential);
  } catch (error) {
    console.error("Error logging in", error);
    alert("Error logging in: Incorrect email or password");
  }
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
      isPetLister: false,
    };

    await setDoc(doc(db, "Users", userId), userData);

    console.log("User registered and data stored in Firestore:", userData);

    await login();

    router.push("/onboarding");
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
</script>

<style scoped>
@import url("../../assets/styles/font.css");

.signup {
  max-height: 100vh;
}

.signup-main {
  display: flex;
  flex-direction: row;
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

.welcome {
  font-family: FredokaOne-Regular;
  color: #222f61;
  font-size: 2.5em;
  text-align: center;
  align-items: center;
  padding: 1em;
  width: 60%;
  z-index: 2;
}

.cat-border {
  background-color: #cee1b9;
  border-radius: 20% 80% 70% 31% / 36% 26% 66% 63%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 450px;
}

.signup-cat {
  width: 440px;
  z-index: 1;
  position: absolute;
  top: 240px;
  left: 96px;
}

.signup-form-container {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
}

.upload-image {
  background-color: #cee1b9;
  border-radius: 50%;
  width: 15em;
  height: 15em;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-image img {
  width: 50%;
  height: 50%;
}

.upload-image .preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upload-image:hover {
  background-color: #d4f1b2;
  transition: background-color 0.3s ease;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: white;
  border-radius: 7px;
  width: 55%;
  margin: 1em;
  border-left: 1px solid #7f7e83;
  border-right: 1px solid #7f7e83;
  margin-top: 2em;
}

.signup-form-input {
  padding: 0.5em 1em 1em;
  position: relative;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.signup-form-input:first-of-type {
  border-top: 0.5px solid #7f7e83;
}

.signup-form-input:last-of-type {
  border-bottom: 0.5px solid #7f7e83;
  border-top: 0.5px solid #7f7e83;
}

.signup-form-input:not(:first-of-type):not(:last-of-type) {
  border-top: 0.5px solid #7f7e83;
}

.signup-form-input:focus-within::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background-color: #222f61;
  transition: width 0.3s ease;
}

.signup-form-input:focus-within {
  border-left: 3px solid #222f61;
  transition: border-left 0.3s ease;
}

.signup-form-input:not(:focus-within) {
  transition: border-left 0.3s ease;
}

p {
  font-family: Raleway-Medium;
  color: black;
  font-size: 1em;
  margin: 0.5em 0.5em 0.2em;
}

input {
  font-family: Raleway-Bold;
  color: #838694;
  font-size: 0.9em;
  margin: 0.5em;
  border: none;
  outline: none;
}

.signup-form-button {
  background-color: #222f61;
  font-size: 1em;
  border-radius: 30px;
  padding: 0.7em;
  margin: 1em 2em;
  cursor: pointer;
  width: 8em;
  height: 1.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.382) 0 4px 4px;
  transition: background-color 0.3s ease;
}

.next-button {
  font-family: Raleway-Bold;
  color: white;
  border: none;
  background-color: none;
  font-size: 0.9em;
  cursor: pointer;
}

.signup-form-button:hover {
  background-color: #94a2dc;
  transition: background-color 0.3s ease;
}

.error-message {
  color: #fd7c7c;
  font-size: 0.9em;
}

@media (max-width: 1024px) {
  .signup-main {
    flex-direction: column;
  }

  .image-container,
  .signup-form-container {
    width: 100%;
  }

  .cat-border {
    width: 560px;
    height: 368px;
  }

  .signup-form-container {
    margin-top: 1.5em;
  }

  .signup-cat {
    width: 330px;
    top: 170px;
    left: 330px;
  }

  .signup-form {
    width: 60%;
  }

  .welcome {
    font-size: 2em;
    width: 80%;
  }

  .signup-form-button {
    width: 20%;
    height: auto;
  }
}

@media (max-width: 768px) {
  .signup-form {
    width: 70%;
  }

  .welcome {
    font-size: 1.5em;
    width: 90%;
  }

  .cat-border {
    width: 400px;
    height: 256px;
  }

  .signup-cat {
    width: 240px;
    top: 128px;
    left: 200px;
  }

  .signup-form-container {
    margin-top: 1.5em;
  }

  .upload-image {
    width: 8em;
    height: 8em;
  }

  .signup-form-button {
    width: 50%;
    height: auto;
  }
}
</style>
