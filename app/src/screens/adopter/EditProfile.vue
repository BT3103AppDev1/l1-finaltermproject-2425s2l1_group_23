<template>
  <div class="edit-profile-container">
    <!-- Logo and Heading Container -->
    <div class="header-container">
      <router-link to="/home" class="logo-link">
        <img
          src="@/assets/images/PawfectHome-logo.png"
          alt="Pawfect Home Logo"
          class="logo"
        />
      </router-link>
      <h1 class="edit-profile">Edit Profile</h1>
      <div class="profile-image-container">
        <img
          :src="profileImage || defaultProfileImage"
          class="profile-image"
          alt="Profile Picture"
        />
      </div>
    </div>

    <!-- Form Submission Prevents Page Reload -->
    <!-- if its a valid user, their info will appear in form fields -->
    <form @submit.prevent="updateProfile">
      <div class="form-row">
        <div class="form-input-group">
          <label>First Name</label>
          <input
            v-model="firstName"
            :placeholder="originalFirstName"
            type="text"
            required
          />
        </div>

        <div class="form-input-group">
          <label>Last Name</label>
          <input
            v-model="lastName"
            :placeholder="originalLastName"
            type="text"
            required
          />
        </div>
      </div>

      <div class="form-input-group">
        <label>Email</label>
        <input
          v-model="email"
          :placeholder="originalEmail"
          type="email"
          required
        />
        <p v-if="email && !isEmailValid" class="error-message">
          Invalid email format
        </p>
      </div>

      <div class="form-input-group">
        <label>Contact Number</label>
        <input
          v-model="contactNumber"
          :placeholder="originalContactNumber"
          type="text"
          required
        />
        <p v-if="contactNumber && !isContactNumberValid" class="error-message">
          Invalid contact number
        </p>
      </div>

      <div class="form-input-group password-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="*************************"
          disabled
        />
      </div>
      <button type="button" class="reset-password-btn" @click="resetPassword">
        Reset Password
      </button>

      <div class="upload-certificate">
        <div class="upload-info">
          <label class="upload-label"
            >Upload your pet ownership course certificate</label
          >
          <p
            className="upload-certificate-error"
            v-if="!selectedFileName"
            class="upload-description"
          >
            You have not uploaded a pet ownership course certificate.<br />
            To adopt a dog or cat, you must first upload your pet ownership
            course certificate.
          </p>
        </div>

        <div
          class="file-upload-box"
          @dragover.prevent
          @dragenter.prevent
          @drop.prevent="handleFileDrop"
        >
          <img
            src="@/assets/images/editprofile/exportlogo.png"
            alt="Export Logo"
            class="exportlogo"
          />
          <p className="drop-message">Select your file or drag and drop</p>
          <small className="drop-message"
            >png, pdf, jpg, docx accepted <br />
          </small>

          <input
            type="file"
            ref="fileInput"
            accept=".png, .pdf, .jpg, .jpeg, .docx"
            style="display: none"
            @change="handleFileSelect"
          />

          <button type="button" class="browse-btn" @click="triggerFileInput">
            Browse
          </button>
          <!---
          <p v-if="selectedFileName" class="uploaded-file">
            Uploaded:
            <a :href="selectedFileURL" target="_blank">{{
              selectedFileName
            }}</a>
            <button type="button" class="remove-btn" @click="removeFile">
              Remove
            </button>
          </p>
        -->
          <p v-if="selectedFileName" class="uploaded-file">
            Uploaded:
            <a
              :href="`data:image/jpeg;base64,${selectedFileBase64}`"
              target="_blank"
              >{{ selectedFileName }}</a
            >
            <button type="button" class="remove-btn" @click="removeFile">
              Remove
            </button>
          </p>
        </div>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="buttons-group">
        <button type="button" class="cancel-btn" @click="cancelEdit">
          Cancel
        </button>
        <button type="submit" class="save-btn">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  getAuth,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import { app } from "../../../firebase/firebase.js";
import defaultProfileImage from "@/assets/images/editprofile/Default_pfp.jpg"; // Default profile pic
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { deleteObject } from "firebase/storage";
//import { deleteField } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/*
// for TESTING: artificially log in
// TEST LOGIN
const testEmail = "chiaminghan123@gmail.com"; // Replace with a real test account email
const testPassword = "123456"; // Replace with the correct password

signInWithEmailAndPassword(auth, testEmail, testPassword)
  .then((userCredential) => {
    console.log("Test login successful:", userCredential.user);
  })
  .catch((error) => {
    console.error("Test login failed:", error.message);
  });
*/

// user details
//const user = auth.currentUser; //get currently logged-in user
const user = ref(null); // Initialize as null (no user logged in initially)
console.log("current user: " + user);
const firstName = ref("");
const lastName = ref("");
const email = ref(user?.email || ""); //get currently logged-in user's email
const contactNumber = ref("");
const password = ref("");
const profileImage = ref(null);
const errorMessage = ref("");

