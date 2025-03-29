<template>
  <div class="onboarding-container">
    <Logo />

    <h1 class="fade-in delay1">Are you a Lister or an Adopter?</h1>
    <div class="buttons fade-in delay2">
      <button class="btn" @click="goToNextPage('lister')">Lister</button>
      <button class="btn" @click="goToNextPage('adopter')">Adopter</button>
    </div>

    <div class="image-container fade-in delay3">
      <img
        src="@/assets/images/onboarding/onboarding1-petsbackground.png"
        alt="Background Shape"
        class="background-image"
      />
      <img
        src="@/assets/images/onboarding/onboarding1-pets.png"
        alt="Pets"
        class="foreground-image"
      />
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../../../firebase/firebase.js";
import Logo from "../../components/Logo.vue";

const db = getFirestore(app);
export default {
  name: "Onboarding1",
  components: {
    Logo,
  },
  methods: {
    async goToNextPage(userType) {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (user) {
        await this.updateUserType(user.uid, userType);

        if (userType === "lister") {
          this.$router.push("/petlisting");
          console.log(user);
        } else {
          this.$router.push("/onboarding-adopters");
        }
      } else {
        console.error("No user is currently logged in");
        // Optionally, redirect to login page
        this.$router.push("/login");
      }
    },
    async updateUserType(userId, userType) {
      try {
        const userDocRef = doc(db, "Users", userId);

        if (userType === "lister") {
          await updateDoc(userDocRef, {
            isPetLister: true,
            hasOnboard: true,
          });
        } else {
          await updateDoc(userDocRef, {
            isPetLister: false,
            hasOnboard: true,
          });
        }

        console.log("User type updated in Firestore");
      } catch (error) {
        console.error("Error updating user type:", error);
      }
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 1s ease-in-out;
  animation-fill-mode: forwards;
}

.fade-in.delay1 {
  animation: fadeIn 1.5s ease-in-out;
}

.fade-in.delay2 {
  animation: fadeIn 2s ease-in-out;
}

.fade-in.delay3 {
  animation: fadeIn 2.5s ease-in-out;
}

.onboarding-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: auto;
}

.logo-container {
  position: absolute;
  top: 18px;
  left: 23px;
}

.logo {
  display: flex;
  align-self: flex-start;
}

h1 {
  font-family: FredokaOne-Regular;
  font-size: 53px;
  color: #222f61;
  text-align: center;
  margin-top: 130px;
}

.buttons {
  display: flex;
  gap: 120px;
  margin-top: 20px;
}

.btn {
  width: 210px;
  height: 58px;
  font-size: 20px;
  color: #222f61;
  background-color: #f7f3eb;
  border: 2px solid #222f61;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  font-family: "Poppins-Bold";
  pointer-events: auto;
  z-index: 10;
}

.btn:hover {
  background-color: #222f61;
  color: white;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  width: 740px;
  height: 500px;
  margin-top: 5px;
}

.background-image {
  width: 130%;
  position: absolute;
  height: 100%;
  top: 6em;
  left: 50%;
  transform: translateX(-50%) rotate(-360deg) translateY(-50px);
  z-index: 1;
}

.foreground-image {
  width: 80%;
  position: absolute;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  z-index: 2;
}
</style>
