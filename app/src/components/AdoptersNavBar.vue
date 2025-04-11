<template>
    <div class="overall">
      <img src="@/assets/images/PawfectHome-Logo.png" class="logo">
      <div class="adopters-navbar">
        <!-- Home (MarketPlace.vue) -->
        <router-link to="/home" class="icon-button">
          <img src="@/assets/images/navbar/home.png" alt="Home" class="icon" />
        </router-link>
    
        <!-- Chat  -->
        <router-link to="/chat" class="icon-button">
          <img src="@/assets/images/navbar/chat.png" alt="Chat" class="icon" />
        </router-link>
    
        <!-- PetTreatSummary -->
        <router-link to="/chat" class="icon-button">
          <img src="@/assets/images/navbar/bone.png" alt="Bone" class="icon" />
        </router-link>
    
        <!-- Edit Profile (EditProfile.vue) -->
        <router-link to="/editprofile" class="icon-button">
          <img src="@/assets/images/navbar/edit.png" alt="Edit" class="icon" />
        </router-link>
    
        <div class="spacer"></div>
    
        <!-- Logout (redirect to Login.vue -->
        <router-link to="/login" class="icon-button">
          <img src="@/assets/images/navbar/logout.png" alt="Logout" class="icon" />
        </router-link>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    name: "AdoptersNavBar",
  };
  </script>
  
  <style scoped>
  .overall {
    display: flex;
    align-items: center;
    width: 80px;
    flex-direction: column;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 1000; 
    position: fixed;
  }

  .logo {
    width: 4.5em;
    height: 4.5em;
    display: block;
  }

  .adopters-navbar {
    width: 80px;
    height: calc(95vh - 100px);
    background-color: #c9d0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 100px;
    left: 0;
    border-radius: 20px;

  }
  .router-link-exact-active .icon {
  filter: brightness(1.4); 
        opacity: 1;
}

  .icon-button {
    all: unset;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease;
  }
  
  .icon-button:hover .icon {
    transform: scale(1.1);
  }
  
  .spacer {
    flex-grow: 1;
  }

  </style>
  