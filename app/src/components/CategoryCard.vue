<template>
    <div class="category-container" @click="selectCategory">
      <!-- Emoji Box -->
      <div class="emoji-box">
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
      emoji: String
    },
    methods: {
      selectCategory() {
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
    background: #f7f3eb; /* Match Figma background */
    transition: 0.3s;
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
  </style>
  