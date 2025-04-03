<template>
  <div class="layout">
    <div class="sidebar">
      <ListersNavBar />
    </div>

    <div class="content">
      <div class="header">
        <h2>Welcome, {{ userName }}!</h2>
        <button class="add-btn">Add a new listing ➕</button>
      </div>

      <div class="subheader">
        <h1>Your Pets, Your Listings</h1>
        <p>Find the Perfect Home for Your Pet</p>
      </div>

      <div class="listings-wrapper">
        <ListersListing
          v-for="pet in listings"
          :key="pet.id"
          :pet="pet"
          @delete-listing="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getDoc, doc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
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
  },
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
</style>
