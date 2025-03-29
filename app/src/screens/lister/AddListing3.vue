<template>
    <div class="listing-page">
      <h1 class="title">Getting there!</h1>
  
      <div class="form-box">
        <div class="form-section">
          <label>Vaccination Status*</label>
          <Multiselect
            v-model="pet.vaccinations"
            :options="vaccinationOptions"
            mode="tags"
            placeholder="Select Vaccination Status"
            close-on-select
            class="dropdown"
          />
  
          <label>Food Allergies</label>
          <Multiselect
            v-model="pet.allergies"
            :options="allergyOptions"
            mode="tags"
            placeholder="Select Food Allergies"
            close-on-select
            class="dropdown"
          />
  
          <label>Diet Type</label>
          <Multiselect
            v-model="pet.diet"
            :options="dietOptions"
            placeholder="Select Diet"
            class="dropdown"
          />
  
          <label>Favourite Food / Treats</label>
          <Multiselect
            v-model="pet.favFood"
            :options="favFoodOptions"
            mode="tags"
            placeholder="Select Favourite Food"
            close-on-select
            class="dropdown"
          />
  
          <label>Training Level</label>
          <Multiselect
            v-model="pet.training"
            :options="trainingOptions"
            placeholder="Select Training Level"
            class="dropdown"
          />
  
          <label>Activity Level</label>
          <Multiselect
            v-model="pet.activity"
            :options="activityOptions"
            placeholder="Select Activity Level"
            class="dropdown"
          />
  
          <label>Temperament</label>
          <Multiselect
            v-model="pet.temperament"
            :options="temperamentOptions"
            mode="tags"
            placeholder="Select Temperament"
            close-on-select
            class="dropdown"
          />
  
          <label>Socialisation</label>
          <Multiselect
            v-model="pet.socialisation"
            :options="socialisationOptions"
            mode="tags"
            placeholder="Select Socialisation"
            close-on-select
            class="dropdown"
          />
  
          <label>Fears / Triggers</label>
          <Multiselect
            v-model="pet.triggers"
            :options="triggerOptions"
            mode="tags"
            placeholder="Select Fears / Triggers"
            close-on-select
            class="dropdown"
          />
  
          <label>Pet Price (SGD)</label>
          <input v-model.number="pet.price" type="number" />
        </div>
  
        <div class="form-buttons">
          <button @click="goBack" class="secondary">Back</button>
          <button @click="submitForm" class="primary">Next</button>
        </div>
      </div>
    </div>
  </template>
  

  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { getFirestore, doc, updateDoc } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  import { app } from "../../../firebase/firebase";
  import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { onMounted } from 'vue'
  
  const db = getFirestore(app);
  const auth = getAuth(app);
  const router = useRouter();
  
  const vaccinationOptions = ["💉 Distemper", "💉 Parvovirus", "💉 Rabies"];
  const allergyOptions = ["🥛 Dairy", "🥜 Peanut Butter", "🌾 Grains", "🦐 Seafood"];
  const dietOptions = ["🍲 Home Cooked", "🍖 Dry Kibble", "🥩 Raw Food", "🍱 Mixed Diet"];
  const favFoodOptions = ["🍗 Chicken", "🫐 Blueberries", "🧈 Peanut Butter", "🧀 Cheese"];
  const trainingOptions = ["🚫 No Training", "✅ Basic Obedience", "📘 Intermediate", "🎓 Advanced"];
  const activityOptions = ["🛏️ Low", "🚶 Medium", "🏃 High", "🏃‍♂️💨 Very High"];
  const temperamentOptions = ["😊 Friendly", "😄 Playful", "😌 Calm", "😰 Anxious"];
  const socialisationOptions = [
    "👶 Gets along with kids",
    "🐶 Gets along with other dogs",
    "🐱 Gets along with cats",
  ];
  const triggerOptions = ["🔊 Loud noises", "🧍 Strangers", "🧹 Vacuum cleaner", "🌩️ Thunderstorms"];
  
  const pet = ref({
    vaccinations: [],
    allergies: [],
    diet: [],
    favFood: [],
    training: [],
    activity: "",
    temperament: [],
    socialisation: [],
    triggers: [],
    price: null,
  });


  onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("petLifestyleInfo") || "{}");

  pet.value.vaccinations = saved.petVax || [];
  pet.value.allergies = saved.petAllergies || [];
  pet.value.diet = saved.petDiet || [];
  pet.value.favFood = saved.petFavFood || [];
  pet.value.training = saved.petLifestyleTraining || [];
  pet.value.activity = saved.petLifestyleActivity || "";
  pet.value.temperament = saved.petPersonalityTemperament || [];
  pet.value.socialisation = saved.petPersonalitySocialisation || [];
  pet.value.triggers = saved.petTriggers || [];
  pet.value.price = saved.petPrice || null;
});




  
  function goBack() {
    router.push("/addlisting2");
  }
  
 
  function submitForm() {
  if (!pet.value.vaccinations || pet.value.vaccinations.length === 0) {
    alert("Please fill in the required field: Vaccination Status");
    return;
  }

  const lifestyleInfo = {
    petVax: pet.value.vaccinations,
    petAllergies: pet.value.allergies,
    petDiet: pet.value.diet,
    petFavFood: pet.value.favFood,
    petLifestyleTraining: pet.value.training,
    petLifestyleActivity: pet.value.activity,
    petPersonalityTemperament: pet.value.temperament,
    petPersonalitySocialisation: pet.value.socialisation,
    petTriggers: pet.value.triggers,
    petPrice: pet.value.price,
  };

  localStorage.setItem("petLifestyleInfo", JSON.stringify(lifestyleInfo));
  router.push("/addlisting4");
}


  </script>
  
  <style scoped>
  @import "@vueform/multiselect/themes/default.css";
  @import url("../../assets/styles/font.css");

  .title {
    font-size: 40px;;
    text-align: center;
    margin-bottom: 1em;
    font-family: "FredokaOne-Regular";
  }
  .form-box {
    max-width: 600px;
    margin: 0 auto;
  }
  label {
    font-family: "Raleway-Medium";
    display: block;
    margin-top: 1em;
    font-weight: 600;
  }
  input,
  select {
    width: 100%;
    padding: 0.7em;
    margin-top: 0.3em;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: "Poppins", sans-serif;
  }
  select[multiple] {
    height: 6em;
  }
  .form-buttons {
  display: flex;
  justify-content: center;
  gap: 5em; /* space between buttons */
  margin-top: 2em;
}
  button {
    padding: 0.8em 2em;
    font-weight: bold;
    border: none;
    border-radius: 25px;
    font-size: 1em;
    cursor: pointer;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  }
  button.primary {
    background-color: #222f61;
    color: white;
  }
  button.secondary {
    background-color: white;
    color: #222f61;
    border: 2px solid #222f61;
  }
  </style>
  