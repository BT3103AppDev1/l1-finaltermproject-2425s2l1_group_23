<template>
  <div class="chat-preview">
    <h2 class="header">Adopters🏡</h2>
    <ul>
      <li
        v-for="chat in chats"
        :key="chat.id"
        @click="selectChat(chat.id)"
        :class="['chat-item', { active: chat.id === selectedChatId }]"
      >
        <div class="item">
          <img
            src="https://via.placeholder.com/50"
            alt="User Avatar"
            class="avatar"
          />
          <div class="text">
            <p class="name">
              <strong>{{ chat.name }}</strong>
            </p>
            <p class="message">{{ chat.lastMessage }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ChatPreview",
  data() {
    return {
      chats: [
        // Sample chat data
        { id: 1, name: "Ming Han", lastMessage: "Hello, I like your pet" },
        {
          id: 2,
          name: "Piraveen Alexander",
          lastMessage: "Your pet is adorable! Can I adopt it?",
        },
      ],
      selectedChatId: null, // Track the currently active chat
    };
  },
  methods: {
    selectChat(chatId) {
      this.selectedChatId = chatId;
      this.$emit(
        "chat-selected",
        this.chats.find((chat) => chat.id === chatId)
      );
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
  border-bottom: 1px solid #b4abab;
  cursor: pointer;
  transition: background-color 0.3s ease;
  list-style-type: none;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-item:hover {
  background-color: #efe5c1;
}

.chat-item.active {
  background-color: #efe5c1;
}

.item {
  display: flex;
  align-items: center;
}

.item img {
  border-radius: 50%;
  margin-right: 10px;
  width: 50px;
  height: 50px;
}

.name {
  font-family: Raleway-SemiBold;
}

.message {
  font-family: Raleway-Light;
  font-size: 1em;
}
</style>
