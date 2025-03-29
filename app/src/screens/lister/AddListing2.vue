<template>
    <div class="listing-page">
      <img src="@/assets/images/addlisting/greenbg.png" class="green-blob" />
      <img src="@/assets/images/addlisting/pinkbg.png" class="pink-blob" />
  
      <div class="profile-container">
        <div class="image-and-title">
          <h1 class="title">Pet's Profile 🐶</h1>
          <div class="image-section">
            <div class="image-preview-wrapper">
                <img :src="previewUrl" class="circular-preview" />


            </div>
            <div class="upload-buttons">
              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                style="display: none"
              />
              <!-- image must be <1MB -->
              <button v-if="!uploadedImage" @click="triggerFileInput" class="primary">Upload</button> 
              <button v-else @click="removeImage" class="primary">Remove Image</button>
            </div>
          </div>
        </div>
  
        <div class="form-box">
          <p class="required-label">*Required</p>
          <div class="form-section">
            <label>Name*<input v-model="pet.name"  type="text" /></label>
            <label>Breed*<input v-model="pet.breed"  type="text" /></label>
            <label>Gender*
              <select v-model="pet.gender">
                <option disabled value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </label>
            <label>Date of Birth*<input v-model="pet.dob" type="date" /></label>
            <label>Weight(in kg)*<input v-model="pet.weight" type="number" /></label>
            <label>Height(in cm)*<input v-model="pet.height"  type="number" /></label>
          </div>
  
          <div class="form-buttons">
            <button @click="goBack" class="secondary">Cancel</button>
            <button @click="submitForm" class="primary">Next</button>
          </div>
        </div>
      </div>

      <img src="@/assets/images/addlisting/greenbg.png" class="green-blob" />
      <img src="@/assets/images/addlisting/pinkbg.png" class="pink-blob" />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../../../firebase/firebase.js";
import defaultImage from "../../assets/images/addlisting/Defaultpfp.jpg";
import { onMounted } from 'vue'



const auth = getAuth(app);
const db = getFirestore(app);
const router = useRouter();
  
  const pet = ref({
    name: "",
    breed: "",
    gender: "",
    dob: "",
    weight: "",
    height: "",
  });
  
  const uploadedImage = ref(null); // Store selected image
  const previewUrl = ref(defaultImage); // Default image if none selected
  const fileInput = ref(null);
  const imageBase64 = ref("");
  
  onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("petBasicsInfo") || "{}");

  pet.value.name = saved.name || "";
  pet.value.breed = saved.breed || "";
  pet.value.gender = saved.gender || "";
  pet.value.dob = saved.dob || "";
  pet.value.weight = saved.weight || "";
  pet.value.height = saved.height || "";

  if (saved.petPhotoBase64) {
    previewUrl.value = `data:image/jpeg;base64,${saved.petPhotoBase64}`;
    imageBase64.value = saved.petPhotoBase64;
  }
});


  function triggerFileInput() {
    fileInput.value.click();
  }

  const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedImage.value = file;
    previewUrl.value = URL.createObjectURL(file);

    // Convert to image to Base64String
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
      imageBase64.value = base64;
    } catch (err) {
      console.error("Error converting to Base64:", err);
      alert("Image processing failed.");
    }
  }
};


// resets when user click remove image
function removeImage() { 
  uploadedImage.value = null;
  previewUrl.value = defaultImage;
  imageBase64.value = "";
  fileInput.value.value = "";
}

  function goBack() {
    router.push("/addlisting1");
  }

  function submitForm() {
  // Check that all required fields are filled
  if (!pet.value.name || !pet.value.breed || !pet.value.gender || !pet.value.dob || !pet.value.weight || !pet.value.height) {
    alert("All fields must be filled out.");
    return;
  }

  // Store pet basic info to localStorage
  const petBasics = {
    name: pet.value.name,
    breed: pet.value.breed,
    gender: pet.value.gender,
    dob: pet.value.dob,
    weight: pet.value.weight,
    height: pet.value.height,
    petPhotoBase64: imageBase64.value || ""
  };

  localStorage.setItem("petBasicsInfo", JSON.stringify(petBasics));

  // Go to next screen (AddListing3)
  router.push("/addlisting3");
}

  </script>
  
  <style scoped>
  @import url("../../assets/styles/font.css");
  
  .listing-page {
    padding: 2em;
    font-family: "Poppins", sans-serif;
    background-color: #f7f3eb;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  .green-blob {
    position: absolute;
    bottom: 13em;
    left: 33em;
    width: 18.75em; 
    opacity: 0.4;
    z-index: 0;
  }
  
  .pink-blob {
    position: absolute;
    top: -4em;
    right: 5em;
    width: 37.5em;
    opacity: 0.4;
    z-index: 0;
  }
  
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 8em;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    margin-top: 2em;
  }
  
  .image-and-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }
  
  .title {
    font-family: "FredokaOne-Regular";
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 0.5em;
  }
  
  .image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .image-preview-wrapper {
    width: 14.375em;
    height: 14.375em;
    border-radius: 50%;
    overflow: hidden;
    border: 0.063em solid #ccc;
    margin-bottom: 1em;
  }
  
  .circular-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;     /* ensures the whole image fits in view */
    object-position: center;
    border-radius: 50%;
    background-color: white; 
  }
  
  button {
    font-family: "Raleway-Bold";
    padding: 0.9em 2.5em;
    min-width: 8.125em; 
    height: 3em; 
    border-radius: 1.875em; 
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease;
    box-shadow: 0em 0.125em 0.375em rgba(0, 0, 0, 0.25); 
  }
  
  button.primary {
    background-color: #222f61;
    color: white;
    border: none;
  }
  
  button.secondary {
    background-color: white;
    color: #222f61;
    border: 0.125em solid #222f61; 
  }
  
  button:hover {
    transform: scale(1.02);
  }
  
  .form-box {
    padding: 2em;
    width: 31.25em; 
  }
  
  .required-label {
    color: red;
    font-size: 0.85em;
    margin-bottom: 1em;
    padding-left: 0.25em;
  }
  
  .form-section {
    background-color: white;
    display: flex;
    flex-direction: column;
    border: 0.063em solid #ccc; 
    border-radius: 0.625em;
    overflow: hidden;
  }
  
  label {
    font-family: "Raleway-Medium";
    display: flex;
    flex-direction: column;
    font-size: 0.85em;
    font-weight: 600;
    color: #333;
    border-bottom: 0.063em solid #ccc; 
    padding: 0.5em 1em 0.3em;
  }
  
  label:last-child {
    border-bottom: none;
  }
  
  input,
  select {
    padding: 0.8em 1em;
    border: none;
    border-radius: 0;
    font-family: inherit;
    font-size: 1em;
    outline: none;
    background-color: white;
  }
  
  select {
    appearance: none;
  }
  
  .form-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5em;
    margin-top: 3em;
  }
  </style>
  