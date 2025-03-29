<template>
  <div class="chat-room">
    <!-- Person Section -->
    <div class="person">
      <img
        src="https://via.placeholder.com/50"
        alt="User Avatar"
        class="avatar"
      />
      <h2>{{ selectedChat.name }}</h2>
    </div>

    <!-- Pet Section -->
    <div class="notification">
      <div class="pet">
        <img
          src="https://via.placeholder.com/50"
          alt="Pet Avatar"
          class="pet-avatar"
        />
        <h3>Goldie</h3>
      </div>
      <div class="treat"></div>
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
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatRoom",
  props: {
    selectedChat: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      messages: [
        // Sample messages
        { id: 1, sender: "Lister", text: "Hello, how can I help you?" },
        { id: 2, sender: "Adopter", text: "I'm interested in your pet." },
      ],
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          id: this.messages.length + 1,
          sender: "You", // Mark the sender as the user
          text: this.newMessage,
        });
        this.newMessage = "";

        // Scroll to the bottom of the messages
        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector(".messages");
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
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
  font-family: FredokaOne-Regular;
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
  font-family: FredokaOne-Regular;
  letter-spacing: 2px;
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
</style>
