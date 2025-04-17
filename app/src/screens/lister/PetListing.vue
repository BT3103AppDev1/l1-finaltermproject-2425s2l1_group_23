<template>
  <div class="layout">
    <div class="sidebar">
      <ListersNavBar />
    </div>

    <div class="content">
      <div class="header">
        <h2>Welcome, {{ userName }}!</h2>
        <button class="add-btn" @click="$router.push({ name: 'AddListing1' })">
          Add a new listing
          <img src="@/assets/images/addlisting/PlusIcon.png" class="plus-icon"/>
        </button>
      </div>

      <div class="subheader">
        <h1>Your Pets, Your Listings</h1>
        <p>Find the Perfect Home for Your Pet</p>
      </div>
      <div class="listings-wrapper">
        <template v-if="listings.length > 0">
          <ListersListing
            v-for="pet in listings"
            :key="pet.id"
            :pet="pet"
            @delete-listing="handleDelete"
          />
        </template>

        <div v-else class="no-listing-message">
          <h3 class="no-listing-message-header">Oh no, it's so empty here! 🐾</h3>
          <p class="no-listing-message-subtitle">You haven't listed any furry friends yet...</p>
          <p class="no-listing-message-subtitle">Let's find some pawsome pets their forever homes!</p>
          <button class="create-listing-button" @click="$router.push({ name: 'AddListing1' })">
            <span class="paw-icon">Add Your First Pet</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDoc, doc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { auth, db } from "../../../firebase/firebase.js";
import ListersNavBar from "@/components/ListersNavBar.vue";
import ListersListing from "@/components/ListersListing.vue";

export default {
  name: "PetListing",
  components: {
    ListersNavBar,
    ListersListing,
  },
  data() {
    return {
      userName: "",
      userId: null,
      listings: [],
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      this.userId = uid;

      const userDocRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        this.userName = `${userData.firstName} ${userData.lastName}`;
      }

      const listingsRef = collection(db, "Pet_Listings");
      const userListingsQuery = query(listingsRef, where("userID", "==", uid));
      const querySnapshot = await getDocs(userListingsQuery);

      this.listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  },
  methods: {
    async handleDelete(petId) {
      await deleteDoc(doc(db, "Pet_Listings", petId));
      this.listings = this.listings.filter((pet) => pet.id !== petId);
    },
    goToAddListing() {
      localStorage.removeItem("petType");
      localStorage.removeItem("petBasicsInfo");
      localStorage.removeItem("petLifestyleInfo");
      localStorage.removeItem("fullPetListingData");
      sessionStorage.removeItem("cameFromPreview");

      this.$router.push("/addlisting1");
    }
  }
};
</script>



<style scoped>
@import url("../../assets/styles/font.css");

.layout {
  display: flex;
  height: 100vh;
  background-color: #f7f3eb;
}

.sidebar {
  width: 5rem;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 2rem 3rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  font-family: FredokaOne-Regular;
  font-size: 1.5rem;
  color: #000;
}

.add-btn {
  background-color: #BAA6D4;
  width: 256px;
  height: 41px;
  color: white;
  font-family: Raleway-Bold;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
}

.add-btn:hover {
  background-color: #c7b6de;
  transform: scale(1.1);
  transition: 0.2s ease-in-out;
}

.subheader h1 {
  font-family: FredokaOne-Regular;
  font-size: 30px;
  color: #222f61;
  margin: 0;
}

.subheader p {
  font-family: Raleway-Medium;
  font-size: 1rem;
  color: #838694;
  margin-top: 0.3rem;
}

.listings-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 2rem;
}

.plus-icon {
  height: 1em;
}

.no-listing-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  justify-self: center;
  width: 100%;
}

.no-listing-message-header {
  font-family: FredokaOne-Regular;
  font-size: 2em;
  color: rgb(56, 55, 55);
  text-align: center;
}

.no-listing-message-subtitle {
  margin-top: -1em;
  font-family: Raleway-Medium;
}

.create-listing-button {
  font-family: "Raleway-Bold";
  font-size: 16px;
  width: 164px;
  height: 50px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.create-listing-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
