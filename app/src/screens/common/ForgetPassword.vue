<template>
  <div>
    <Logo />
    <div class="content">
      <div class="details">
        <h1 class="heading">Forgot your password</h1>
        <p class="subtitle">Enter your registered email address, and we’ll send you a link to reset your password.</p>
  
        <div class="form">
          <div class="input-container-email">
            <label class="input-label" for="email">Email address</label>
            <input
              class="input-field"
              type="email"
              id="email"
              v-model="email"
              placeholder="pawfecthome@pawmail.com"
            />
          </div>
          
        </div>
        <div class="buttons">
          <p><button class="reset-button" @click="() => {resetPassword(); goToNextPage()}">Get reset link</button></p>
        </div>
      </div>
      <img src="../../assets/images/forgetPassword/ConfusedCat.png" alt="Confused Cat" class="img" />
    </div>
  </div>
</template>

  <script setup>
  import { ref } from "vue";
  import { getFirestore } from "firebase/firestore";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { useRouter } from "vue-router";
  import Logo from "@/components/Logo.vue"
  
  const email = ref("");
  
  const router = useRouter();
  
  const goToNextPage = () => {
    router.push("/login")
  };
  
  const resetPassword = async () => {
    try {
    const db = getFirestore();
    const usersRef = collection(db, "Users"); // Adjust collection name if needed
    const q = query(usersRef, where("email", "==", email.value));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("This email is not registered. Please check your email address.");
      router.push("/signup")
      return;
    }

    // If email exists, proceed with password reset
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    alert("Check your inbox for a password reset email. If you don’t see it, check your spam folder.");
  } catch (error) {
    console.error("Error sending reset email:", error);
    alert("Error: " + error.message);
  }
};
  </script>
  
  <style scoped>
  @import url("../../assets/styles/font.css");
  
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 8em;
    height: 90vh;
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
    width: 25em;
    text-align: center;
  }
  
  .reset-button {
    font-family: "Raleway-Bold";
    font-size: 16px;
    width: 144px;
    height: 50px;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  
  .reset-button:hover {
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
  
  .reset-button {
    background-color: #222f61;
    font-family: "Raleway-Bold";
    font-size: 14px;
    color: #f7f3eb;
    border-width: 0px;
  }
  
  .input-container-email:focus-within {
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

  .img {
    width: 34em;
    height: auto;
  }

  @media (max-width: 1024px) {
    .content {
      display: flex;
      flex-direction: column;
      height: auto;
    }
  }
  </style>
  