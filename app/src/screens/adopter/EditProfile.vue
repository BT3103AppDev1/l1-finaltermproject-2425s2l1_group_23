<template>
  <div class="edit-profile-container">
    <img src="@/assets/images/PawfectHome-logo.png" alt="Pawfect Home Logo" class="logo" />

    <h1 class = "edit-profile">Edit Profile</h1>
    <div class="profile-image-container">
      <img :src="profileImage || defaultProfileImage" class="profile-image" alt="Profile Picture" />
    </div>

    <!-- Form Submission Prevents Page Reload -->
     <!-- if its a valid user, their info will appear in form fields -->
    <form @submit.prevent="updateProfile">
      <div class="form-row">
        <div class="form-input-group">
          <label>First Name</label>
        <input v-model="firstName" :placeholder="originalFirstName" type="text" required />
      </div>

        <div class="form-input-group">
          <label>Last Name</label>
          <input v-model="lastName" :placeholder="originalLastName" type="text" required />
        </div>
      </div>

      <div class="form-input-group">
        <label>Email</label>
        <input v-model="email" :placeholder="originalEmail" type="email" required />
        <p v-if="email && !isEmailValid" class="error-message">Invalid email format</p>
      </div>

      <div class="form-input-group">
        <label>Contact Number</label>
        <input v-model="contactNumber" :placeholder="originalContactNumber" type="text" required />
        <p v-if="contactNumber && !isContactNumberValid" class="error-message">Invalid contact number</p>
      </div>

  

      <div class="form-input-group password-group">
        <label>Password</label>
        <input type="password" placeholder="********************" disabled />
      </div>
      <button type="button" class="reset-password-btn" @click="resetPassword">
          Reset Password
      </button>


      <div class="upload-certificate">
        <label class="upload-label">Upload your pet ownership course certificate</label>
        <p v-if = "!selectedFileName" class = "upload-description">
          You have not uploaded a pet ownership course certificate.<br />
          To adopt a dog or cat, you must first upload your pet ownership course certificate.
        </p>

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
        <p>Select your file or drag and drop</p>
        <small>png, pdf, jpg, docx accepted <br> </small>

        <input 
          type="file"
          ref="fileInput"
          accept=".png, .pdf, .jpg, .jpeg, .docx"
          style="display: none"
          @change="handleFileSelect"
        />

        <button 
          type="button" 
          class="browse-btn" 
          @click="triggerFileInput"
        >
          Browse
        </button>
        <p v-if="selectedFileName" class="uploaded-file">
          Uploaded: <a :href="selectedFileURL" target="_blank">{{ selectedFileName }}</a>
          <button type="button" class="remove-btn" @click="removeFile">
            Remove
          </button>
        </p>


  </div>
</div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

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
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { deleteObject } from "firebase/storage";
import { deleteField } from "firebase/firestore";


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// user details
const user = auth.currentUser; //get currently logged-in user
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
    originalFirstName.value = userData.firstName;
    originalLastName.value = userData.lastName;
    originalEmail.value = userData.email;
    originalContactNumber.value = userData.contactNumber;

    firstName.value = userData.firstName;
    lastName.value = userData.lastName;
    email.value = userData.email;
    contactNumber.value = userData.contactNumber;
    profileImage.value = userData.profileImage || defaultProfileImage;

    // fetch certiciate if available
    if (userData.certificate_picture) {
      selectedFileURL.value = userData.certificate_picture;
      selectedFileName.value = userData.certificate_picture.split("/").pop(); // Show file name
    }
  }
});

//pet ownership certificate validation
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
  selectedFileName.value = selectedFile.value ? selectedFile.value.name : '';
};

