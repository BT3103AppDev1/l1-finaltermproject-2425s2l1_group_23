<template>
  <div class="content">
    <div class="fixed-container">
      
      <img :src="imageSrc" alt="ProfileImage" class="profile-img" />
      <p class="preview-title styled-preview">This is a Preview of 
        <br> {{ pet.petName }}'s Profile!</p>
        <div class="form-buttons">
        <button @click="goBack" class="secondary">Back</button>
        <button @click="submitToDatabase" class="primary">Submit</button>
      </div>
    </div>
   

    <div class="scrollable-container">
      <div class="pet-intro-header">
        <p class="header">My name is...</p>
        <p id="pet-name" class="pet-name">{{ pet.petName }}</p>
      </div>

      <div class="basic-info">
        <div class="age">
          <img src="@/assets/images/PetProfileMockUp/BirthdayIcon.png" alt="BirthdayIcon" class="icon" />
          <p id="pet-age" class="pet-age">{{ pet.dob ? calculateAge(pet.dob) : '' }}</p>
        </div>

        <div class="gender">
          <img src="@/assets/images/PetProfileMockUp/GenderIcon.png" alt="GenderIcon" class="icon" />
          <p id="pet-gender" class="pet-gender">{{ pet.petGender }}</p>
        </div>
      </div>

      <div class="info">
        <div class="subheader">
          <img src="@/assets/images/PetProfileMockUp/BreedIcon.png" alt="BreedIcon" class="icon" />
          <p class="info-header">Breed</p>
        </div>
        <p class="pet-breed">{{ pet.petBreed }}</p>
      </div>

      <div v-if="pet.petPersonalityTemperament?.length || pet.petPersonalitySocialisation?.length" class="info">
        <div class="subheader">
          <img src="@/assets/images/PetProfileMockUp/StarIcon.png" alt="StarIcon" class="icon" />
          <p class="info-header">Personality</p>
        </div>
        <div v-if="pet.petPersonalityTemperament?.length" class="values">
          <p class="subtitle">Temperament</p>
          <p class="value" v-for="(item, index) in pet.petPersonalityTemperament" :key="index">{{ item }}</p>
        </div>
        <div v-if="pet.petPersonalitySocialisation?.length" class="values">
          <p class="subtitle">Socialisation</p>
          <p class="value" v-for="(item, index) in pet.petPersonalitySocialisation" :key="index">{{ item }}</p>
        </div>
      </div>

      <div v-if="pet.petLifestyleActivity || pet.petLifestyleTraining?.length" class="info">
        <div class="subheader">
          <img src="@/assets/images/PetProfileMockUp/BallIcon.png" alt="BallIcon" class="icon" />
          <p class="info-header">Lifestyle</p>
        </div>
        <div v-if="pet.petLifestyleActivity" class="values">
          <p class="subtitle">Activity level</p>
          <p class="value">{{ pet.petLifestyleActivity }}</p>
        </div>
        <div v-if="pet.petLifestyleTraining?.length" class="values">
          <p class="subtitle">Training level</p>
        <span class="value">{{ pet.petLifestyleTraining }}</span> 

        </div>
      </div>

      <div class="info">
        <div class="subheader">
          <img src="@/assets/images/PetProfileMockUp/SyringeIcon.png" alt="SyringeIcon" class="icon" />
          <p class="info-header">Medical Information</p>
        </div>
        <div class="values">
          <p class="subtitle">Weight</p>
          <p class="value">{{ pet.petWeight }} kg</p>
        </div>
        <div class="values">
          <p class="subtitle">Height</p>
          <p class="value">{{ pet.petHeight }} kg</p>
        </div>
        <div v-if="pet.petVax?.length" class="values">
          <p class="subtitle">Vaccination status</p>
          <p class="value" v-for="(item, index) in pet.petVax" :key="index">{{ item }}</p>
        </div>
      </div>

      <div v-if="pet.petDiet?.length || pet.petFavFood?.length || pet.petAllergies?.length" class="info">
        <div class="subheader">
          <img src="@/assets/images/PetProfileMockUp/PetFoodIcon.png" alt="PetFoodIcon" class="icon" />
          <p class="info-header">Dietary Preferences & Needs</p>
        </div>
        <div v-if="pet.petDiet?.length" class="values">
          <p class="subtitle">Diet type</p>
          <span class="value">{{ pet.petDiet }}</span>
         
        </div>
        <div v-if="pet.petFavFood?.length" class="values">
          <p class="subtitle">Favourite food or snacks</p>
          <p class="value" v-for="(item, index) in pet.petFavFood" :key="index">{{ item }}</p>
        </div>
        <div v-if="pet.petAllergies?.length" class="values">
          <p class="subtitle">Allergies</p>
          <p class="value" v-for="(item, index) in pet.petAllergies" :key="index">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../../firebase/firebase';

const pet = ref({});
const router = useRouter();
const db = getFirestore(app);
const auth = getAuth(app);

const imageSrc = ref('');

