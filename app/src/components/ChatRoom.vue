<template>
  <div class="chat-room">
    <!-- Person Section -->
    <div class="person">
      <img
        :src="selectedChat.profileImage || 'https://via.placeholder.com/50'"
        alt="User Avatar"
        class="avatar"
      />
      <h2>{{ selectedChat.name }}</h2>
    </div>

    <!-- Pet Section // stilll need to work on this logic -->
    <div class="notification">
      <div class="pet">
        <img
          src="https://via.placeholder.com/50"
          alt="Pet Avatar"
          class="pet-avatar"
        />
        <h3>Goldie</h3>
      </div>
      <!-- Treat button for Listers -->
      <!-- 3 treat status: Accepted, Rejected, Pending -->
      <div class="treat-l">
        <button> 
          <p>🦴 Accept Treat</p>
        </button>
        <button>
          <p>❌ Reject</p>
        </button>
      </div>

      <div class="treat-status-l">
        <p>Treat accepted 🦴</p>
        <p>Treat rejected...</p>
      </div>

      <!-- Treat button for Adopters -->
      <div class="treat-l">
        <p>Your treat is still on its way to pet.name. Hang tight!</p>
      </div>

      <div class="treat-status-l">
        <p>pet.name has accepted your treat! 🦴</p>
        <p>pet.name has rejected your treat...</p>

      </div>
    </div>

    <!-- Messages Section -->
    <div class="messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', { 'message-right': message.sender === 'You' }]"
      >
        <p class="bubble">
          <strong>{{ message.text }}</strong>
        </p>
      </div>
    </div>

    <!-- Input Bar Section -->
    <div class="message-input">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">
        <v-icon name="md-send-round" class="send-icon"></v-icon>
      </button>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdSendRound } from "oh-vue-icons/icons";

addIcons(MdSendRound);

export default {
  name: "ChatRoom",
  components: {
    "v-icon": OhVueIcon,
  },
  props: {
    selectedChat: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      currentUserId: null,
      unsubscribeMessages: null,
    };
  },
  async created() {
    const auth = getAuth();
    this.currentUserId = auth.currentUser.uid;
    this.fetchMessages();
  },
  watch: {
    selectedChat: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (this.unsubscribeMessages) {
            this.unsubscribeMessages(); // clean up previous listener
          }
          this.fetchMessages();
        }
      },
    },
  },
  beforeUnmount() {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages(); // clean up listener when component is destroyed
    }
  },
  methods: {
    fetchMessages() {
      if (!this.selectedChat || !this.selectedChat.id) {
        console.error("Invalid selectedChat");
        return;
      }

      const messagesRef = collection(
        db,
        "ChatRooms",
        this.selectedChat.id,
        "messages"
      );
      const q = query(messagesRef, orderBy("time", "asc"));
      this.unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
        this.messages = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          this.messages.push({
            id: doc.id,
            sender:
              messageData.from === this.currentUserId
                ? "You"
                : this.selectedChat.name,
            text: messageData.content,
            time: messageData.time?.toDate() || new Date(),
          });
        });

        // scroll to bottom after messages load
        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector(".messages");
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        });
      });
    },
    async sendMessage() {
      if (this.newMessage.trim() === "") return;

      try {
        // add new message to subcollection
        const messagesRef = collection(
          db,
          "ChatRooms",
          this.selectedChat.id,
          "messages"
        );
        await addDoc(messagesRef, {
          from: this.currentUserId,
          to: this.selectedChat.otherUserId,
          content: this.newMessage.trim(),
          time: serverTimestamp(),
        });

        // update the chat room with latest message info
        const chatRoomRef = doc(db, "ChatRooms", this.selectedChat.id);
        await updateDoc(chatRoomRef, {
          latestMessage: this.newMessage.trim(),
          latestTime: serverTimestamp(),
          hasRead: false,
          lastSender: this.currentUserId,
        });

        this.newMessage = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  },
};
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.person {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b4abab;
  padding: 10px;
}

.person img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.person h2 {
  font-family: Raleway-SemiBold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b4abab;
  padding: 5px;
}

.pet {
  display: flex;
  align-items: center;
}

.pet img {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  margin-right: 10px;
}

.pet h3 {
  font-family: Poppins-SemiBold;
  letter-spacing: 1.5px;
  font-size: 1.3em;
  margin: 0.6em 0;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.messages ::-webkit-scrollbar {
  display: none;
}

.message {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  margin-left: 1em;
}

.message-right {
  justify-content: flex-end;
  margin-right: 1em;
}

.bubble {
  background-color: #e7e7e7;
  border-radius: 25px;
  padding: 10px;
  width: fit-content;
  max-width: 500px;
  position: relative;
  margin-bottom: 20px;
}

.message-right .bubble {
  background-color: #8c9de1;
}

.message-right strong {
  color: white;
}
.bubble::after {
  content: "";
  position: absolute;
  bottom: -18px;
  left: -10px;
  width: 15px;
  height: 15px;
  background-color: #e7e7e7;
  border-radius: 50%;
}

.message-right .bubble::after {
  left: auto;
  right: -10px;
  background-color: #8c9de1;
}

.message strong {
  font-family: Raleway-Regular;
}

.message-input {
  display: flex;
  gap: 10px;
  padding: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  background-color: #e2f0fd;
  border: none;
  border-radius: 25px;
  font-family: Raleway-Light;
  outline: none;
}

.message-input button {
  padding: 10px 20px;
  background-color: #8c9de1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.message-input button:hover {
  background-color: #707eb3;
}

.send-icon {
  width: 20px;
  height: 20px;
  color: white;
}
</style>
