<template>
  <div class="name-component">
    <span class="user-name">{{ userName }}</span>

    <!-- Displays the verified logo if isVerified is true -->
    <img
      v-if="isVerified"
      class="verified-logo"
      src="../assets/images/verified/pawrified.png"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default {
  props: {
    userId: {
      type: String,
      required: true,
      default: "", // Add default value
    },
  },
  setup(props) {
    const userName = ref("Guest"); // Default to "Guest"
    const isVerified = ref(false);

    const fetchUserData = async (userId) => {
      try {
        if (!userId) {
          console.log("No user ID provided to NameComponent");
          return;
        }

        const userDocRef = doc(db, "Users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          userName.value =
            `${userData.firstName} ${userData.lastName}` || "Guest";
          isVerified.value = userData.isVerified || false;
        } else {
          console.log("User document not found for ID:", userId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    watch(
      () => props.userId,
      (newId) => {
        fetchUserData(newId);
      }
    );

    // Initial fetch
    onMounted(() => {
      if (props.userId) {
        fetchUserData(props.userId);
      }
    });

    return {
      userName,
      isVerified,
    };
  },
};
</script>

<style scoped>
.name-component {
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 5px; /* Space between name and verified logo */
}

.verified-logo {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
</style>
