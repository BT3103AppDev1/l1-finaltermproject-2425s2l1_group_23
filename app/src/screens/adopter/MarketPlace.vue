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
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { db } from '../../../firebase/firebase.js';
  import { collection, getDocs } from 'firebase/firestore';
  import Listing from '../../components/Listing.vue';
  import MarketPlaceHeader from './MarketPlaceHeader.vue';
  
  export default {
    components: { Listing, MarketPlaceHeader },
    setup() {
      const pets = ref([]);
      const searchQuery = ref("");
  
      const fetchPets = async () => {
        try {
          // Fetch all users
          const usersSnapshot = await getDocs(collection(db, "Users"));
          const usersMap = {};
  
          usersSnapshot.docs.forEach(doc => {
            const userData = doc.data();
            const userId = doc.id; // Match document ID
  
            // usersMap is a dictionary where the key is the user ID
            // and the value is an object with the owner's name and image
            usersMap[userId] = {
              owner: `${userData.firstName} ${userData.lastName}`,
              ownerImage: userData.profileImage || "https://placekitten.com/50/50",
            };
          });
  
          console.log("Users Map:", usersMap); // Debugging: Check user data storage
  
          // Fetch all pets
          const petQuerySnapshot = await getDocs(collection(db, "Pet_Listings"));
          pets.value = petQuerySnapshot.docs.map(doc => {
            const petData = doc.data();
            const userId = petData.userID; // Use userID from pet listings
  
            console.log("Pet Data:", petData); // Debugging: Check pet data
  
            const ownerData = usersMap[userId] || {
              owner: "Unknown",
              ownerImage: "https://placekitten.com/50/50",
            };
  
            return {
              id: doc.id,
              owner: ownerData.owner,
              ownerImage: ownerData.ownerImage,
              petImage: 'https://i.pinimg.com/564x/7f/26/e7/7f26e71b2c84e6b16d4f6d3fd8a58bca.jpg',
              petName: petData.petName || "Unknown",
              petAge: petData.petAge || "N/A",
              petPrice: petData.petPrice || 0,
              numTreats: petData.numTreats || 0,
              timeAgo: "30 mins ago", // Placeholder for now
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
  .marketplace-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 150px;
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
  }
  </style>