<template>
    <div class="category-container" @click="selectCategory">
      <!-- Emoji Box -->
      <div class="emoji-box" :class="{ active: isActive }">
        <span class="emoji">{{ emoji }}</span>
      </div>
  
      <!-- Category Name Box -->
      <div class="category-name-box">
        <p class="category-name">{{ name }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      name: String,
      emoji: String,
      isActive: Boolean
    },
    methods: {
      selectCategory() {
        console.log("category:" + this.name);
        this.$emit("filter-category", this.name);
      }
    }
  };
  </script>
  
  <style scoped>
  @import url("../assets/styles/font.css");
  /* Outer box that holds both sections */
  .category-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    cursor: pointer;
  }

  .emoji-box:hover {
    background: #a7bde9;
    transform: scale(1.05);
    transition: 0.3s ease-in-out;
  }
  
  /* Top box for emoji */
  .emoji-box {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c4ccdc; /* Adjust color as per design */
    width: 120px;
    height: 120px;
    border-radius: 20px;
  }
  
  /* Emoji inside the top box */
  .emoji {
    font-size: 60px;
  }
  
  /* Bottom box for category name */
  .category-name-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -10px;
    width: 100%;
  }
  
  /* Category Name */
  .category-name {
    font-family: "Raleway-Bold";
    font-size: 20px;
    color: #222F61;
  }

  .emoji-box.active {
    background: #667aad; /* Darker or branded shade */
  } 
  </style>
  