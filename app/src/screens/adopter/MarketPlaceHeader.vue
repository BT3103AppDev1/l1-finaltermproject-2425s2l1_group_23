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
        placeholder="🔎 Search for your new furry friend..."
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
  gap: 10px;
  width: 100%; /* Make sure the container takes full width */
  max-width: 600px; /* Adjust width as needed */
}

.search-container input {
  flex: 1; /* Makes the input expand to fill the space */
  padding: 12px 16px;
  border-radius: 7px;
  border: 2px solid #222f61;
  font-family: "Raleway-SemiBold";
  font-size: 16px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
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
  transition: 0.3s;
}

.search-container button:hover {
  background-color: #1a1f4f;
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
  justify-content: center; /* Center the categories */
  width: 100%;
  margin-top: 20px;
}

.categories {
  display: flex;
  justify-content: space-between; /* Ensures even spacing from start to end */
  gap: 20px; /* Keeps some spacing between items */
  flex-wrap: nowrap; /* Prevents wrapping */
  width: 100%; /* Ensure it spans the full width */
  max-width: 1200px; /* Adjust to match the container */
  margin: 0 auto; /* Centers the entire row */
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

