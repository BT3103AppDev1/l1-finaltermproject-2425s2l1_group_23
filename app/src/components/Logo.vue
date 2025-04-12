<template>
  <div class="logo-container">
    <img
      src="@/assets/images/PawfectHome-Logo.png"
      alt="Pawfect Home Logo"
      class="logo"
    />
    <p class="logo-text">Pawfect Home</p>
  </div>
</template>

<script>
export default {
  name: "Logo",
};
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  margin: 0.5em 0.5em;
}
.logo {
  width: 3em;
  height: 3em;
}
.logo-text {
  font-family: Poppins-Bold;
  color: #222f61;
  font-size: 16px;
  margin: 0 0 0 0.2em;
}
</style>