// to display user's details in the form (placeholder)
const originalFirstName = ref("");
const originalLastName = ref("");
const originalEmail = ref("");
const originalContactNumber = ref("");

// for certificate uploads
const fileInput = ref(null);
const selectedFile = ref(null);
const selectedFileName = ref("");
const selectedFileURL = ref(""); // Stores existing Firestore certificate URL
const newCertificateURL = ref(""); // Stores new uploaded certificate URL
const selectedFileBase64 = ref("");

//Email Validation
const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
);

//Contact Number Validation
const isContactNumberValid = computed(() =>
  /^[89][0-9]{7}$/.test(contactNumber.value)
);

onMounted(() => {
  // this way, using onAuthStateChanged, when refresh page, the user will still be signed in
  /*
  previously, when you use auth.currentUser or user.uid, it does not wait for firebase auth to restore user's state
  after the page reload. 

  during this period, auth.currentUser is null so there will be TypeError in the Promise

  dont try to use "await" because it wont work as auth.currentUser is synchronous and does not
  return a Promise

  onAuthStateChanged is an observer that listens for changes in authentication state.
  it ensures this application waits until Firebase AUthentication has restored 
  the user's state before proceeding
  */
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser; // Set the user if authenticated
      fetchUserData(); // Fetch user data from Firestore
    } else {
      console.error("User not authenticated");
      user.value = null; // Clear the user if not authenticated
      alert("You must be logged in to view this page.");
      window.location.href = "/login"; // Redirect to login page
    }
  });

  // Unsubscribe the observer when the component is unmounted
  onUnmounted(() => {
    unsubscribe();
  });
});

//Load User Data from Firestore on component Mount
const fetchUserData = async () => {
  if (!user) return;

  const userDoc = await getDoc(doc(db, "Users", user.value.uid)); // Fetch user data from Firestore
  if (userDoc.exists()) {
    const userData = userDoc.data();
    console.log("userdata: " + userData);
    originalFirstName.value = userData.firstName;
    console.log("user first name: " + userData.firstName);
    originalLastName.value = userData.lastName;
    originalEmail.value = userData.email;
    originalContactNumber.value = userData.contactNumber;

    firstName.value = userData.firstName;
    lastName.value = userData.lastName;
    email.value = userData.email;
    contactNumber.value = userData.contactNumber;
    profileImage.value = userData.profileImage || defaultProfileImage;

    /*
    // fetch certiciate if available
    if (userData.certificate_picture) {
      selectedFileURL.value = userData.certificate_picture;
      selectedFileName.value = userData.certificate_picture.split("/").pop(); // Show file name
    }
      */
    // Fetch certificate if available
    if (userData.certificate_base64) {
      selectedFileBase64.value = userData.certificate_base64;
      selectedFileName.value = "PET_CERTIFICATE"; // Default file name
    }
  }
};

//pet ownership certificate validation
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
  selectedFileName.value = selectedFile.value ? selectedFile.value.name : "";
};

const handleFileDrop = (event) => {
  selectedFile.value = event.dataTransfer.files[0];
  selectedFileName.value = selectedFile.value ? selectedFile.value.name : "";
  newCertificateURL.value = ""; // Reset new URL since we haven't uploaded yet
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert("Please select a file first!");
    return null; // return null if no file is selected
  }

  try {
    // convert file to Base64
    const base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Get only the Base64 part
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(selectedFile.value);
    });

    // store Base64 string in Firestore
    const userDocRef = doc(db, "Users", user.value.uid);
    await updateDoc(userDocRef, { certificate_base64: base64String });
    //alert("File uploaded successfully and saved to Firestore!");
    return base64String; // Return Base64 string
  } catch (error) {
    console.error("File upload failed:", error);
    alert("File upload failed: " + error.message);
    return null;
  }
};

// remove file function
const removeFile = () => {
  selectedFile.value = null;
  selectedFileName.value = "";
  selectedFileBase64.value = "";
};

// take user's back to previous page if user press cancel button
const cancelEdit = () => {
  window.history.back();
};

