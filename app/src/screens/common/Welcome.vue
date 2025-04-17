<template>
  <div class="layout">
    <Logo />
    <div class="overall">
      <div class="welcome-container">
        <!-- Logo -->
        <div class="content">
          <div class="text-section">
            <h1>Every pet deserves love, cuddles, and a Pawfect Home.</h1>
            <p class="subtitle">Because every goodbye deserves a new beginning — <br> and every hello, a happy heart...</p>
            <button class="cta-button" @click="goToNextPage">Get started</button>
          </div>
        </div>

        <img
          src="../../assets/images/welcome/welcome.png"
          alt="Dog Welcome"
          class="welcome-image"
        />
      </div>
    </div>
  </div>
  
</template>

<script>
import Logo from "../../components/Logo.vue";
export default {
  name: "WelcomeScreen",
  components: {
    Logo,
  },
  methods: {
    goToNextPage() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
@import url("../../assets/styles/font.css");

.layout {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

.overall {
  display: flex;
  flex-direction: column;
  height: 94.5%;
  margin-top: -2em;
}

/* Main container */
.welcome-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  
}

/* Content layout */
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 100%;
  max-width: 100vh;

}

/* Text Section */
.text-section {
  max-width: 60%;
  text-align: left;
  border-radius: 10px;
}

.welcome-image {
  width: 50%;
  height: auto;
  display: flex;

}

h1 {
  font-size: 48px;
  font-weight: bold;
  color: #222f61;
  font-family: FredokaOne-Regular;
  line-height: 1.2;
}

.subtitle {
  font-family: Raleway-Medium;
  font-size: 1.2em;
  width: 25em;
}

/* CTA Button */
.cta-button {
  margin-top: 20px;
  padding: 12px 28px;
  width: 284px;
  height: 67px;
  font-size: 24px;
  font-family: Raleway-Medium;
  font-weight: 600;
  background-color: #222f61;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.3s;
}

.cta-button:hover {
  background-color: #1a1e30;
}

@media (max-width: 1024px) {
  .welcome-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
  }

  .layout {
    overflow: scroll;
    height: 100vh;
    width: 100vw;
  }

  h1 {
    text-align: center;
  }

  .subtitle {
    text-align: center;
    width: 18em;
  }

  .text-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .welcome-image {
    width: 80%;
  }
}
</style>
