<template>
    <div class="welcome-container">
      <!-- Logo -->
      <img src="../../assets/images/PawfectHome.png" alt="Pawfect Home Logo" class="logo" />
  
      <div class="content">
        <div class="text-section">
          <h1>
            Every pet deserves love, cuddles, and a 
            <span class="highlight">Pawfect Home</span>.
          </h1>
          <button class="cta-button">Get started</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "WelcomeScreen",
    mounted() {
      document.body.style.overflow = "hidden"; // Disable scrolling
    },
    beforeUnmount() {
      document.body.style.overflow = ""; // Reset when leaving this page
    },
  };
  </script>
  
  <style scoped>
  /* Import Custom Fonts */
  @font-face {
    font-family: "Fredoka One";
    src: url("../../assets/fonts/Fredoka_One1/FredokaOne-Regular.ttf") format("truetype");
  }
  
  @font-face {
    font-family: "Raleway";
    src: url("../../assets/fonts/Raleway/static/Raleway-SemiBold.ttf") format("truetype");
  }
  
  /* Prevent Scrolling */
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevents scrolling */
    height: 100vh;
  }
  
  /* Main container */
  .welcome-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #F7F3EB;
    overflow: hidden;
    padding: 60px;
  }
  
  /* Logo Fix */
  .logo {
    position: absolute;
    top: 100px;
    left: 30px;
    width: 140px;
    height: auto;
    z-index: 1000; /* Ensures it's above everything */
  }
  
  /* Content layout */
  .content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    max-width: 1200px;
    padding-left: 100px;
  }
  
  /* Text Section */
  .text-section {
    max-width: 600px;
    text-align: left;
    border-radius: 10px;
    z-index: 2;
    margin-top: 80px;
  }
  
  /* Apply Fredoka One Font */
  h1 {
    font-size: 48px;
    font-weight: bold;
    color: #222F61;
    font-family: "Fredoka One", sans-serif;
    line-height: 1.2;
  }
  
  /* Highlighted text */
  .highlight {
    color: #222F61;
  }
  
  /* CTA Button */
  .cta-button {
    margin-top: 20px;
    padding: 12px 28px;
    width: 284px;
    height: 67px;
    font-size: 24px;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    background-color: #222F61;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .cta-button:hover {
    background-color: #1A1E30;
  }
  
  /* Background Image Fix (Prevents White Border) */
  .welcome-container::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: url("../../assets/images/welcome/welcome.png") no-repeat right center;
    background-size: cover;
    z-index: 1;
  }
  </style>
  