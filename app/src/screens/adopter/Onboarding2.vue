<template>
  <div class="overall">
    <Logo />
    <div class="onboarding-section">
      <div class="onboarding-container">
  
        <div class="text-container fade-in-left">
          <h1>Find Your Perfect Pet Companion!</h1>

          <p>
            Looking for a furry (or feathery!) friend? We'll help match you with a
            pet that fits your lifestyle!
          </p>
        </div>

        <div class="image-container">
          <img
            src="@/assets/images/onboarding/onboarding2-PetsImage.png"
            alt="Pets"
            class="image"
          />
        </div>

        <button class="btn fade-in-left delay-2" @click="goToNextPage">
          Continue
        </button>
      </div>
    </div>
    

  </div>
  
</template>

<script>
import Logo from "../../components/Logo.vue";

export default {
  name: "Onboarding2",
  components: {
    Logo,
  },
  methods: {
    goToNextPage() {
      this.$router.push("/onboarding-questions");
    },
  },
};
</script>

<style scoped>
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.overall {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

.fade-in-left {
  animation: fadeInLeft 1s ease-in-out;
  animation-fill-mode: forwards;
}

.delay-1 {
  animation: fadeInLeft 1.5s ease-in-out;
}

.delay-2 {
  animation: fadeInLeft 2s ease-in-out;
}

.onboarding-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: auto;
  background-color: #f7f3eb;
}

.onboarding-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;
}

.text-container {
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}


h1 {
  font-family: FredokaOne-Regular;
  font-size: 53px;
  color: #000000;
  text-align: center;
  width: 85%;
  margin-bottom: 15px;
}

p {
  font-family: Raleway-Bold;
  font-size: 25px;
  color: #222f61;
  width: 654px;
  text-align: left;
  width: 80%
}

.image-container {
  margin-top: -20em;
}

.image {
  width: 50em;
  height: auto;
}

.btn {
  width: 166px;
  height: 58px;
  font-family: Raleway-Bold;
  font-size: 16px;
  font-weight: bold;
  color: #222f61;
  background-color: #f7f3eb;
  border: 2px solid #222f61;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  margin-top: -8em;
  margin-left: 60em;

  
}
.btn:hover {
  background-color: #222f61;
  color: white;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .btn {
    margin-top: 5em;
    margin-left: 0em;
  }

  h1 {
    font-size: 3em;
    display: flex;
    flex-wrap: wrap;
    word-wrap: break-word;
    width: 90%
  }

  p {
    display: flex;
    flex-wrap: wrap;
    word-wrap: break-word;
    width: 90%;
    text-align: center
  }

  .text-container {
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
}
</style>
