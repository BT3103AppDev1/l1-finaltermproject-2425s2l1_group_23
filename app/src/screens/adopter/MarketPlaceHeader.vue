<template>
  <div class="marketplace-container">
    <!-- Header Section (Logo + Welcome Message) -->
    <header class="header">
      <img
        class="logo"
        src="../../assets/images/PawfectHome-Logo.png"
        alt="Logo"
      />
      <h1>Welcome, Ming Han!</h1>
    </header>

    <!-- Search Bar -->
    <div class="search-container">
      <input
        type="text"
        placeholder="Search for your new furry friend..."
        v-model="searchQuery"
      />
      <button @click="searchPets">Search</button>
    </div>

    <div class="div-text"> 
      <h1> What kind of pet are you looking for? </h1>
    </div>

    <!-- Pet Categories -->
    <section class="category-filter">
      <div class="categories">
        <button
          v-for="category in petCategories"
          :key="category.name"
          class="category-btn"
          @click="filterByCategory(category.name)"
        >
          {{ category.emoji }} {{ category.name }}
        </button>
      </div>
      <button class="filter-btn">🔍 Filter</button>
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
export default {
  props: {
    userName: {
      type: String,
      default: "User",
    },
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
  align-items: center;
  padding: 20px;
  background-color: #f7f3eb;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Section (Logo + Welcome) */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 10px 20px;
  justify-content: flex-start;
}

.header h1 { 
  font-family: "FredokaOne-Regular";
  font-size: 24px
}
.logo {
  width: 60px; /* Adjust as needed */
  height: auto;
}

/* Search Bar */
.search-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  margin-top: 15px; /* Separate from header */
}

.search-container input {
  padding: 10px;
  width: 100em;
  border-radius: 5px;
  border: 2px solid #222f61;
}

.div-text { 
  width: 100%;
  align-items: center;
  justify-items: flex-start;
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
  justify-content: space-between;
  width: 100%;
}

.categories {
  display: flex;
  gap: 15px;
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
/* new change! */
</style>

