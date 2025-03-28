<!-- Just a template replace with your own -->
<template>
  <div class="pet-listing">
    <h1>Pet Listing</h1>
    <p>This is a dummy template for the Pet Listing page.</p>

    <!-- Temporary Button to go to Add Listing -->
    <button @click="goToAddListing" class="add-button">Add a Pet</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: "PetListing",
  setup() {
    const router = useRouter();
    const goToAddListing = () => {
      router.push("/addlisting1");
    };
    return { goToAddListing };
  },
};
</script>

<style scoped>
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
