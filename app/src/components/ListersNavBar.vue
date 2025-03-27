<template>
    <nav class="listers-navbar">
      <img src="@/assets/images/navbar/home.png" alt="Home" class="icon" />
      <img src="@/assets/images/navbar/chat.png" alt="Chat" class="icon" />
      <img src="@/assets/images/navbar/edit.png" alt="Edit" class="icon" />
      <div class="spacer"></div>
      <img src="@/assets/images/navbar/logout-icon.png" alt="Logout" class="icon" />
    </nav>
  </template>
  
  <script>
  export default {
    name: "ListersNavBar",
  };
  </script>
  
  <style scoped>
  .listers-navbar {
    width: 80px;
    height: 100vh;
    background-color: #c9d0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optional: subtle shadow */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  
  .icon {
    width: 32px;
    height: 32px;
    margin: 30px 0;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .icon:hover {
    transform: scale(1.1);
  }
  
  .spacer {
    flex-grow: 1;
  }
  </style>
  