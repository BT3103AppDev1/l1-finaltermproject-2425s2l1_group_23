<template>
    <div class = "onboarding-container">
        <div class ="logo-container">
            <img src="@/assets/images/PawfectHome.png" alt="Pawfect Home Logo" class="logo" />
        </div>
        
        <h1> Are you a Lister or an Adopter?</h1>
        <div class = "buttons">
            <button class = "btn" @click = "goToNextPage('lister')">Lister</button>
            <button class = "btn" @click = "goToNextPage('adopter')">Adopter</button>
        </div>

        <div class = "image-container"> 
            <img src="@/assets/images/onboarding1-petsbackground.png" alt="Background Shape" class="background-image" />
            <img src="@/assets/images/onboarding1-pets.png" alt="Pets" class="foreground-image" />
        </div>

    </div>
</template>

<script>
    export default {
        name: "Onboarding1",
        methods: {
            goToNextPage(userType) {
                if (userType === "lister") {
                    //change "petlisting" to name of petlisting page
                    this.$router.push("/petlisting");
                } else {
                    this.$router.push("/onboarding2");
                }
            },
        },
    };
</script>

<style scoped>
.onboarding-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
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
  font-family: "FredokaOne-Regular", sans-serif;
  font-size: 53px;
  color: #222F61;
  text-align: center;
  margin-top:130px;

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
  color: #222F61;
  background-color: #F7F3EB;
  border: 2px solid #222F61;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  font-family: "Poppins-Bold";
  pointer-events: auto;
  z-index: 10;
}

.btn:hover {
  background-color: #222F61;
  color: white;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  width: 740px; 
  height: 740px;
  margin-top: 20px;
}

.background-image {
  width: 150%;
  position: absolute;
  top: -30px; 
  left: 50%;
  transform: translateX(-50%) rotate(-360deg) translateY(-40px); 
  z-index: 1; 
}

.foreground-image {
  width: 80%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

}

</style>