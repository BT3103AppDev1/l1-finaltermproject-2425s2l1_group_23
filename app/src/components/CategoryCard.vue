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
    font-size: 50px;
  }
  
  /* Bottom box for category name */
  .category-name-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  /* Category Name */
  .category-name {
    font-family: "FredokaOne-Regular";
    font-size: 18px;
    font-weight: bold;
    color: #222f61;
  }
  </style>
  