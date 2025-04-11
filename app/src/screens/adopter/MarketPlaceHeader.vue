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
        <h1>Welcome, {{ userName }}</h1>

      </div>
      <div class="email">
        <button class="email-button" @click="goToEmails"><img class="icon" src="@/assets/images/marketplaceHeader/emailIcon.png" alt="Email Icon" /></button>
        <span v-if="emailsUnread > 0" class="email-notification">{{ emailsUnread }}</span>
      </div>
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
      emailsUnread: 0,
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
    async fetchUnreadEmails() {
      try {
        const userId = "testing"; // Replace with the actual user ID
        const userDocRef = doc(db, "Users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          this.emailsUnread = userDocSnapshot.data().emailsUnread || 0;
          console.log("Unread emails count:", this.emailsUnread);
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching unread emails:", error);
      }
    },

    searchPets() {
      this.$emit("search", this.searchQuery);
    },
    filterByCategory(category) {
      this.$emit("filter-category", category);
    },
    goToEmails() {
      let userId = 'testing';
      this.$router.push(`/email/${userId}`); // Navigate to the Emails screen
    },
  },

  mounted() {
    this.fetchUnreadEmails();
  }
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
  width: 100%;
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
  cursor: pointer;
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
  border-width: 0px;
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

.email-notification {
    display: flex;
    width: 1em;
    height: 1em;
    align-items: center;
    justify-content: center;
    font-family: 'Raleway-Regular';
    color: white;
    font-size: 0.8em;
    background-color: #e18c8c;
    border-radius: 50%;
    margin-top: -3em;
    margin-left: -0.8em;
}
.email {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
