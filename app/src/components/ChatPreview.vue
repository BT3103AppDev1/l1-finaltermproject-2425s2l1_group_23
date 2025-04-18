<template>
  <!-- Conditional rendering of header depending on isLister condition in the isListers -->
  <div class="chat-preview">
    <h2 v-if="!loading && isPetLister" class="header">Adopters🏡</h2>
    <h2 v-if="!loading && !isPetLister" class="header">Listers🐾</h2>
    <ul>
      <li
        v-for="chat in chats"
        :key="chat.id"
        @click="selectChat(chat.id)"
        :class="['chat-item', { active: chat.id === selectedChatId }]"
      >
        <div class="item">
          <img
            v-if="isPetLister"
            :src="chat.profileImage || listerAvatar"
            alt="User Avatar"
            class="avatar"
          />
          <img
            v-if="!isPetLister"
            :src="chat.profileImage || adopterAvatar"
            alt="User Avatar"
            class="avatar"
          />
          <div class="text">
            <p class="name">
              <!--chat.id to render my NameComponent here-->
              <NameComponent :userId="chat.otherUserId" />
            </p>
            <p class="message">
              {{ chat.lastMessage || "No messages yet" }}
            </p>
          </div>
          <span v-if="chat.unread" class="unread-indicator"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDoc,
  doc, // Make sure this is imported
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { onUnmounted } from "vue";
import listerAvatar from "../assets/images/ListerDefault.png";
import adopterAvatar from "../assets/images/AdopterDefault.png";
import NameComponent from "../components/NameComponent.vue";

