<template>
  <img
    src="@/assets/images/PawfectHome.png"
    alt="Pawfect Home Logo"
    class="logo"
  />
  <div class="onboarding-container">
    <div class="logo-container"></div>

    <div class="text-container fade-in-left">
      <h1>Find Your Perfect Pet Companion!</h1>

      <p>
        Looking for a furry (or feathery!) friend? We'll help match you with a
        pet that fits your lifestyle!
      </p>
    </div>

    <div class="image-container">
      <img
        src="@/assets/images/onboarding/onboarding2-petsbackground.png"
        alt="Background Shape"
        class="background-image"
      />
      <img
        src="@/assets/images/onboarding/onboarding2-pets.png"
        alt="Pets"
        class="foreground-image"
      />
    </div>

    <button class="btn fade-in-left delay-2" @click="goToNextPage">
      Continue
    </button>
  </div>
</template>

<script>
export default {
  name: "Onboarding2",
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
  text-align: center;
  height: auto;
  background-color: #f7f3eb;
  position: relative;
}

.logo-container {
  position: absolute;
  top: 18px;
  left: 23px;
}

.logo {
  width: 169px;
  height: 50px;
}

h1 {
  font-family: FredokaOne-Regular;
  font-size: 53px;
  color: #000000;
  text-align: center;
  white-space: nowrap;
  width: 100%;
  margin-bottom: 15px;
}

p {
  font-family: Raleway-Bold;
  font-size: 25px;
  color: #222f61;
  width: 654px;
  text-align: left;
}

.image-container {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: auto;
}

.background-image {
  width: 200%;
  position: absolute;
  top: 1em;
  left: 50%;
  transform: translateX(-50%);
}

.foreground-image {
  width: 170%;
  position: absolute;
  top: 9.2em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
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
  position: absolute;
  top: 52em;
  right: 5em;
}

.btn:hover {
  background-color: #222f61;
  color: white;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