onMounted(() => {
  const saved = localStorage.getItem("fullPetListingData");
  if (saved) {
    const parsed = JSON.parse(saved);
    pet.value = parsed;
    if (parsed.petPhotoBase64) {
      imageSrc.value = `data:image/jpeg;base64,${parsed.petPhotoBase64}`;
    } else if (parsed.petLicenseBase64) {
      imageSrc.value = `data:image/jpeg;base64,${parsed.petLicenseBase64}`;
    }
  } else {
    alert("No pet data found.");
    router.push("/addlisting4");
  }
});

function goBack() {
  sessionStorage.setItem("cameFromPreview", "true");
  router.push("/addlisting4");
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();

  if (days < 0) months--;
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 1) {
    return `${months} month${months !== 1 ? 's' : ''} old`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} old`;
  }
}

async function submitToDatabase() {
  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const firestorePayload = {
    petName: pet.value.petName,
    petBreed: pet.value.petBreed,
    petGender: pet.value.petGender,
    dob: pet.value.dob,
    petAge: calculateAge(pet.value.dob),
    petWeight: pet.value.petWeight,
    petHeight: pet.value.petHeight,
    petPhotoBase64: pet.value.petPhotoBase64 || "",
    petType: pet.value.petType || "",
    petVax: pet.value.petVax,
    petAllergies: pet.value.petAllergies,
    petDiet: pet.value.petDiet,
    petFavFood: pet.value.petFavFood,
    petLifestyleTraining: pet.value.petLifestyleTraining,
    petLifestyleActivity: pet.value.petLifestyleActivity,
    petPersonalityTemperament: pet.value.petPersonalityTemperament,
    petPersonalitySocialisation: pet.value.petPersonalitySocialisation,
    petTriggers: pet.value.petTriggers,
    petPrice: pet.value.petPrice,
    userID: user.uid,
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "Pet_Listings"), firestorePayload);

    alert("Pet profile submitted successfully!");
    localStorage.removeItem("petType");
    localStorage.removeItem("petBasicsInfo");
    localStorage.removeItem("petLifestyleInfo");
    localStorage.removeItem("fullPetListingData");
    router.push("/petlisting");
  } catch (err) {
    console.error("Error submitting pet profile:", err);
    alert("Failed to save pet details.");
  }
}
</script>


<style scoped>
@import url("../../assets/styles/font.css");

.preview-title {
  font-family: 'FredokaOne-Regular', sans-serif;
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #000;
}

.styled-preview {
  font-size: 1.5em;
  color: #2f2f2f;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.8em;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 5em;
  margin-top: 2em;
}

button {
  margin-top: -3em;
  padding: 0.8em 2em;
  font-weight: bold;
  border: none;
  border-radius: 1.5625em; 
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
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.fixed-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25em;
    margin-top: 3.125em;
    position: fixed;
    height: 100%;
    top: 0;
    left: 10%;

}

.scrollable-container {
    padding: 2em;
    overflow-y: auto; /*for scrolling*/
    flex-grow: 1;
    margin-left: 50%;
    width: 80%;
}



/* if width too small, then pic can become scrollable*/
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
    }

    .fixed-container {
        display: flex;
        flex-direction: column;
        margin-top: 3.125em;
        height: 100%;
        top: 0;
        left: 0;
        position: relative;
        height: auto;
        margin-bottom: 2em;
    }
    .scrollable-container {
        margin-top: -3em;
        padding: 2em;
        overflow-y: auto; /*for scrolling*/
        flex-grow: 1;
        margin-left: 0%;
        
    }
}


.profile-img {
    width: 25em;
    height: 31.25em;
    border-radius: 3.125em;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.btn {
  font-family: 'FredokaOne-Regular', sans-serif;
  font-size: 1em;
  padding: 0.6em 2em;
  border: none;
  border-radius: 1em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-button {
  background-color: white;
  color: #3f3f3f;
  border: 2px solid #3f3f3f;
}

.back-button:hover {
  background-color: #f1f1f1;
  transform: translateY(-2px);
}

.submit-button {
  background-color: #3f3f3f;
  color: white;
}

.submit-button:hover {
  background-color: #555;
  transform: translateY(-2px);
}

.basic-info {
    display: flex;
    gap: 2em;
    margin-top: 1.25em;
}


.header {
    font-family: 'FredokaOne-Regular';
    color: #696969;
    font-size: 2em;
    text-align:left;
}

.pet-name {
    font-family: 'FredokaOne-Regular';
    color: #000000;
    font-size: 3em;
    margin-top: 4em;
}

.pet-intro-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -15.5em;
    margin-bottom: -2em;
}

.age, .gender, .subheader{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;

}

.pet-age, .pet-gender {
    font-family: 'Raleway-SemiBold';
    font-size: 1em;
}

.icon {
    width: 1.5em;
    height: 1.5em;
}

.info-header {
    font-family: 'Raleway-SemiBold';
}

.subheader {
    margin-bottom: -0.75em;
}

.subtitle {
    font-family: 'Raleway-Medium';
    margin: 0em;
    align-self: center;
}

.values {
    display: flex;
    align-items: center;
    gap: 0.5em;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
}


.value {
    background-color: #8C9DE1;
    border-radius: 1.5em;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    font-family: 'Raleway-SemiBold';
    color: #ffffff;
    font-size: 1em;
    margin: 0em;
}

.pet-breed {
    font-family: 'Raleway-Medium';
    margin-left: 2em;
}

.info {
    margin-bottom: 2em;
}


</style>
