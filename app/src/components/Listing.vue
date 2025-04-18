<template>
  <div class="pet-card">
    <div class="owner-info">
      <img :src="pet.ownerImage" alt="Owner Profile" class="owner-image" />
      <div class="owner-details">
        <h3><NameComponent :userId="pet.userId" /></h3>
        <p>{{ pet.timeAgo }}</p>
      </div>
    </div>
    <div class="pet-image-container">
      <img :src="pet.petImage" alt="Pet Image" class="pet-image" />
    </div>
    <div class="pet-details">
      <div class="pet-name-age">
        <h2 class="pet-name">{{ pet.petName }}</h2>
        <p class="pet-age">{{ pet.petAge }}</p>
      </div>
      <p class="price">S${{ pet.petPrice }}</p>
      <div class="treats">🍖 {{ pet.numTreats }}</div>
    </div>
  </div>
</template>

<script>
import NameComponent from "../components/NameComponent.vue";
export default {
  components: {
    NameComponent,
  },
  props: {
    pet: {
      type: Object,
      required: true,
    },

    owner: {
      type: Object,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
@import url(../assets/styles/font.css);

.pet-card {
  background: white;
  border-radius: 20px;
  padding: 10px;
  width: 300px;
  height: 473px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
  margin-top: 2em;
}

.pet-card:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.owner-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

.owner-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.owner-details h3 {
  margin: 0;
  font-size: 16px;
  font-family: "Poppins-SemiBold";
}

.owner-details p {
  margin: 0;
  font-size: 12px;
  color: #7c7c7c;
  font-family: "Poppins-SemiBold";
}

.pet-image-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.pet-image {
  width: 267px;
  height: 292px;
  object-fit: cover;
  border-radius: 30px;
}

.pet-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  line-height: 1.2;
  margin-top: 2px;
}

.pet-name-age {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pet-name {
  font-size: 24px;
  font-family: "Poppins-Bold";
  color: #222f61;
  margin: 0 0 0 10px;
}

.pet-age {
  font-size: 13px;
  color: black;
  font-family: "Poppins-SemiBold";
  margin: 0 0 0 10px;
}

.price {
  font-weight: bold;
  font-family: "Poppins-Medium";
  font-size: 20px;
  color: #7c7c7c;
  margin: 2px 0 0 10px;
}

.treats {
  margin: 2px 0 0 10px;
  font-size: 15px;
  font-family: "Poppins-SemiBold";
  color: #e47a7a;
  display: flex;
  align-items: center;
}
</style>
