<template>
  <div class="layout">
    <div class="navbar">
      <AdoptersNavBar />
    </div>

    <div class="marketplace-full">
      <div class="marketplace-scroll-area">
        <h2 class="header-text">These pets received your treats! 🍖</h2>

        <section class="pet-list">
          <div
            v-for="pet in petList"
            :key="pet.petListingId"
            class="listing-link"
          >
            <Listing :pet="pet" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase.js";
import Listing from "@/components/Listing.vue";
import AdoptersNavBar from "@/components/AdoptersNavBar.vue";
import listerDefaultImage from "@/assets/images/ListerDefault.png";
import petDefaultImage from "@/assets/images/PetListingDefault.png";
import { formatTimeAgo } from "../../utils/timeAgo.js";
export default {
  name: "SendTreatsSummary",
  components: {
    Listing,
    AdoptersNavBar,
  },
  setup() {
    const petList = ref([]);
    const router = useRouter();

    const fetchSentTreats = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        // Step 1: Get treatsSent array
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);
        const treatsSent = userSnap.exists()
          ? userSnap.data().treatsSent || []
          : [];

        if (treatsSent.length === 0) return;

        // Step 2: Fetch Users to map userID to names/images
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const usersMap = {};
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          usersMap[doc.id] = {
            owner: `${data.firstName} ${data.lastName}`,
            ownerImage: data.profileImage || listerDefaultImage,
          };
        });

        // Step 3: Fetch Pet Listings in batches of 10
        const petDocs = [];
        for (let i = 0; i < treatsSent.length; i += 10) {
          const chunk = treatsSent.slice(i, i + 10);
          const petQuery = query(
            collection(db, "Pet_Listings"),
            where("__name__", "in", chunk)
          );
          const snapshot = await getDocs(petQuery);
          petDocs.push(...snapshot.docs);
        }

        // Step 4: Map each pet with owner info and display data
        petList.value = petDocs.map((doc) => {
          const petData = doc.data();
          const userId = petData.userID;
          const ownerData = usersMap[userId] || {
            owner: "Unknown",
            ownerImage: "https://placekitten.com/60/60",
          };

          return {
            petListingId: doc.id,
            owner: ownerData.owner,
            ownerImage: ownerData.ownerImage,
            userId: petData.userID,
            petImage: petData.petPhotoBase64
              ? `data:image/png;base64,${petData.petPhotoBase64}`
              : petDefaultImage,
            petName: petData.petName || "Unknown",
            petAge: petData.petAge || "N/A",
            petPrice: petData.petPrice || 0,
            numTreats: petData.numTreats || 0,
            timeAgo: petData.createdAt
              ? formatTimeAgo(petData.createdAt)
              : "N/A",
          };
        });
      } catch (err) {
        console.error("Error fetching sent treats:", err);
      }
    };

    onMounted(() => {
      fetchSentTreats();
    });

    return {
      petList,
    };
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: #f7f3eb;
  width: 100%;
  height: 100vh;
}

.navbar {
  padding-right: 5em;
  flex-shrink: 0;
}

.marketplace-full {
  flex-grow: 1;
  flex-direction: column;
  display: flex;
  overflow-y: auto;
  padding: 0em 2em;
}

.marketplace-scroll-area {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header-text {
  font-family: "FredokaOne-Regular";
  font-size: 1.875em;
  color: "black";
  margin-bottom: 1em;
}

.pet-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 20px;
}

.listing-link {
  text-decoration: none;
  color: inherit;
}
</style>