const handleFileDrop = (event) => {
  selectedFile.value = event.dataTransfer.files[0];
  selectedFileName.value = selectedFile.value ? selectedFile.value.name : '';
  newCertificateURL.value = "";// Reset new URL since we haven't uploaded yet
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert("Please select a file first!");
    return null; // return null if no file is selected
  }

  try {
    const storageReference = storageRef(storage, `certificates/${user.uid}/${selectedFile.value.name}`);
    
    // Upload file
    await uploadBytes(storageReference, selectedFile.value);
    
    // Get file URL
    const downloadURL = await getDownloadURL(storageReference);
    return downloadURL;  // Return new certificate URL
   
  } catch (error) {
    console.error("File upload failed:", error);
    alert("File upload failed: " + error.message);
    return null; // Return null in case of an error
  }
};

// remove file function
const removeFile = () => {
  selectedFile.value = null;
  selectedFileName.value = "";
  selectedFileURL.value = "";
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
    const querySnapshot = await getDocs(query(usersRef, where("email", "==", email.value)));

    if (!querySnapshot.empty && email.value !== user.email) {
      alert("This email is already registered. Please use another email.");
      errorMessage.value = "Email already registered!";
      return;
    }

    //If the user changed email, update in Firebase Authentication
    if (email.value !== user.email) {
      await updateEmail(user, email.value);
    }

    if (selectedFile.value) {
      newCertificateURL.value = await uploadFile();
    }

    //If a new certificate was uploaded, store the new URL
    //If the user removed the certificate, delete it from Firestore & Storage
    let certificateUpdate = {};
    if (newCertificateURL.value) {
      certificateUpdate = { certificate_picture: newCertificateURL.value };
    } else if (!selectedFileName.value && selectedFileURL.value) {
      // User removed the file -> delete from Firebase
      const fileRef = storageRef(storage, selectedFileURL.value);
      await deleteObject(fileRef);
      certificateUpdate = { certificate_picture: deleteField() };
    }


    //Update Firestore with new details, including certificate if uploaded
    const userDocRef = doc(db, "Users", user.uid);
    await updateDoc(userDocRef, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      contactNumber: contactNumber.value,
      ...certificateUpdate //Only update certificate if a new file was uploaded
    });

    //Update UI after saving
    selectedFileURL.value = newCertificateURL.value || "";
    selectedFileName.value = newCertificateURL.value ? newCertificateURL.value.split("/").pop() : "";

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
  font-family: 'Fredoka One';
}
.error-message {
  color: #ff0000;
  font-size: 0.8em;
  margin-top: 0.5em;
}

.edit-profile-container {
  width: 70%;
  margin: auto;
  background-color: F5F5F5;
  padding: 2em;
  border-radius: 1em;
  font-family: "Poppins", sans-serif;
}

.logo {
  position: absolute;
  top: 1em;
  left: 1em;
  width: 5em;
}

.main-heading {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 1em;
}

.profile-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}

.profile-image {
  width: 5em;
  height: 5em;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 1em;
  right: 20em;
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
  padding: 0.8em;
  border-radius: 0.5em;
  border: 0.05em solid #ddd;
  font-size: 0.9em;
  background-color: #ffffff;
}

.password-group {
  position: relative;
}

.reset-password-btn {
  position: absolute;
  right: 0;
  top: 2.2em;
  background: none;
  border: none;
  color: 7C7C7C;
  cursor: pointer;
  font-size: 0.8em;
  text-decoration: underline;
}


.upload-certificate {
  background-color:F5F5F5;
  padding: 1.5em;
  border-radius: 0.75em;
  text-align: center;
  margin-bottom: 1.5em;
}

.upload-label {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1em;
  font-weight: 600;
  color: #222;
  display: block;
  margin-bottom: 0.5em;
}
 
.upload-description {
  font-family: Raleway Semibold;
  font-size: 0.95em;
  color: #7c7c7c;
  line-height: 1.5;
  margin-bottom: 1em;
}

.file-upload-box {
  border: 0.15em dashed #ccc;
  padding: 1.5em;
  border-radius: 0.75em;
  cursor: pointer;
}

.file-upload-box p {
  margin: 0;
  font-size: 1em;
  color: #555;
}

.browse-button {
  background-color: #9f9c9c;
  color: white;
  border-radius: 0.5em;
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
  border-radius: 2em;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9em;
}

.cancel-btn {
  background-color: #ffffff;
  color: #222f61;
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
