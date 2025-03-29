<template>
  <div class="preview-container">
    <div class="preview-box">
      <div class="left-section">
        <img :src="imageSrc" alt="Pet Photo" class="pet-image" />
        <h2 class="preview-title">This is a Preview of {{ pet.name }}'s Profile!</h2>
        <div class="preview-buttons">
          <button @click="goBack" class="btn secondary">Back</button>
          <button @click="submitToDatabase" class="btn primary">Submit</button>
        </div>
      </div>

      <div class="right-section">
  <h1>My name is ... <span>{{ pet.name }}</span></h1>
  <p>
    <span>👤</span> {{ pet.dob ? calculateAge(pet.dob) + ' years old' : '' }}<br />
    <span>{{ pet.gender === 'Male' ? '♂️' : '♀️' }}</span><br />
    <strong>Breed:</strong> {{ pet.breed }}<br />
    <strong>Pet Type:</strong> {{ pet.petType }}
  </p>

  <div class="section">
    <strong>⭐ Personality</strong>
    <div class="tags">
      <span v-for="trait in pet.temperament" :key="trait" class="tag">{{ trait }}</span>
    </div>
  </div>

  <div class="section">
    <strong>👥 Socialisation</strong>
    <div class="tags">
      <span v-for="s in pet.socialisation" :key="s" class="tag">{{ s }}</span>
    </div>
  </div>

  <div class="section">
    <strong>🕺 Lifestyle</strong>
    <div class="tags">
      <span v-if="pet.activity" class="tag">{{ pet.activity }}</span>
      <span v-if="pet.training" class="tag">{{ pet.training }}</span>
    </div>
  </div>

  <div class="section">
    <strong>🩺 Medical Information</strong>
    <p>Weight: <span class="tag">{{ pet.weight }} kg</span></p>
    <p>Height: <span class="tag">{{ pet.height }} cm</span></p>
    <p>Vaccination status:</p>
    <div class="tags">
      <span v-for="v in pet.vaccinations" :key="v" class="tag">{{ v }}</span>
    </div>
  </div>

  <div class="section">
    <strong>🍖 Dietary Preferences & Needs</strong>
    <p>Diet type:</p>
    <div class="tags">
      <span v-for="d in pet.diet" :key="d" class="tag">{{ d }}</span>
    </div>
    <p>Favourite food or snacks:</p>
    <div class="tags">
      <span v-for="f in pet.favFood" :key="f" class="tag">{{ f }}</span>
    </div>
    <p>Allergies:</p>
    <div class="tags">
      <span v-for="a in pet.allergies" :key="a" class="tag">{{ a }}</span>
    </div>
  </div>

  <div class="section" v-if="pet.triggers && pet.triggers.length">
    <strong>🚫 Fears / Triggers</strong>
    <div class="tags">
      <span v-for="t in pet.triggers" :key="t" class="tag">{{ t }}</span>
    </div>
  </div>

  <div class="section" v-if="pet.price">
    <strong>💰 Adoption Fee</strong>
    <p><span class="tag">${{ pet.price }}</span></p>
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
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function submitToDatabase() {
  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in.");
    return;
  }

  try {
    await addDoc(collection(db, "Pet_Listings"), {
      ...pet.value,
      userID: user.uid,
      createdAt: serverTimestamp()
    });

    alert("Pet profile submitted successfully!");
    localStorage.removeItem("petType");
    localStorage.removeItem("petBasicsInfo");
    localStorage.removeItem("petLifestyleInfo");
    localStorage.removeItem("fullPetListingData");
    router.push("/lister-home");
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
  background: white;
  padding: 2em;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
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
