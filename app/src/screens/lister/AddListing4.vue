<template>
    <div class="listing-page">
  
      <div class="form-box">
        <div class="form-section">
          <div class="upload-certificate">
            <div class="upload-info">
            <h1 class="title">Almost there!</h1>
              <label class="upload-label">
                Upload your pet license
              </label>
              <p class="upload-description" v-if="!selectedFileName">
                You have not uploaded a pet license.<br />
                To put a dog or cat up for adoption, you must first upload your pet license.
              </p>
            </div>
  
            <div
              class="file-upload-box"
              @dragover.prevent
              @dragenter.prevent
              @drop.prevent="handleFileDrop"
            >
              <img src="@/assets/images/editprofile/exportlogo.png" alt="Export Logo" class="exportlogo" />
              <p>Select your file or drag and drop</p>
              <small>png, pdf, jpg, docx accepted <br /></small>
  
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
  
              <p v-if="selectedFileName" class="uploaded-file">
                Uploaded:
                <a
                  :href="`data:image/jpeg;base64,${selectedFileBase64}`"
                  target="_blank"
                >{{ selectedFileName }}</a>
                <button type="button" class="remove-btn" @click="removeFile">
                  Remove
                </button>
              </p>
            </div>
          </div>
  
          <div class="buttons-group">
            <button @click="goBack" class="cancel-btn">Back</button>
            <button @click="goToPreview" class="save-btn">Preview</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { getAuth } from "firebase/auth";
  import { getFirestore, doc, updateDoc } from "firebase/firestore";
  import { app } from "../../../firebase/firebase";
  import { onMounted } from 'vue'
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  
  const fileInput = ref(null);
  const selectedFile = ref(null);
  const selectedFileName = ref("");
  const selectedFileBase64 = ref("");
  
  onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("fullPetListingData") || "{}");
  selectedFileName.value = saved.petLicenseFileName || "";
  selectedFileBase64.value = saved.petLicenseBase64 || "";
});

  function triggerFileInput() {
    fileInput.value.click();
  }
  
  function handleFileSelect(event) {
    selectedFile.value = event.target.files[0];
    selectedFileName.value = selectedFile.value ? selectedFile.value.name : "";
    convertToBase64(selectedFile.value);
  }
  
  function handleFileDrop(event) {
    selectedFile.value = event.dataTransfer.files[0];
    selectedFileName.value = selectedFile.value ? selectedFile.value.name : "";
    convertToBase64(selectedFile.value);
  }
  
  function convertToBase64(file) {
    const reader = new FileReader();
    reader.onload = () => {
      selectedFileBase64.value = reader.result.split(",")[1];
    };
    reader.readAsDataURL(file);
  }
  
  function removeFile() {
    selectedFile.value = null;
    selectedFileName.value = "";
    selectedFileBase64.value = "";
  }
  
  function goBack() {
    router.push("/addlisting3");
  }
  

function goToPreview() {
  const petType = localStorage.getItem("petType") || "";
  const basics = JSON.parse(localStorage.getItem("petBasicsInfo") || "{}");
  const lifestyle = JSON.parse(localStorage.getItem("petLifestyleInfo") || {});

  const fullData = {
    petType,
    ...basics,
    ...lifestyle,
    petLicenseFileName: selectedFileName.value,
    petLicenseBase64: selectedFileBase64.value,
  };

  localStorage.setItem("fullPetListingData", JSON.stringify(fullData));
  router.push("/petprofilepreview");
}





  </script>
  
  <style scoped>
  @import url("../../assets/styles/font.css");
  
  .title {
    font-size: 2em;
    text-align: centre;
    margin-bottom: 1em;
    font-family: "FredokaOne-Regular";
  }
  
  .form-box {
    max-width: 900px;
    margin: 0 auto;
    font-family: "Poppins", sans-serif;
  }
  
  .upload-certificate {
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
  
  .uploaded-file {
    margin-top: 1em;
  }
  
  .remove-btn {
    margin-left: 1em;
    color: red;
    background: none;
    border: none;
    cursor: pointer;
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
    font-size: 16px;
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
  