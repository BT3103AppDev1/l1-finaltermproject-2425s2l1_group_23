<template>
  <div class="marketplace-container">
    <!-- Header Section (Logo + Welcome Message) -->
    <header class="header">
      <div class="header-content">
        <img
          class="logo"
          src="../../assets/images/PawfectHome-Logo.png"
          alt="Logo"
        />
        <h1>Welcome, Ming Han!</h1>

      </div>
      <button class="email-button"><img class="icon" src="@/assets/images/marketplaceHeader/emailIcon.png" alt="Email Icon" /></button>
    </header>

    <!-- Search Bar (Now Properly Centered) -->
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
      <h1> What kind of pet are you looking for? </h1>
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
      <h1> Our cutest additions... </h1>
    </div>

    <!-- Pet Listings -->
    <section class="pet-list">
      <Listing v-for="pet in filteredPets" :key="pet.id" :pet="pet" />
    </section>
  </div>
</template>

<script>
import CategoryCard from "@/components/CategoryCard.vue";

export default {
  components: {
    CategoryCard,
  },
  data() {
    return {
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
  methods: {
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
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  justify-content: flex-start;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.header h1 { 
  font-family: "FredokaOne-Regular";
  font-size: 24px;
}

.icon {
  width: 2.5em;
  height: 2.5em;
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

.email-button {
  background-color: rgba(0,0,0,0);
  border-width: 0em;
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