const updateProfile = async () => {
  errorMessage.value = "";

  //Validate email format
  if (!isEmailValid.value) {
    alert("Invalid Email Format");
    errorMessage.value = "Invalid Email Format";
    return;
  }

  //Validate contact number format
  if (!isContactNumberValid.value) {
    alert("Invalid contact number");
    errorMessage.value = "Invalid contact number!";
    return;
  }

  try {
    //Check if email is already taken
    const usersRef = collection(db, "Users");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", email.value))
    );

    if (!querySnapshot.empty && email.value !== user.value.email) {
      alert("This email is already registered. Please use another email.");
      errorMessage.value = "Email already registered!";
      return;
    }

    //If the user changed email, update in Firebase Authentication
    if (email.value !== user.value.email) {
      await updateEmail(user, email.value);
    }

    // Upload the certificate as a Base64 string if a new file was selected
    let certificateUpdate = {};
    if (selectedFile.value) {
      const base64String = await uploadFile();
      if (base64String) {
        certificateUpdate = { certificate_base64: base64String };
      }
    } else if (!selectedFileName.value) {
      // User removed the file -> remove the certificate field from Firestore
      certificateUpdate = { certificate_base64: deleteField() };
    }

    //Update Firestore with new details, including certificate if uploaded
    const userDocRef = doc(db, "Users", user.value.uid);
    console.log(
      "updating ... " +
        firstName.value +
        lastName.value +
        email.value +
        contactNumber.value
    );
    await updateDoc(userDocRef, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      contactNumber: contactNumber.value,
      ...certificateUpdate, //Only update certificate if a new file was uploaded
    });

    //selectedFileURL.value = ""; // Clear the URL since we're not using it
    //selectedFileName.value = ""; // Clear the file name
    //selectedFileBase64.value = "";

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error Updating Profile: " + error.message);
    errorMessage.value = "Error updating profile: " + error.message;
  }
};
</script>

<style scoped>
@import url("../../assets/styles/font.css");

.edit-profile {
  font-size: 2em;
  font-weight: bold;
  font-family: "FredokaOne-Regular";
}
.error-message {
  color: #ff0000;
  font-size: 0.8em;
  margin-top: 0.5em;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 1em; /* Space between logo and heading */
  margin-bottom: 1em;
  justify-content: space-between;
}

.edit-profile-container {
  font-family: "Poppins", sans-serif;
  padding: 2em;
  width: 70%;
  margin: auto;
  border-radius: 1em;
}

.logo {
  width: 5em;
}

.main-heading {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 1em;
}

.profile-image {
  width: 5em;
  height: 5em;
  border-radius: 50%;
  object-fit: cover;
}

.profile-image-container {
  align-items: center;
  display: flex;
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
  font-family: "Raleway-SemiBold";
  color: #1c1c1c;
  font-weight: bold;
  margin-bottom: 0.4em;
  text-align: left;
}

.form-input-group input {
  padding: 0.8em;
  border-radius: 0.5em;
  border: 0.05em solid #ddd;
  font-size: 0.9em;
  background-color: #ffffff;
}

/* password */
.password-group {
  position: relative;
}

.reset-password-btn {
  font-family: "Poppins-Medium";
  color: #7c7c7c;
  font-style: italic;
  position: relative;
  left: 95em;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
}

.upload-certificate {
  background-color: F5F5F5;
  padding: 1.5em;
  border-radius: 0.75em;
  text-align: center;
  margin-bottom: 1.5em;
}

.upload-info {
  text-align: left;
  margin-left: -1.5em;
}

.upload-label {
  font-family: "Raleway-SemiBold";
  font-size: 1.1em;
  color: #1c1c1c;
  display: block;
}

.upload-description {
  font-family: "Raleway-Light";
  color: #1c1c1c;
  font-size: 0.95em;
  line-height: 1.5;
}

.file-upload-box {
  border: 0.15em dashed #ccc;
  padding: 1.5em;
  border-radius: 0.75em;
  cursor: pointer;
  width: 100%;
  margin-left: -1.5em;
}

.file-upload-box p {
  font-family: "Raleway-SemiBold";
  color: #000000;
  margin-bottom: 1em;
  font-size: 1em;
}

.file-upload-box small {
  font-family: "Poppins-Regular";
  color: #000000;
  opacity: 0.7;
}

.browse-btn {
  font-family: "Poppins-Bold";
  color: #f7f3eb;
  background-color: #858585;
  font-size: 12px;
  width: 12.8em;
  height: 3.3em;
  border-radius: 0.5em;
  padding: 0.5em 1em;
  border: none;
  cursor: pointer;
  margin-top: 3em;
}

.browse-btn:hover {
  background-color: grey;
}

.buttons-group {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-top: 1.5em;
}

.cancel-btn,
.save-btn {
  font-family: "Raleway-Bold";
  padding: 0.6em 2em;
  border-radius: 2em;
  width: 10.375em;
  height: 3.625em;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9em;
  font-size: 16;
}

.cancel-btn {
  color: #222f61;
  background-color: #ffffff;
  border: 0.05em solid #9c9c9c;
}

.cancel-btn:hover {
  background-color: whitesmoke;
}

.save-btn {
  background-color: #222f61;
  color: #ffffff;
}

.save-btn:hover {
  background-color: #004080;
}
</style>
