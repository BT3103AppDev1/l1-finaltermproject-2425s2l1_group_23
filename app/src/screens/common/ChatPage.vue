<template>
  <div class="chat-screen">
    <div class="nav-container">
      <img src="@/assets/images/PawfectHome-Logo.png" alt="Logo" class="logo" />
      <!-- Navbar will be here -->
    </div>
    <div class="chatpreview-container">
      <ChatPreview @chat-selected="selectChat" />
    </div>
    <div class="chatroom-container">
      <ChatRoom v-if="selectedChat" :selectedChat="selectedChat" />
    </div>
  </div>
</template>

<script>
import ChatPreview from "@/components/ChatPreview.vue";
import ChatRoom from "@/components/ChatRoom.vue";

export default {
  name: "ChatPage",
  components: {
    ChatPreview,
    ChatRoom,
  },
  data() {
    return {
      selectedChat: null, // Stores the currently selected chat
    };
  },
  methods: {
    // Handles selecting a chat from the preview
    selectChat(chat) {
      this.selectedChat = chat;
    },
  },
};
</script>

<style scoped>
.logo {
  width: 6em;
  height: 6em;
  margin: 1em;
}

.chat-screen {
  display: flex;
  height: 100vh;
  flex-direction: row;
  overflow: hidden; /* Prevent horizontal scrolling */
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
  border-left: 1px solid #b4abab;
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
}

.chatroom-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
