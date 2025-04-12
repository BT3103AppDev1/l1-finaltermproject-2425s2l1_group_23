<template>
  <div class="layout">
    <div class="navbar">
      <AdoptersNavBar v-if="!isPetLister" />
      <ListersNavBar v-if="isPetLister" />
    </div>
    <div class="chat-screen">
      <div class="chatpreview-container">
        <ChatPreview @chat-selected="selectChat" />
      </div>
      <div class="chatroom-container">
        <ChatRoom v-if="selectedChat" :selectedChat="selectedChat" />
      </div>
    </div>
  </div>
</template>

<script>
import ChatPreview from "@/components/ChatPreview.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import AdoptersNavBar from "../../components/AdoptersNavBar.vue";
import ListersNavBar from "../../components/ListersNavBar.vue";
import { getAuth } from "firebase/auth";
import { db} from "../../../firebase/firebase.js";
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: "ChatPage",
  components: {
    ChatPreview,
    ChatRoom,
    AdoptersNavBar,
    ListersNavBar,
  },
  data() {
    return {
      selectedChat: null, // Stores the currently selected chat
      isPetLister: null,
    };
  },

  mounted() {
    this.getStatus();
  },

  methods: {
    // Handles selecting a chat from the preview
    selectChat(chat) {
      this.selectedChat = chat;
    },

    async getStatus() {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No user is currently logged in.");
          return;
        }

        const userDocRef = doc(db, "Users", currentUser.uid); // Reference to the user's document
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          this.isPetLister = userData.isPetLister; // Set `isPetLister` based on the document
          console.log("User status fetched successfully:", this.isPetLister);
        } else {
          console.error("No such user document in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    }
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.logo {
  width: 6em;
  height: 6em;
  margin: 1em;
}
.navbar {
  padding-right: 5em;
  flex-shrink: 0;
}

.chat-screen {
  display: flex;
  height: 95vh;
  flex-direction: row;
  overflow: hidden; /* Prevent horizontal scrolling */
  flex-grow: 1;
  justify-self: center;
  align-self: center;
  border-radius: 1em;
  margin: 1em;
}

.nav-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  height: 100%;
  box-sizing: border-box;
}

.chatpreview-container {
  width: 400px;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  border-right: 1px solid #b4abab;
  background-color: rgba(215, 213, 253, 0.5);
  overflow: hidden;
  flex: 0 0 300px;
}

.chatroom-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgb(255, 255, 255);
}
</style>
