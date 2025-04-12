<template>
  <div class="layout">
    <div class="navbar">
      <AdoptersNavBar />
    </div>
    <div class="marketplace-full">
      <!-- COMBINE header and listings under one scrollable container -->
      <div class="marketplace-scroll-area">
        <MarketPlaceHeader
          :userName="userName"
          @search="handleSearch"
          @filter-category="handleCategoryFilter"
        />
        <section class="pet-list">
          <div
            v-for="pet in filteredPets"
            :key="pet.petListingId"
            class="listing-link"
          >
            <Listing :pet="pet" @click="goToPetProfile(pet.petListingId)" />
          </div>
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
  import { useRouter } from 'vue-router';
  import { getAuth } from 'firebase/auth';
  import AdoptersNavBar from '../../components/AdoptersNavBar.vue';

  
  export default {
    components: { Listing, MarketPlaceHeader, AdoptersNavBar },
    setup() {

      const router = useRouter();
      const pets = ref([]);
      const searchQuery = ref("");
      const userName = ref("Guest");

      const fetchUserName = async () => {
        const auth = getAuth();
        if (auth.currentUser) {
          const userId = auth.currentUser.uid; // Get the logged-in user's UID
          try {
            const userDocRef = doc(db, "Users", userId); // Reference to the user's document
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              userName.value = userData.firstName || "Guest"; // Set the user's first name
            } else {
              console.error("No such user document in Firestore");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          console.error("No user is currently logged in.");
        }
      };

      const goToPetProfile = (petListingId) => {
        localStorage.setItem('currentPetId', petListingId); // Store petListingId in localStorage
        router.push({ name: "PetProfile" }); // Navigate to PetProfile
      };
  
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
              ownerImage: userData.profileImage,
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
              petListingId: doc.id,
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
  
      onMounted(() => {
        fetchUserName(); // Fetch the logged-in user's first name
        fetchPets(); // Fetch the pets
    });
  
      const filteredPets = computed(() => {
        return pets.value.filter(pet =>
          pet.petName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
  
      return { pets, searchQuery, filteredPets, goToPetProfile };
    },
  };
  </script>
  
  <style scoped>
  .layout {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background-color: #f7f3eb;
    width: 100%;
    height: 100vh;
  }

  .navbar {
    padding-right: 5em;
    flex-shrink: 0;
  }

  .marketplace-full {
    flex-grow: 1;
    flex-direction: column;
    display: flex;
    overflow-y: auto; /* Enable scrolling */
    padding: 0em 2em;
  }

.marketplace-scroll-area {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.pet-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 20px;
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

  .listing-link {
    text-decoration: none;
    color: inherit;
  }

  .pet-list .listing {
    cursor: pointer;
  }
  </style>