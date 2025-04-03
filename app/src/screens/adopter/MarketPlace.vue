<template>
  <div class="layout">
    <AdoptersNavBar />

    <div class="marketplace-main">
      <MarketPlaceHeader
        :userName="'MingHan'"
        @search="handleSearch"
        @filter-category="handleCategoryFilter"
      />

      <div class="marketplace-container">
        <section class="pet-list">
          <Listing v-for="pet in filteredPets" :key="pet.id" :pet="pet" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { db } from '../../../firebase/firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import Listing from '../../components/Listing.vue';
import MarketPlaceHeader from './MarketPlaceHeader.vue';
import AdoptersNavBar from '../../components/AdoptersNavBar.vue';

export default {
  components: { Listing, MarketPlaceHeader, AdoptersNavBar },
  setup() {
    const pets = ref([]);
    const searchQuery = ref("");

    const fetchPets = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const usersMap = {};

        usersSnapshot.docs.forEach(doc => {
          const userData = doc.data();
          const userId = doc.id;

          usersMap[userId] = {
            owner: `${userData.firstName} ${userData.lastName}`,
            ownerImage: userData.profileImage || "https://placekitten.com/50/50",
          };
        });

        const petQuerySnapshot = await getDocs(collection(db, "Pet_Listings"));
        pets.value = petQuerySnapshot.docs.map(doc => {
          const petData = doc.data();
          const userId = petData.userID;

          const ownerData = usersMap[userId] || {
            owner: "Unknown",
            ownerImage: "https://placekitten.com/50/50",
          };

          return {
            id: doc.id,
            owner: ownerData.owner,
            ownerImage: ownerData.ownerImage,
            petPhotoBase64: petData.petPhotoBase64 || null, // Important field
            petName: petData.petName || "Unknown",
            petAge: petData.petAge || "N/A",
            petPrice: petData.petPrice || 0,
            numTreats: petData.numTreats || 0,
            timeAgo: "30 mins ago",
          };
        });
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    onMounted(fetchPets);

    const filteredPets = computed(() => {
      return pets.value.filter(pet =>
        pet.petName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    return { pets, searchQuery, filteredPets };
  },
};
</script>

<style scoped>
.layout {
  display: flex;
}

.marketplace-main {
  margin-left: 80px;
  width: 100%;
}

.marketplace-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f7f3eb;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
}

h1 {
  font-family: FredokaOne-Regular;
  font-size: 2.5em;
  color: #222f61;
}

.search-bar {
  margin: 20px 0;
}

.search-bar input {
  width: 300px;
  padding: 10px;
  font-size: 1em;
  border: 2px solid #222f61;
  border-radius: 5px;
}

.pet-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-left: 50px;
}
</style>
