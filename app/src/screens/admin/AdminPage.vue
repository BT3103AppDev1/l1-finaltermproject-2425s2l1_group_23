<template>
  <div class="admin-page">
    <div class="header">
      <img
        src="../../assets/images/PawfectHome.png"
        alt="Pawfect Home Logo"
        class="logo"
      />
      <h1 class="admin-title">Admin Dashboard</h1>
      <butvton class="logout-button" @click="goBack"
        ><v-icon name="hi-logout" class="icon" v-tooltip="`Log Out`"
      /></butvton>
    </div>

    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Certificate Image</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row">
            <td>{{ user.id }}</td>
            <td>
              <img
                v-if="user.certificate_base64"
                :src="`data:image/jpeg;base64,${user.certificate_base64}`"
                alt="Certificate"
                class="certificate-image"
                @click="
                  showImage(`data:image/jpeg;base64,${user.certificate_base64}`)
                "
              />
            </td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.contactNumber }}</td>
            <td>
              <label class="verification-label">
                <input
                  type="checkbox"
                  :checked="user.isVerified"
                  @change="toggleVerification(user.id)"
                  class="verification-checkbox"
                />
                Verified
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for displaying enlarged image -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <div class="enlarged-image">
          <img :src="enlargedImage" alt="Enlarged Certificate" />
        </div>
        <div class="close-button-container">
          <button class="close-button" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { HiLogout } from "oh-vue-icons/icons";

addIcons(HiLogout);

export default {
  components: {
    "v-icon": OhVueIcon,
  },
  setup() {
    const db = getFirestore();
    const users = ref([]);
    const showModal = ref(false);
    const enlargedImage = ref("");
    const router = useRouter(); // must be inside setup() as it relies on Vue's reactivity system and lifecycle hooks.

    // Fetch users from Firestore
    const getUsers = async () => {
      const usersCollection = collection(db, "Users");
      const querySnapshot = await getDocs(usersCollection);
      users.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    // Toggle verification status for a user
    const toggleVerification = async (userId) => {
      const userDocRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const isVerified = !userDoc.data().isVerified;
        await updateDoc(userDocRef, { isVerified });
        console.log(
          `User ${userId} verification status updated to ${isVerified}`
        );
      }
    };

    const goBack = () => {
      router.push("/login");
    };

    // Show the enlarged image in a modal
    const showImage = (imageBase64) => {
      enlargedImage.value = imageBase64;
      showModal.value = true;
    };

    // Close the modal
    const closeModal = () => {
      showModal.value = false;
    };

    onMounted(() => {
      getUsers();
    });

    return {
      users,
      toggleVerification,
      showModal,
      enlargedImage,
      showImage,
      closeModal,
      goBack,
    };
  },
};
</script>

<style scoped>
@import url("../../assets/styles/font.css");

/* General Page Styling */
.admin-page {
  font-family: Raleway, Arial, sans-serif;
  padding: 20px;
  min-height: 100vh;
}

/* Title Styling */
.admin-title {
  font-family: FredokaOne-Regular, sans-serif;
  font-size: 1.8rem;
  color: #222f61;
  text-align: center;
  margin-bottom: 30px;
}

.close-button-container {
  display: flex;
  justify-content: center;
}

/* Table Container */
.table-container {
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

/* Table Styling */
.user-table {
  width: 100%;
  border-collapse: collapse;
}

/* Table Header */
.user-table thead {
  background-color: #222f61;
}

.user-table th {
  color: #ffffff;
  font-weight: 600;
  padding: 12px 15px;
  text-align: left;
  font-size: 0.9rem;
}

/* Table Rows */
.table-row {
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background-color: #f0f4f8;
}

/* Table Data */
.user-table td {
  padding: 12px 15px;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Certificate Image */
.certificate-image {
  max-width: 80px;
  max-height: 80px;
  border-radius: 4px;
  object-fit: cover;
  display: block;
  margin: auto;
  cursor: pointer;
}

/* Verification Checkbox */
.verification-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #333;
}

.verification-checkbox {
  transform: scale(1.2);
  cursor: pointer;
}

.icon {
  width: 30px;
  height: 30px;
  color: #222f61;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-title {
    font-size: 1.5rem;
  }

  .user-table th,
  .user-table td {
    padding: 10px;
    font-size: 0.85rem;
  }

  .certificate-image {
    max-width: 60px;
    max-height: 60px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
}

.modal-content button {
  margin-top: 10px;
}

.close-button {
  font-family: "Raleway-Bold";
  font-size: 16px;
  width: 144px;
  height: 50px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.close-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.logout-button {
  font-family: "Raleway-Bold";
  font-size: 1em;
  color: #222f61;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  pointer-events: auto;
}

.logout-button:hover {
  transform: scale(1.1);
}

.header {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px 20px;
}
</style>
