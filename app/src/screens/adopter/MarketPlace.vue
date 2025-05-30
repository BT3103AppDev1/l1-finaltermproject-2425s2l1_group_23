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
import { ref, onMounted, computed } from "vue";
import { db } from "../../../firebase/firebase.js";
import { collection, getDocs, doc } from "firebase/firestore";
import Listing from "../../components/Listing.vue";
import MarketPlaceHeader from "./MarketPlaceHeader.vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import AdoptersNavBar from "../../components/AdoptersNavBar.vue";
import listerDefaultImage from "@/assets/images/ListerDefault.png";
import petDefaultImage from "@/assets/images/PetListingDefault.png";
import { formatTimeAgo } from "../../utils/timeAgo";

export default {
  components: { Listing, MarketPlaceHeader, AdoptersNavBar }, // registers the imported components for use in template
  setup() {
    // initializes component's logic
    const router = useRouter();
    const pets = ref([]);
    const searchQuery = ref("");
    const selectedCategory = ref("All");

    const goToPetProfile = (petListingId) => {
      console.log(petListingId);
      localStorage.setItem("previousPage", "MarketPlace");
      localStorage.setItem("currentPetId", petListingId); // Store petListingId in localStorage
      router.push({ name: "PetProfile" }); // Navigate to PetProfile
    };

    const fetchPets = async () => {
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const usersMap = {};

        usersSnapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const userId = doc.id; // Match document ID

          // usersMap is a dictionary where the key is the user ID
          // and the value is an object with the owner's name and image
          usersMap[userId] = {
            owner: `${userData.firstName} ${userData.lastName}`,
            ownerImage: userData.profileImage || listerDefaultImage,
          };
        });

        console.log("Users Map:", usersMap); // Debugging: Check user data storage

        // Fetch all pets
        const petQuerySnapshot = await getDocs(collection(db, "Pet_Listings"));
        pets.value = petQuerySnapshot.docs.map((doc) => {
          const petData = doc.data();
          const userId = petData.userID;

          const ownerData = usersMap[userId];

          return {
            petListingId: doc.id,
            owner: ownerData.owner,
            ownerImage: ownerData.ownerImage,
            petImage: petData.petPhotoBase64
              ? `data:image/png;base64,${petData.petPhotoBase64}`
              : petDefaultImage,
            petName: petData.petName || "Unknown",
            petAge: petData.petAge || "N/A",
            petPrice: petData.petPrice || 0,
            numTreats: petData.numTreats || 0,
            timeAgo: petData.createdAt
              ? formatTimeAgo(petData.createdAt)
              : "Some time ago",
            petType: petData.petType,
            userId: userId,
          };
        });
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    onMounted(() => {
      fetchPets(); // Fetch the pets
    });

    const handleCategoryFilter = (category) => {
      selectedCategory.value = category;
      console.log("Category received in parent:", category);
    };

    const filteredPets = computed(() => {
      return pets.value.filter((pet) => {
        const matchesName = pet.petName
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());

        const matchesCategory =
          selectedCategory.value === "All" ||
          (pet.petType &&
            pet.petType.toLowerCase() === selectedCategory.value.toLowerCase());

        return matchesName && matchesCategory;
      });
    });

    return {
      pets,
      searchQuery,
      filteredPets,
      goToPetProfile,
      handleCategoryFilter,
    };
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
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
