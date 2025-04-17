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
      <img
        :src="
          pet.petPhotoBase64
            ? `data:image/jpeg;base64,${pet.petPhotoBase64}`
            : 'https://placekitten.com/300/300'
        "
        alt="Pet Image"
        class="pet-image"
      />
    </div>

    <div class="pet-details">
      <div class="pet-name-age">
        <h2 class="pet-name">{{ pet.petName }}</h2>
        <p class="pet-age">{{ pet.petAge }}</p>
      </div>
      <p class="price">S${{ pet.petPrice }}</p>
      <div class="treats">🍖 {{ pet.numTreats }}</div>
    </div>

    <!-- Delete Button -->
    <button class="delete-btn" @click="showModal = true">🗑️</button>

    <!-- Confirmation Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2>Delete this listing? 🐾</h2>
        <p>
          Are you sure you want to delete this listing? Your pet might miss the
          chance to find a loving home! 🥺
        </p>
        <div class="actions">
          <button class="confirm" @click="deleteListing">Continue</button>
          <button class="cancel" @click="showModal = false">Cancel</button>
        </div>
      </div>
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
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    deleteListing() {
      this.showModal = false;
      this.$emit("delete-listing", this.pet.id);
    },
  },
};
</script>

<style scoped>
@import url(../assets/styles/font.css);

.pet-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
  height: 473px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

.delete-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(50, 50, 50, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  max-width: 400px;
  text-align: center;
}

.modal-content h2 {
  font-family: "FredokaOne-Regular";
  margin-bottom: 10px;
}

.modal-content p {
  font-family: "Poppins-Regular";
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.confirm {
  background: #f9d6ce;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.cancel {
  background: transparent;
  border: none;
  color: #444;
  font-weight: bold;
  cursor: pointer;
}
</style>
