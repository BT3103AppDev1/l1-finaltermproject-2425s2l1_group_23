<template>
    <div class="overall">
      <SimpleLogo class="logo" />
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
        <router-link to="/petlisting" class="icon-button">
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
  import SimpleLogo from "@/components/SimpleLogo.vue";

  export default {
    name: "AdoptersNavBar",
    components: {
      SimpleLogo,
    },
  };
  </script>
  
  <style scoped>
  .overall {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
  }

  .adopters-navbar {
    width: 80px;
    height: calc(90vh - 100px);
    background-color: #c9d0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 100px;
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
  