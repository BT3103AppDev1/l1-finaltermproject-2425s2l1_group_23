<template>
    <div class="listing-page-container">
      <div class="logo-container">
        <img src="@/assets/images/PawfectHome.png" alt="Pawfect Home Logo" class="logo" />
      </div>
  
      <div class="main-content">
        <div class="image-and-text">
          <div class="pet-image-container">
            <img
              src="@/assets/images/addlisting/addlisting1bg.png"
              alt="Background"
              class="petbg"
            />
            <img
              src="@/assets/images/addlisting/addlisting1.png"
              alt="Hamster"
              class="pet"
            />
          </div>
  
          <div class="form-section">
            <h1 class="title">What type of pet<br> would you like to put up<br> for adoption?</h1>
  
            <div class="pet-options">
                <div class = "row">
                    <label class="pet-option"><input type="radio" value="Dog" v-model="petType" /> Dog</label>
                    <label class="pet-option"><input type="radio" value="Bird" v-model="petType" /> Bird</label>
                    <label class="pet-option"><input type="radio" value="Hamster" v-model="petType" /> Hamster</label>

                </div>
                <div class="row">
                    <label class="pet-option"><input type="radio" value="Cat" v-model="petType" /> Cat</label>
                    <label class="pet-option"><input type="radio" value="Rabbit" v-model="petType" /> Rabbit</label>
                    <label class="pet-option"><input type="radio" value="Other" v-model="petType" /> Other (Please specify)</label>
                </div>
              
            </div>
  
            <div class="button-wrapper">
                <button class="next-button" @click="goNext">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref,onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { doc, getFirestore, collection, addDoc } from "firebase/firestore";
  import { app } from "../../../firebase/firebase.js";

  
  const router = useRouter();
  const petType = ref("Dog");
  
  // Firebase setup
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  
  onMounted(() => {
  const saved = localStorage.getItem("petType");
  try {
    if (saved) {
      // Handle both old string version and object version
      petType.value = typeof saved === "string" && saved.includes("{")
        ? JSON.parse(saved).petType
        : saved;
    }
  } catch (e) {
    console.error("Error parsing petType from localStorage", e);
    petType.value = "Dog"; // fallback default
  }
});

  const goNext = () => {
  // Save pet type to localStorage
  const petTypeObj = { petType: petType.value };
  localStorage.setItem("petType", petType.value);


  router.push("/addlisting2");
};

  </script>
  

  <style scoped>
@import url("../../assets/styles/font.css");

.listing-page-container {
  background-color: #f7f3eb;
  min-height: 100vh;
  padding: 2em;
  font-family: "Poppins", sans-serif;
}

.logo-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 1em;
}

.main-content {
  display: flex;
  justify-content: center;
  margin-top: 2em;
}

.image-and-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4em;
  max-width: 90em;
  margin: 0 auto;
  padding-left: 10em;
}

.pet-image-container {
  position: relative;
  width: fit-content;
  height: auto;
}

.petbg {
  position: relative;
  z-index: 0;
  top: 5em;
}

.pet {
  position: absolute;
  top: 3em;
  left: 0;
  width: 50em;
  z-index: 0;
}

.title {
  font-family: "FredokaOne-Regular";
  font-size: 2.875em; /* 46px */
  color: #333333;
  margin-bottom: 1em;
  width: 23em;
  text-align: left;
}

.form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  z-index: 1;
}

.pet-options {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  margin-bottom: 2em;
  align-items: flex-start;
}

.pet-option {
  font-family: "Poppins-Regular";
  font-size: 1em; /* 16px */
  color: #333333;
  display: block;
}

.row {
  display: flex;
  gap: 1.5em;
}

.button-wrapper {
  text-align: center;
  margin-right: 45em;
  margin-top: 2em;
}

.next-button {
  background-color: #222f61;
  color: white;
  font-family: "Poppins-Bold";
  border: none;
  border-radius: 1.5em;
  padding: 0.8em 2em;
  font-size: 1em; /* 16px */
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 11.3em; /* ~181px */
  height: 3.375em; /* ~54px */
}

.next-button:hover {
  transform: scale(1.05);
}
</style>
