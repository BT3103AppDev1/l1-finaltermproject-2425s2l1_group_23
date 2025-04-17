<template>
  <div class="listing-page">
    <img src="@/assets/images/addlisting/greenbg.png" class="green-blob" />
    <img src="@/assets/images/addlisting/pinkbg.png" class="pink-blob" />

    <div class="form-wrapper">
    <h1 class="title">Getting there!</h1>

    <div class="form-grid">

      <div class="field-box">
        <label>Vaccination Status*</label>
        <Multiselect
          v-model="pet.vaccinations"
          :options="vaccinationOptions"
          mode="tags"
          :can-deselect="true"
          
          close-on-select
        />
      </div>


      <div class="field-box">
        <label>Activity Level</label>
        <Multiselect
          v-model="pet.activity"
          :options="activityOptions"
          :can-deselect="true"
     
        />
      </div>


      <div class="field-box">
        <label>Food Allergies</label>
        <Multiselect
          v-model="pet.allergies"
          :options="allergyOptions"
          mode="tags"
          :can-deselect="true"

          close-on-select
        />
      </div>


      <div class="field-box">
        <label>Temperament</label>
        <Multiselect
          v-model="pet.temperament"
          :options="temperamentOptions"
          mode="tags"
          :can-deselect="true"

          close-on-select
        />
      </div>

 
      <div class="field-box">
        <label>Diet Type</label>
        <Multiselect
          v-model="pet.diet"
          :options="dietOptions"
          :can-deselect="true"
     
        />
      </div>


      <div class="field-box">
        <label>Socialisation</label>
        <Multiselect
          v-model="pet.socialisation"
          :options="socialisationOptions"
          mode="tags"
          :can-deselect="true"
  
          close-on-select
        />
      </div>


      <div class="field-box">
        <label>Favourite Food / Treats</label>
        <Multiselect
          v-model="pet.favFood"
          :options="favFoodOptions"
          mode="tags"
          :can-deselect="true"

          close-on-select
        />
      </div>


      <div class="field-box">
        <label>Fears / Triggers</label>
        <Multiselect
          v-model="pet.triggers"
          :options="triggerOptions"
          :can-deselect="true"
          mode="tags"

          close-on-select
        />
      </div>


      <div class="field-box">
        <label>Training Level</label>
        <Multiselect
          v-model="pet.training"
          :options="trainingOptions"
          :can-deselect="true"
        />
      </div>


      <div class="field-box">
        <label>Pet Price (SGD)</label>
        <input v-model.number="pet.price" type="number" />
      </div>
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
  
  const vaccinationOptions = [
  "💉 Distemper",
  "💉 Parvovirus",
  "💉 Rabies",
  "💉 Bordetella",
  "💉 Leptospirosis",
  "💉 Lyme Disease",
  "💉 Canine Influenza",
  "💉 Hepatitis"
];

const allergyOptions = [
  "🥛 Dairy",
  "🥜 Peanut Butter",
  "🌾 Grains",
  "🦐 Seafood",
  "🥩 Beef",
  "🐔 Chicken",
  "🐟 Fish",
  "🌽 Corn",
  "🥚 Eggs",
  "🍠 Sweet Potato"
];

const dietOptions = [
  "🍲 Home Cooked",
  "🍖 Dry Kibble",
  "🥩 Raw Food",
  "🍱 Mixed Diet",
  "🥬 Vegetarian",
  "🐟 Fish-Based",
  "🧊 Freeze-Dried",
  "🍖 Grain-Free Kibble",
  "🧪 Prescription Diet"
];

const favFoodOptions = [
  "🍗 Chicken",
  "🫐 Blueberries",
  "🧈 Peanut Butter",
  "🧀 Cheese",
  "🐟 Salmon",
  "🥕 Carrots",
  "🍌 Bananas",
  "🍎 Apples",
  "🦴 Bones/Chews",
  "🥓 Bacon"
];

