<template>
  <div class="marketplace-container">
    <header class="header">
      <h1>Marketplace</h1>
    </header>

    <section class="search-bar">
      <input
        type="text"
        placeholder="Search for pets..."
        v-model="searchQuery"
        @input="searchPets"
      />
    </section>

    <section class="pet-list">
      <div v-for="pet in filteredPets" :key="pet.id" class="pet-card">
        <img :src="pet.image" :alt="pet.name" class="pet-image" />
        <h2>{{ pet.name }}</h2>
        <p>{{ pet.breed }}</p>
        <p>{{ pet.age }} years old</p>
        <button @click="viewPetDetails(pet.id)">View Details</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "MarketPlace",
  data() {
    return {
      searchQuery: "",
      pets: [
        // Sample data
        {
          id: 1,
          name: "Buddy",
          breed: "Golden Retriever",
          age: 3,
          image: "@/assets/images/pets/buddy.jpg",
        },
        {
          id: 2,
          name: "Mittens",
          breed: "Siamese Cat",
          age: 2,
          image: "@/assets/images/pets/mittens.jpg",
        },
        // Add more pets as needed
      ],
    };
  },
  computed: {
    filteredPets() {
      return this.pets.filter((pet) =>
        pet.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    searchPets() {
      // This method is triggered when the user types in the search bar
    },
    viewPetDetails(petId) {
      // Navigate to the pet details page
      this.$router.push({ name: "PetDetails", params: { id: petId } });
    },
  },
};
</script>

<style scoped>
.marketplace-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f7f3eb;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 100px;
  height: auto;
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
  justify-content: center;
}

.pet-card {
  background-color: white;
  border: 2px solid #222f61;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  width: 200px;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
}

.pet-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.pet-card h2 {
  font-family: FredokaOne-Regular;
  font-size: 1.5em;
  color: #222f61;
}

.pet-card p {
  font-family: Raleway-Medium;
  font-size: 1em;
  color: #838694;
}

.pet-card button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1em;
  color: white;
  background-color: #222f61;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pet-card button:hover {
  background-color: #1a1f4a;
}
</style>
