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
    </div>
  </div>
</template>

<script>
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebase.js";
import ListersNavBar from "@/components/ListersNavBar.vue";

export default {
  name: "PetListing",
  components: {
    ListersNavBar,
  },
  data() {
    return {
      userName: "",
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const userDocRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        this.userName = `${userData.firstName} ${userData.lastName}`;
      } else {
        console.error("No such user document!");
      }
    } else {
      console.error("No user logged in");
    }
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background-color: #f7f3eb;
}

.sidebar {
  width: 5rem; /* Set your ListersNavBar width here */
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
  font-size: 1.8rem;
  color: #000;
}

.add-btn {
  background-color: #bca5de;
  color: white;
  font-family: Raleway-Medium;
  font-size: 0.9rem;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.subheader h1 {
  font-family: FredokaOne-Regular;
  font-size: 2rem;
  color: #222f61;
  margin: 0;
}

.subheader p {
  font-family: Raleway-Medium;
  font-size: 1rem;
  color: #838694;
  margin-top: 0.3rem;
}
</style>
