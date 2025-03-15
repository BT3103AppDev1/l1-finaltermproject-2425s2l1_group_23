<template>
    <div class = "onboarding-container">
        <div class ="logo-container">
            <img src="@/assets/images/PawfectHome.png" alt="Pawfect Home Logo" class="logo" />
        </div>

        <div class = "text-container">
            <h1>Find Your Perfect Pet Companion!</h1>

            <p> Looking for a furry (or feathery!) friend? We'll help 
            match you with a pet that fits your lifestyle!
            </p>
        </div>
        

        <div class = "image-container"> 
                <img src="@/assets/images/onboarding2-petsbackground.png" alt="Background Shape" class="background-image" />
                <img src="@/assets/images/onboarding2-pets.png" alt="Pets" class="foreground-image" />
        </div>

        <button class="btn" @click="goToNextPage">Continue</button>

    </div>
</template>

<script>
    export default {
        name: "Onboarding2",
        methods: {
            goToNextPage() {
                // change "OnboardingQn" to the path of next onboarding page in index.js
                this.$router.push("/OnboardingQn"); 
            },
        },
    };
</script>

<style scoped>
.onboarding-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  height: 100vh;
  background-color: #f7f3eb;
  position: relative;
  padding-top: 100px;
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
  font-family: "FredokaOne-Regular";
  font-size: 53px;
  color: #000000;
  text-align: center;
  white-space: nowrap;
  width:100%;
  margin-bottom: 15px;

}

p {
  font-family: "Raleway-Bold", sans-serif;
  font-size: 25px;
  color: #222F61;
  width:654px;
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
  bottom:0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.foreground-image {
  width: 170%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.btn {
  width: 166px;
  height: 58px;
  font-family: "Raleway-Bold";
  font-size: 16px;
  font-weight: bold;
  color: #222F61;
  background-color: #F7F3EB;
  border: 2px solid #222F61;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  position:absolute;
  bottom: 100px;
  right:130px;
}

.btn:hover {
  background-color: #222F61;
  color: white;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}


</style>