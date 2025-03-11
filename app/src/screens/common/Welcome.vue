<template>
    <div class="welcome-container">
      <div class="text-section">
        <h1>
          Every pet deserves love, cuddles, and a 
          <span class="highlight">Pawfect Home</span>.
        </h1>
        <button class="cta-button">Get started</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "WelcomeScreen",
  };
  </script>
  
  <style scoped>
  /* Main container with background */
  .welcome-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #F7F3EB;
    overflow: hidden;
  }
  
  /* Text section */
  .text-section {
    max-width: 600px;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
    z-index: 2;
  }
  
  h1 {
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }
  
  .highlight {
    color: #2c3e50;
  }
  
  /* CTA Button */
  .cta-button {
    margin-top: 20px;
    padding: 12px 24px;
    font-size: 18px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .cta-button:hover {
    background-color: #1a252f;
  }
  
  /* Background Image */
  .welcome-container::before {
    content: "";
    position: absolute;
    top: 10%;
    right: 0;
    width: 50%;
    height: 100%;
    background: url("../../assets/welcome/welcome.png") no-repeat center;
    background-size: contain;
    z-index: 1;
  }
  </style>
  