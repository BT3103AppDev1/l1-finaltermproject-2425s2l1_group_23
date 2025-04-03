<!-- Just a template replace with your own -->
<template>
  <div class = "layout"> 
    <ListersNavBar />


  </div>
</template>

<script>
import ListersNavBar from "@/components/ListersNavBar.vue";
export default {
  components: {
    ListersNavBar,
  },
  name: "PetListing", 
};
</script>

<style scoped>
.layout {
  display: flex;
}
.pet-listing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  background-color: #f7f3eb;
}

h1 {
  font-family: FredokaOne-Regular;
  font-size: 2.5em;
  color: #222f61;
}

p {
  font-family: Raleway-Medium;
  font-size: 1.2em;
  color: #838694;
}
</style>
