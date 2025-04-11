<template>
    <div class="logo-container">
      <img
        src="@/assets/images/PawfectHome-Logo.png"
        alt="Pawfect Home Logo"
        class="logo"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "SimpleLogo",
  };
  </script>
  
  <style scoped>
  .logo-container {
    display: flex;
    align-items: center;
    margin: 0.5em 0.5em;
  }
  .logo {
    width: 4.5em;
    height: 4.5em;
  }
  </style>
  