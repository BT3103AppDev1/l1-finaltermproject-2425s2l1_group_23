<template>
  <div class="preview-container">
    <div class="preview-box">
      <div class="left-section">
        <img :src="imageSrc" alt="Pet Photo" class="pet-image" />
        <h2 class="preview-title">This is a Preview of {{ pet.petName }}'s Profile!</h2>
        <div class="preview-buttons">
          <button @click="goBack" class="btn secondary">Back</button>
          <button @click="submitToDatabase" class="btn primary">Submit</button>
        </div>
      </div>

      <div class="right-section">
        <h1>My name is ... <span>{{ pet.petName }}</span></h1>
        <p>
          <span>👤</span> {{ pet.dob ? calculateAge(pet.dob) : '' }}<br />
          <span v-if="pet.petGender">
            {{ pet.petGender === 'Male' ? '♂️ Male' : '♀️ Female' }}
          </span><br />
          <strong>Breed:</strong> {{ pet.petBreed }}<br />
          <strong>Pet Type:</strong> {{ pet.petType }}
        </p>

        <div class="section">
          <strong>⭐ Personality</strong>
          <div class="tags">
            <span v-for="trait in pet.petPersonalityTemperament" :key="trait" class="tag">{{ trait }}</span>
          </div>
        </div>

        <div class="section">
          <strong>👥 Socialisation</strong>
          <div class="tags">
            <span v-for="s in pet.petPersonalitySocialisation" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>

        <div class="section">
          <strong>🕺 Lifestyle</strong>
          <div class="tags">
            <span v-if="pet.petLifestyleActivity" class="tag">{{ pet.petLifestyleActivity }}</span>
            <span v-if="pet.petLifestyleTraining" class="tag">{{ pet.petLifestyleTraining }}</span>
          </div>
        </div>

        <div class="section">
          <strong>🩺 Medical Information</strong>
          <p>Weight: <span class="tag">{{ pet.petWeight }} kg</span></p>
          <p>Height: <span class="tag">{{ pet.petHeight }} cm</span></p>
          <p>Vaccination status:</p>
          <div class="tags">
            <span v-for="v in pet.petVax" :key="v" class="tag">{{ v }}</span>
          </div>
        </div>

        <div class="section">
          <strong>🍖 Dietary Preferences & Needs</strong>
          <p>Diet type:</p>
          <div class="tags">
            <span class="tag">{{ pet.petDiet }}</span>
          </div>
          <p>Favourite food or snacks:</p>
          <div class="tags">
            <span v-for="f in pet.petFavFood" :key="f" class="tag">{{ f }}</span>
          </div>
          <p>Allergies:</p>
          <div class="tags">
            <span v-for="a in pet.petAllergies" :key="a" class="tag">{{ a }}</span>
          </div>
        </div>

        <div class="section" v-if="pet.petTriggers && pet.petTriggers.length">
          <strong>🚫 Fears / Triggers</strong>
          <div class="tags">
            <span v-for="t in pet.petTriggers" :key="t" class="tag">{{ t }}</span>
          </div>
        </div>

        <div class="section" v-if="pet.petPrice">
          <strong>💰 Adoption Fee</strong>
          <p><span class="tag">${{ pet.petPrice }}</span></p>
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
  router.push("/addlisting4");
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();

  if (days < 0) months--; // adjust for incomplete month
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
    router.push("/pet-listing");
  } catch (err) {
    console.error("Error submitting pet profile:", err);
    alert("Failed to save pet details.");
  }
}

</script>

<style scoped>
.preview-container {
  padding: 2em;
  display: flex;
  justify-content: center;
  background-color: #fdfaf6;
  min-height: 100vh;
}
.preview-box {
  display: flex;
  gap: 2em;
  max-width: 1000px;
  background: #fdfaf6;
  padding: 2em;
  border-radius: 20px;

}
.left-section {
  text-align: center;
}
.pet-image {
  width: 280px;
  height: auto;
  border-radius: 20px;
  object-fit: cover;
  margin-bottom: 1em;
}
.preview-title {
  font-family: 'FredokaOne-Regular';
  font-size: 24px;
}
.preview-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-top: 1em;
}
.right-section {
  font-family: 'Poppins', sans-serif;
  flex: 1;
}
h1 span {
  font-weight: 600;
  font-size: 1.5em;
}
.section {
  margin-top: 1em;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.5em;
}
.tag {
  background: #dbeafe;
  padding: 0.3em 0.8em;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
  color: #1e3a8a;
}
.btn {
  padding: 0.7em 1.5em;
  font-size: 1em;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}
.primary {
  background-color: #222f61;
  color: white;
}
.secondary {
  background-color: white;
  color: #222f61;
  border: 2px solid #222f61;
}
</style>