export default {
  name: "ChatPreview",
  components: {
    NameComponent,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chats: [],
      selectedChatId: null,
      currentUserId: null,
      isPetLister: null,
      loading: true,
      listerAvatar,
      adopterAvatar,
      otherUserId: null,
      lastMessage: null,
    };
  },

  async created() {
    const auth = getAuth();

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Current user:", user);
        this.currentUserId = user.uid;
        await this.fetchChatRooms(); // fetch chat rooms after user is authenticated
      } else {
        console.error("No user is signed in.");
        // handle the case where no user is logged in (e.g., redirect to login page)
        this.$router.push("/login");
      }
    });
  },
  methods: {
    async fetchChatRooms() {
      try {
        // get usr current data
        const userDocRef = doc(db, "Users", this.currentUserId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          throw new Error("User document not found");
        }

        const userData = userDoc.data();
        this.isPetLister = userData.isPetLister;
        console.log(this.isPetLister);

        this.loading = false;

        // by pass the documentID then query the collection usiing composite index
        const q = query(
          collection(db, "ChatRooms"),
          where("participants", "array-contains", this.currentUserId),
          orderBy(
            this.isPetLister ? "latestTimeLister" : "latestTimeAdopter",
            "desc"
          )
        );

        // 3. Set up real-time listener
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const chatPromises = querySnapshot.docs.map(async (document) => {
            const chatData = document.data();
            const chatId = document.id;
            const _petListingId = chatData.petListingId;

            if (chatData.expiryDate) {
              const expiryDate = chatData.expiryDate.toDate();
              const currentDate = new Date();
              if (currentDate > expiryDate) {
                console.log(`Chat ${chatId} is expired and will not be shown.`);
                return null; // Exclude expired chats
              }
            }

            // Get other participant's ID
            const otherUserId = chatData.participants.find(
              (id) => id !== this.currentUserId
            );

            // Get other user's details
            const otherUserRef = doc(db, "Users", otherUserId);
            const otherUserDoc = await getDoc(otherUserRef);

            if (!otherUserDoc.exists()) return null;

            const otherUserData = otherUserDoc.data();

            // filter based on user type --> meaning that the if user is a petLister and the other user is also a petLister it will return a null and vice versa
            if (
              (this.isPetLister && otherUserData.isPetLister) ||
              (!this.isPetLister && !otherUserData.isPetLister)
            ) {
              return null;
            }

            let latestMessage = this.isPetLister
              ? chatData.latestMessageLister
              : chatData.latestMessageAdopter;

            // Truncate the message if it exceeds a certain length
            const maxLength = 50; // Set your desired maximum length
            if (latestMessage && latestMessage.length > maxLength) {
              latestMessage = latestMessage.substring(0, maxLength) + "...";
            }

            const latestTime = this.isPetLister
              ? chatData.latestTimeLister
              : chatData.latestTimeAdopter;

            const lastSender = this.isPetLister
              ? chatData.lastSenderLister
              : chatData.lastSenderAdopter;

            const _treatStatus = chatData.treatStatus;
            console.log("Treat status:", _treatStatus); // Debugging: Check treat status

            // Fetch the pet photo using petListingId
            let petPhotoBase64 = null;
            let petName = "Unknown Pet"; // Default value
            if (_petListingId) {
              const petListingRef = doc(db, "Pet_Listings", _petListingId);
              const petListingDoc = await getDoc(petListingRef);

              if (petListingDoc.exists()) {
                const petListingData = petListingDoc.data();
                petPhotoBase64 = petListingData.petPhotoBase64 || null;
                console.log("Pet photo base64:", petPhotoBase64); // Debugging: Check pet photo data
                petName = petListingData.petName || "Unknown Pet";
              }
            }

            return {
              id: chatId,
              name: `${otherUserData.firstName} ${otherUserData.lastName}`,
              lastMessage: latestMessage || "",
              lastTime: latestTime ? latestTime.toDate() : null,
              profileImage: otherUserData.profileImage,
              petListingId: _petListingId,
              petName: petName,
              petProfileImage: petPhotoBase64,
              treatStatus: _treatStatus,
              unread:
                chatData.hasRead === false && lastSender !== this.currentUserId,
              otherUserId: otherUserId,
            };
          });

          // wait for all promises and filter out nulls
          this.chats = (await Promise.all(chatPromises)).filter(
            (chat) => chat !== null
          );
        });

        // clean up listener when component unmounts
        onUnmounted(() => unsubscribe());
      } catch (error) {
        console.error("Error in fetchChatRooms:", error);
      }
    },
    async selectChat(chatId) {
      this.selectedChatId = chatId;
      const selectedChat = this.chats.find((chat) => chat.id === chatId);
      this.$emit("chat-selected", {
        id: chatId,
        name: selectedChat.name,
        profileImage: selectedChat.profileImage,
        petProfileImage: selectedChat.petProfileImage,
        petName: selectedChat.petName,
        treatStatus: selectedChat.treatStatus,
        otherUserId: selectedChat.otherUserId,
        petListingId: selectedChat.petListingId,
      });

      // Mark as read when selected
      if (selectedChat.unread) {
        await updateDoc(doc(db, "ChatRooms", chatId), {
          hasRead: true,
        });
      }
    },
  },
};
</script>

<style scoped>
.chat-preview {
  max-width: 400px;
  margin-bottom: 20px;
  height: 100%;
  overflow-y: auto;
}

ul {
  padding: 0;
  margin: 0;
}

.header {
  font-family: FredokaOne-Regular;
  font-size: 2em;
  text-align: center;
  color: #303030;
  position: static;
}

.chat-item {
  border-top: 1px solid #b4abab;
  border-bottom: 1px solid #b4abab;
  cursor: pointer;
  transition: background-color 0.3s ease;
  list-style-type: none;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-item:hover {
  background-color: #d4d4fd;
}

.chat-item.active {
  background-color: #b5b5fd;
}

.item {
  display: flex;
  align-items: center;
}

.item img {
  border-radius: 50%;
  margin: 0 10px;
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;
  object-fit: cover;
}

.name {
  font-family: Raleway-SemiBold;
  margin: 8px 0;
}

.message {
  font-family: Raleway-Light;
  font-size: 1em;
  padding-right: 5px;
  margin: 0;
  margin-bottom: 8px;
}

.unread-indicator {
  width: 20px;
  height: 20px;
  background-color: #8c9de1;
  border-radius: 50%;
  display: inline-block;
  margin-left: auto;
  margin-right: 10px;
}
</style>
