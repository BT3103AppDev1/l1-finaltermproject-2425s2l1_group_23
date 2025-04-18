<template>
  <div class="header">
    <Logo />
    <button class="user-login-button" @click="goToLogin">User Login</button>
  </div>

  <div class="content">
    <div class="details">
      <h1 class="heading">Where Compassion Meets Action</h1>
      <p class="subtitle">Welcome back Admin! Please login to your account.</p>

      <div class="form">
        <div class="input-container-email">
          <label class="input-label" for="email">Admin Email address</label>
          <input
            class="input-field"
            type="email"
            id="email"
            v-model="email"
            placeholder="pawfecthome@pawmail.com"
          />
        </div>
        <div class="input-container-password">
          <label class="input-label" for="password">Password</label>
          <input
            class="input-field"
            type="password"
            id="password"
            v-model="password"
            placeholder="Password"
          />
        </div>
      </div>
      <p><button class="forgot-password">Forgot password</button></p>
      <div class="buttons">
        <p><button class="login-button" @click="login">Login</button></p>
      </div>
    </div>
    <img
      src="../../assets/images/admin-login/admin-dog.png"
      alt="Dog"
      class="img"
    />
  </div>
</template>
<script setup>
import { app } from "../../../firebase/firebase.js";
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import Logo from "../../components/Logo.vue";

const email = ref("");
const password = ref("");

const router = useRouter();

const goToNextPage = (isPetLister) => {
  if (isPetLister) {
    router.push("/admin-page");
  } else {
    router.push("/home");
  }
};

const login = async () => {
  try {
    const auth = getAuth(app);
    console.log("auth: " + auth);
    console.log("email.value & password.value ", email.value, password.value);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    console.log("Successfully logged in", userCredential);

    const db = getFirestore(app);
    console.log("user.uid ", user.uid);
    const userDocRef = doc(db, "Admin", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      //const userData = userDoc.data();
      //const isPetLister = userData.isPetLister; // erase
      goToNextPage(true); // goToNextPage
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error logging in", error);
    alert("Error logging in: Incorrect email or password");
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
@import url("../../assets/styles/font.css");

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100wh;
  gap: 50px;
}
.details {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.heading {
  font-family: "FredokaOne-Regular";
  color: #222f61;
  height: 110px;
  width: 382px;
  text-align: center;
  margin-bottom: 34px;
  font-size: 40px;
}

.heading-container {
  flex-direction: column;
  display: flex;
  margin: 0;
}

.subtitle {
  font-family: "Raleway-SemiBold";
  font-size: 15px;
  color: #7f7e83;
  margin-top: -20px;
  margin-bottom: 40px;
}

.login-button,
.signup-button {
  font-family: "Raleway-Bold";
  font-size: 16px;
  width: 144px;
  height: 50px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.login-button:hover,
.signup-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.forgot-password {
  font-family: "Raleway-Medium";
  font-size: 14px;
  color: #7f7e83;
  border-width: 0px;
  text-decoration: underline;
  cursor: pointer;
  padding-left: 300px;
  background-color: rgba(255, 255, 255, 0);
}

.login-button {
  background-color: #222f61;
  font-family: "Raleway-Bold";
  font-size: 14px;
  color: #f7f3eb;
  border-width: 0px;
}

.signup-button {
  border: 1px solid #222f61;
  font-family: "Raleway-Bold";
  font-size: 14px;
  color: #222f61;
}

.buttons {
  display: flex;
  gap: 20px;
}

.input-container-email:focus-within,
.input-container-password:focus-within {
  border-left: 5px solid #222f61;
}

.input-container-email {
  flex-direction: column;
  display: flex;
  height: 70px;
  width: 380px;
  background-color: #ffffff;
  padding-left: 20px;
  padding-top: 15px;
  border: 0.5px solid black;
  box-sizing: border-box;
}

.input-container-password {
  flex-direction: column;
  display: flex;
  height: 70px;
  width: 380px;
  background-color: #ffffff;
  padding-left: 20px;
  padding-top: 15px;
  border-left: 0.5px solid black;
  border-right: 0.5px solid black;
  border-bottom: 0.5px solid black;
  box-sizing: border-box;
}

.input-label {
  font-family: "Raleway-Medium";
  font-size: 15px;
  color: #000000;
}

.input-field {
  font-family: "Raleway-Medium";
  font-size: 15px;
  color: #222f61;
  height: 59px;
  border-width: 0px;
  outline: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: auto;
}

.admin-login-button {
  font-family: "Raleway-Bold";
  font-size: 14px;
  color: #222f61;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-login-button:hover {
  transform: scale(1.1);
}

.user-login-button {
  font-family: "Raleway-Bold";
  font-size: 14px;
  color: #ffffff;
  background-color: #222f61;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  justify-self: flex-end;
  display: flex;
  padding: 1em 2em;
  margin-right: 2em;
  border-radius: 2em;
}

.admin-login-button:hover {
  transform: scale(1.1);
  background-color: #3b4a89;
}
</style>
