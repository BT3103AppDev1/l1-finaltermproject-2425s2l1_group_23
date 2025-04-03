<template>
  <div class="marketplace-container">
    <!-- Header Section (Logo + Welcome Message) -->
    <header class="header">
      <img
        class="logo"
        src="../../assets/images/PawfectHome-Logo.png"
        alt="Logo"
      />
      <h1>Welcome, {{ userName }}!</h1>
    </header>

    <!-- Search Bar -->
    <div class="search-wrapper">
      <div class="search-container">
        <input
          type="text"
          placeholder="🔎 Search for your new furry friend..."
          v-model="searchQuery"
        />
        <button @click="searchPets">Search</button>
      </div>
    </div>

    <div class="div-text">
      <h1>What kind of pet are you looking for?</h1>
    </div>

    <!-- Pet Categories -->
    <section class="category-filter">
      <div class="categories">
        <CategoryCard
          v-for="category in petCategories"
          :key="category.name"
          :name="category.name"
          :emoji="category.emoji"
          @filter-category="filterByCategory"
        />
      </div>
    </section>

    <div class="div-text">
      <h1>Our cutest additions...</h1>
    </div>

    <!-- Pet Listings -->
    <section class="pet-list">
      <Listing v-for="pet in filteredPets" :key="pet.id" :pet="pet" />
    </section>
  </div>
</template>


<script>
import CategoryCard from "@/components/CategoryCard.vue";
import { auth, db } from "../../../firebase/firebase.js";
import { getDoc, doc } from "firebase/firestore";

export default {
  components: {
    CategoryCard,
  },
  data() {
    return {
      userName: "", // dynamically fetched from Firebase
      searchQuery: "",
      petCategories: [
        { name: "Dogs", emoji: "🐶" },
        { name: "Cats", emoji: "🐱" },
        { name: "Hamsters", emoji: "🐹" },
        { name: "Rabbits", emoji: "🐰" },
        { name: "Birds", emoji: "🦜" },
        { name: "Other", emoji: "🐠" },
      ],
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        this.userName = `${data.firstName} ${data.lastName}`;
      } else {
        console.error("User document not found.");
      }
    } else {
      console.error("No user is currently logged in.");
    }
  },
  methods: {
    searchPets() {
      this.$emit("search", this.searchQuery);
    },
    filterByCategory(category) {
      this.$emit("filter-category", category);
    },
  },
};
</script>


<style scoped>
@import url("../../assets/styles/font.css");

/* Main Container */
.marketplace-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Ensures everything is centered */
  padding: 20px;
  background-color: #f7f3eb;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Section (Logo + Welcome) */
.header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-left: -180px;
  gap: 100px;
  padding: 10px 20px;
  justify-content: flex-start;
}

.header h1 { 
  font-family: "FredokaOne-Regular";
  font-size: 24px;
}

.logo {
  width: 60px; /* Adjust as needed */
  height: auto;
}

/* Search Bar Wrapper (To Center the Whole Search Area) */
.search-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}

/* Search Bar */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: -10px;
  gap: 10px;
}

.search-container input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 7px;
  border: 2px solid #222f61;
  font-family: "Raleway-SemiBold";
  font-size: 16px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.search-container input:focus {
  outline: none;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.2);
  border-color: #1a237e;
}

/* Search Button Styling */
.search-container button {
  background-color: #222f61;
  color: white;
  font-family: "Raleway-Bold";
  font-size: 16px;
  border: none;
  border-radius: 7px;
  padding: 12px 24px;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #1a1f4f;
}

/* Section Titles */
.div-text { 
  width: 100%;
  justify-content: flex-start;
  margin-top: 10px;
}

.div-text h1 {
  font-family: "FredokaOne-Regular";
  font-size: 30px;
  margin-top: 20px;
}

/* Pet Categories */
.category-filter {
  display: flex;
  justify-content: center; /* Center the categories */
  width: 100%;
  margin-top: 20px;
}

.categories {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.category-btn {
  background: #d3cff9;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 1.2em;
  cursor: pointer;
}

.filter-btn {
  background: #f8a6b6;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 1em;
  cursor: pointer;
}

/* Pet Listings */
.pet-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: -10px;
}
</style>