const trainingOptions = [
  "🚫 No Training",
  "✅ Basic Obedience",
  "📘 Intermediate",
  "🎓 Advanced",
  "🐾 Crate Trained",
  "🛁 Potty Trained",
  "🦮 Leash Trained",
  "🧠 Trick Training",
  "🚨 Service Dog Trained"
];

const activityOptions = [
  "🛏️ Low",
  "🚶 Medium",
  "🏃 High",
  "🏃‍♂️💨 Very High",
  "🧘 Sedentary",
  "🐕‍🦺 Needs Daily Walks",
  "🎾 Loves Fetch",
  "🧗‍♂️ Hiker/Explorer",
  "🐿️ High Prey Drive"
];

const temperamentOptions = [
  "😊 Friendly",
  "😄 Playful",
  "😌 Calm",
  "😰 Anxious",
  "🧸 Gentle",
  "🐶 Affectionate",
  "😈 Mischievous",
  "😎 Independent",
  "🐕 Protective",
  "🐾 Curious"
];

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
  const cameFromPreview = sessionStorage.getItem("cameFromPreview");

  if (!cameFromPreview) {
    // Fresh listing: clear all inputs
    pet.value = {
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
    };
  } else {
    // Coming back from preview: restore inputs
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

    sessionStorage.removeItem("cameFromPreview");
  }
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

.listing-page {
  padding: 2em;
  font-family: "Poppins", sans-serif;
  background-color: #f7f3eb;
  min-height: 120vh;
  position: relative;
  overflow: hidden;

}
.form-wrapper {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  background-color: transparent;
}

.green-blob,
.pink-blob {
  position: absolute;
  z-index: 0;
  opacity: 0.7;
}

.green-blob {
  top: 44%;
  left: 40%;
  width: 20em;
  transform: rotate(5deg);
  z-index: 0;
}

.pink-blob {
  top: 10%;
  right: 75%;
  width: 16em;
  transform: rotate(270deg);
  z-index: 0;
}


.title {
  font-size: 2.5em;
  text-align: left;
  margin-bottom: 1em;
  font-family: "FredokaOne-Regular";
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5em 2.5em;
  max-width: 960px;
  margin: 0 auto;
}

.field-box {
  background-color: white;
  padding: 1em 1.2em;
  border: 1px solid #ccc;
  border-radius: 0.75em;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.field-box label {
  font-family: "Raleway-Medium";
  font-size: 0.85em;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.3em;
}

.field-box input {
  font-family: inherit;
  font-size: 1em;
  padding: 0.6em 0.2em;
  border-radius: 0.5em;
  border-width: 0px;
  font-family: Raleway-SemiBold;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 5em;
  margin-top: 3em;
}

button {
  padding: 0.8em 2em;
  font-weight: bold;
  border: none;
  border-radius: 1.875em;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0em 0.125em 0.375em rgba(0, 0, 0, 0.2);
}

button.primary {
  background-color: #222f61;
  color: white;
}

button.secondary {
  background-color: white;
  color: #222f61;
  border: 0.125em solid #222f61;
}

:deep(.multiselect-single-label),
:deep(.multiselect-single-label-text),
:deep(.multiselect-tag) {
  background-color: #8C9DE1 !important;  
  color: #ffffff !important;
  border-radius: 1.5em !important;     
  font-family: 'Raleway-SemiBold';
  font-size: 1em;
  padding: 0.3em 0.5em;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: none !important;
}

/*Hide the 'x' icon unless you want delete pills */
:deep(.multiselect-tag-remove),
:deep(.multiselect-clear),
:deep(.multiselect-tag-icon) {
  display: none !important;
}


:deep(.multiselect),
:deep(.multiselect-wrapper),
:deep(.multiselect-tags),
:deep(.multiselect-single-label),
:deep(.multiselect-search) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}


:deep(.multiselect-input) {
  padding: 0 !important;
  margin: 0 !important;
  height: 0 !important;
  line-height: 1 !important;
}

.field-box input:focus {
  outline: none;
}

.field-box:hover {
  box-shadow:0 0 10px rgba(0, 0, 0, 0.1);
}

</style>
