<template>
  <div class="edit-profile-container">
    <img src="@/assets/images/PawfectHome-logo.png" alt="Pawfect Home Logo" class="logo" />

    <h1>Edit Profile</h1>
    <div class="profile-image-container">
      <img :src="profileImage || defaultProfileImage" class="profile-image" alt="Profile Picture" />
    </div>

    <!-- Form Submission Prevents Page Reload -->
     <!-- if its a valid user, their info will appear in form fields -->
    <form @submit.prevent="updateProfile">
      <div class="form-row">
        <div class="form-input-group">
          <label>First Name</label>
        <input v-model="firstName" type="text" required />
      </div>

        <div class="form-input-group">
          <label>Last Name</label>
          <input v-model="lastName" type="text" required />
        </div>
      </div>

      <div class="form-input-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
        <p v-if="email && !isEmailValid" class="error-message">Invalid email format</p>
      </div>

      <div class="form-input-group">
        <label>Contact Number</label>
        <input v-model="contactNumber" type="text" required />
        <p v-if="contactNumber && !isContactNumberValid" class="error-message">Invalid contact number</p>
      </div>

      <div class="form-input-group password-group">
        <label>Password</label>
        <input v-model="password" type="password" />
        <button type="button" class="reset-password-btn" @click="resetPassword">Reset Password</button>
      </div>

      <div class="buttons-group">
        <button type="button" class="cancel-btn" @click="cancelEdit">Cancel</button>
        <button type="submit" class="save-btn">Save</button>
      </div>
    </form>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuth, updateEmail, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { app } from "../../../firebase/firebase.js";
import defaultProfileImage from "@/assets/images/editprofile/Default_pfp.jpg"; // Default profile pic

const auth = getAuth(app);
const db = getFirestore(app);
const user = auth.currentUser;

const firstName = ref("");
const lastName = ref("");
const email = ref(user?.email || "");
const contactNumber = ref("");
const password = ref("");
const profileImage = ref(null);
const errorMessage = ref("");

//Email Validation
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

//Contact Number Validation
const isContactNumberValid = computed(() => /^[89][0-9]{7}$/.test(contactNumber.value));

//Load User Data from Firestore on component Mount
onMounted(async () => {
  if (!user) return;

  const userDoc = await getDoc(doc(db, "Users", user.uid));// Fetch user data from Firestore
  if (userDoc.exists()) {
    const userData = userDoc.data();
    firstName.value = userData.firstName;
    lastName.value = userData.lastName;
    email.value = userData.email;
    contactNumber.value = userData.contactNumber;
    profileImage.value = userData.profileImage || defaultProfileImage;
  }
});

//Reset Password
const resetPassword = async () => {
  if (!isEmailValid.value) {
    errorMessage.value = "Enter a valid email to reset password!";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value);
    alert("Password reset email sent!");
  } catch (error) {
    console.error("Error sending reset email:", error);
    errorMessage.value = "Error resetting password: " + error.message;
  }
};


const cancelEdit = () => {
  window.history.back();
};


const updateProfile = async () => {
  errorMessage.value = "";
  if (!isEmailValid.value) {
    alert("Invalid Email Format")
    errorMessage.value = "Invalid Email Format";
    return;
  }

  if (!isContactNumberValid.value) {
    alert("Invalid contact number")
    errorMessage.value = "Invalid contact number!";
    return;
  }

  try {
    //Check if email already exists in Firestore**
    const usersRef = db.collection("Users");
    const querySnapshot = await usersRef.where("email", "==", email.value).get();

    if (!querySnapshot.empty && email.value !== user.email) {
      alert("This email is already registered. Please use another email.");
      errorMessage.value = "Email already registered!";
      return;
    }

    if (email.value !== user.email) {
      await updateEmail(user, email.value);
    }

    if (password.value) {
      await updatePassword(user, password.value);
    }

    //updating firestore data
    const userDocRef = doc(db, "Users", user.uid);
    await updateDoc(userDocRef, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      contactNumber: contactNumber.value,
    });

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error Upating Profile:  " + error.message);
    errorMessage.value = "Error updating profile: " + error.message;
  }
};

</script>

<style scoped>
@import url("../../assets/styles/font.css");
.error-message {
  color: red;
}

.edit-profile-container {
  width: 70%;
  margin: auto;
  background-color: #f9f0e1;
  padding: 2em;
  border-radius: 15px;
  font-family: 'Poppins', sans-serif;
}

.main-heading {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1em;
}

.profile-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 1em;
}

.form-input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1em;
}

.form-input-group label {
  font-weight: bold;
  margin-bottom: 0.4em;
  text-align: left;
}

.form-input-group input {
  padding: 0.6em;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  background-color: #ffffff;
}

.password-group {
  position: relative;
}

.reset-password-btn {
  position: absolute;
  right: 0;
  top: 35px;
  background: none;
  border: none;
  color: #8a8989;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
}

.upload-section {
  margin-top: 1em;
  text-align: left;
}

.upload-title {
  font-weight: bold;
}

.upload-description {
  font-size: 0.8rem;
  color: #6e6e6e;
  margin-bottom: 1em;
}

.upload-box {
  border: 1px dashed #ccc;
  border-radius: 10px;
  padding: 2em;
  text-align: center;
  background-color: #faf6f1;
  font-size: 0.9rem;
  color: #7a7a7a;
}

.browse-button {
  background-color: #9f9c9c;
  color: white;
  border-radius: 8px;
  padding: 0.5em 1em;
  border: none;
  cursor: pointer;
  margin-top: 1em;
}

.buttons-group {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-top: 1.5em;
}

.cancel-btn,
.save-btn {
  padding: 0.6em 2em;
  border-radius: 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.cancel-btn {
  background-color: #fff;
  color: #000;
  border: 1px solid #9c9c9c;
}

.save-btn {
  background-color: #222f61;
  color: #fff;
}
</style>