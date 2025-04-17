<template>
  <div class="chat-room">
    <!-- Person Section -->
    <div class="person">
      <img
        v-if="isPetLister"
        :src="selectedChat.profileImage || listerAvatar"
        alt="Pet Avatar"
        class="pet-avatar"
      />

      <img
        v-if="!isPetLister"
        :src="selectedChat.profileImage || adopterAvatar"
        alt="Pet Avatar"
        class="pet-avatar"
      />

      <h2>
        <NameComponent :userId="selectedChat.otherUserId" />
      </h2>
    </div>

    <!-- Pet Section // stilll need to work on this logic -->
    <div class="notification">
      <div class="pet">
        <img
          :src="
            selectedChat.petProfileImage
              ? `data:image/png;base64,${selectedChat.petProfileImage}`
              : petListingAvatar
          "
          alt="Pet Avatar"
          class="pet-avatar"
        />
        <h3>{{ selectedChat.petName }}</h3>
      </div>
      <!-- Treat button for Listers -->
      <!-- 3 treat status: Accepted, Rejected, Pending -->
      <div
        class="treat-l"
        v-if="selectedChat.treatStatus === 'pending' && isPetLister"
      >
        <button class="accept-button" @click="acceptTreat">
          <p>🦴 Accept Treat</p>
        </button>
        <button class="reject-button" @click="rejectTreat">
          <p>❌ Reject</p>
        </button>
      </div>

      <div
        v-if="selectedChat.treatStatus === 'accepted' && isPetLister"
        class="treat-status-l-accept"
      >
        <p>Treat accepted 🦴</p>
      </div>

      <div
        v-if="selectedChat.treatStatus === 'rejected' && isPetLister"
        class="treat-status-l-reject"
      >
        <p>Treat rejected...</p>
      </div>

      <!-- Treat button for Adopters -->
      <div
        v-if="selectedChat.treatStatus === 'pending' && !isPetLister"
        class="treat-a"
      >
        <p>
          Your treat is still on its way to {{ selectedChat.petName }}. Hang tight!
        </p>
      </div>

      <div
        v-if="selectedChat.treatStatus === 'accepted' && !isPetLister"
        class="treat-status-a-accept"
      >
        <p>{{ petData.petName }} has accepted your treat! 🦴</p>
      </div>

      <div
        v-if="selectedChat.treatStatus === 'rejected' && !isPetLister"
        class="treat-status-a-reject"
      >
        <p>{{ petData.petName }} has rejected your treat...</p>
      </div>
    </div>

    <!-- Messages Section -->
    <div class="messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'message',
          { 'message-right': message.sender === 'You' },
          { 'admin-message': message.sender === 'Admin' },
        ]"
      >
        <p v-if="message.sender === 'Admin'" class="admin-text">
          {{ message.text }}
        </p>
        <p v-else class="bubble">
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
        :disabled="isChatExpired"
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
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdSendRound } from "oh-vue-icons/icons";
import listerAvatar from "../assets/images/ListerDefault.png";
import adopterAvatar from "../assets/images/AdopterDefault.png";
import petListingAvatar from "../assets/images/PetListingDefault.png";
import NameComponent from "../components/NameComponent.vue";

addIcons(MdSendRound);

export default {
  name: "ChatRoom",
  components: {
    "v-icon": OhVueIcon,
    NameComponent,
  },
  props: {
    selectedChat: {
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
      messages: [],
      newMessage: "",
      currentUserId: null,
      unsubscribeMessages: null,
      petData: {},
      listerAvatar,
      adopterAvatar,
      petListingAvatar,
      isPetLister: false,
      isChatExpired: false,
      adopterId: null,
      listerId: null,
    };
  },
  async created() {
    const auth = getAuth();
    this.currentUserId = auth.currentUser.uid;

    this.adopterId = this.selectedChat.otherUserId; // Assuming this is the adopter ID
    this.listerId = this.currentUserId;
    const userDocRef = doc(db, "Users", this.currentUserId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      this.isPetLister = userData.isPetLister || false; // Set isPetLister
    } else {
      console.error("User document not found");
    }
    this.fetchMessages();
    this.display();
  },
  watch: {
    selectedChat: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (this.unsubscribeMessages) {
            this.unsubscribeMessages(); // Clean up previous listener
          }
          this.fetchMessages();
        }
      },
    },
  },
  beforeUnmount() {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages(); // Clean up listener when component is destroyed
    }
  },

  methods: {
    async display() {
      let petListingId = this.selectedChat.petListingId; // Retrieve petListingId from the ChatRooms document
      console.log("PetListingId:", petListingId);
      const petDocRef = doc(db, "Pet_Listings", petListingId);
      console.log("Pet Image:", this.selectedChat.petProfileImage);

      try {
        const docSnap = await getDoc(petDocRef);
        if (docSnap.exists()) {
          this.petData = docSnap.data();
        } else {
          console.log("No such pet in Firebase");
        }
      } catch (error) {
        console.log("Error fetching pet listing", error);
      }

      const chatRoomDocRef = doc(db, "ChatRooms", this.selectedChat.id);
      try {
        const docSnap = await getDoc(chatRoomDocRef);
        if (docSnap.exists()) {
          const chatRoomData = docSnap.data();

          if (chatRoomData.expiryDate) {
            const expiryDate = chatRoomData.expiryDate.toDate();
            const currentDate = new Date();
            this.isChatExpired = currentDate > expiryDate;
          }
        } else {
          console.log("No such ChatRoom in Firebase");
        }
      } catch (error) {
        console.error("Error fetching ChatRoom document:", error);
      }
    },

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
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      this.unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
        this.messages = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          if (
            messageData.to === this.currentUserId ||
            messageData.from === this.currentUserId
          ) {
            this.messages.push({
              id: doc.id,
              sender:
                messageData.from === "admin"
                  ? "Admin"
                  : messageData.from === this.currentUserId
                  ? "You"
                  : this.selectedChat.name,
              text: messageData.content,
              timestamp: messageData.timestamp?.toDate() || new Date(),
            });
          }
        });

        // Scroll to bottom after messages load
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
        // Add new message to subcollection
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
          timestamp: serverTimestamp(),
        });

        // Update the chat room with latest message info
        const chatRoomRef = doc(db, "ChatRooms", this.selectedChat.id);
        await updateDoc(chatRoomRef, {
          latestMessageAdopter: this.newMessage.trim(),
          latestTimeAdopter: serverTimestamp(),
          latestMessageLister: this.newMessage.trim(),
          latestTimeLister: serverTimestamp(),
          lastSenderAdopter: this.currentUserId,
          lastSenderLister: this.currentUserId,
          hasRead: false,
        });

        this.newMessage = ""; // Clear the input field
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },

    async acceptTreat() {
      try {
        const chatRoomDocRef = doc(db, "ChatRooms", this.selectedChat.id);
        await updateDoc(chatRoomDocRef, { treatStatus: "accepted" });
        this.treatStatus = "accepted"; // Update UI
        console.log("Treat accepted");
        const messagesRef = collection(chatRoomDocRef, "messages");

        // Fetch adopter and lister data
        const adopterDocRef = doc(db, "Users", this.selectedChat.otherUserId); // Adopter ID
        const listerDocRef = doc(db, "Users", this.currentUserId); // Lister ID
        const adopterDoc = await getDoc(adopterDocRef);
        const listerDoc = await getDoc(listerDocRef);

        const adopterFirstName = adopterDoc.exists()
          ? adopterDoc.data().firstName
          : "Adopter";
        const listerFirstName = listerDoc.exists()
          ? listerDoc.data().firstName
          : "Lister";

        await addDoc(messagesRef, {
          from: "admin",
          to: this.adopterId,
          content: `
          🎉 Treat accepted – ${this.petData.petName} is officially yours!

          Now’s a good time to message ${listerFirstName} to:

          • Arrange a meet-up or handover 🐾
          • Ask about ${this.petData.petName}’s routine, likes, and essentials
          • Share anything they should know about you or your home 🏡

          Let’s make ${this.petData.petName}’s transition smooth and happy! ❤️
          `,
          timestamp: serverTimestamp(),
        });

        await addDoc(messagesRef, {
          from: "admin",
          to: this.listerId,
          content: `
          You’ve accepted the treat – that means ${this.petData.petName} is on their way to a new home!

          You can now:

          • Message ${adopterFirstName} to set up a meet-up or handover 📍

          • Share ${this.petData.petName}’s habits, food, vet records, and favourite toys

          • Let them know any final tips for settling ${this.petData.petName} in 🏡

          Thank you for giving ${this.petData.petName} a loving start. You're pawesome! 🐾
          `,
          timestamp: serverTimestamp(),
        });

        await updateDoc(chatRoomDocRef, {
          latestMessageAdopter: `🎉 Treat accepted – ${this.petData.petName} is officially yours!
          Now’s a good time to message ${listerFirstName} to:
          • Arrange a meet-up or handover 🐾
          • Ask about ${this.petData.petName}’s routine, likes, and essentials
          • Share anything they should know about you or your home 🏡

          Let’s make ${this.petData.petName}’s transition smooth and happy! ❤️
          `,
          latestMessageLister: `You’ve accepted the treat – that means ${this.petData.petName} is on their way to a new home!

          You can now:

          • Message ${adopterFirstName} to set up a meet-up or handover 📍

          • Share ${this.petData.petName}’s habits, food, vet records, and favourite toys

          • Let them know any final tips for settling ${this.petData.petName} in 🏡

          Thank you for giving ${this.petData.petName} a loving start. You're pawesome! 🐾`,
          latestTimeAdopter: serverTimestamp(),
          latestTimeLister: serverTimestamp(),
        });
        console.log("Initial message added to the message subcollection");
      } catch (error) {
        console.log("Error", error);
      }
    },

    async rejectTreat() {
      try {
        const chatRoomDocRef = doc(db, "ChatRooms", this.selectedChat.id);
        await updateDoc(chatRoomDocRef, { treatStatus: "rejected" });
        this.treatStatus = "rejected"; // Update UI
        console.log("Treat rejected");

        const messagesRef = collection(chatRoomDocRef, "messages");
        // Fetch adopter and lister data
        const adopterDocRef = doc(db, "Users", this.selectedChat.otherUserId); // Adopter ID
        const listerDocRef = doc(db, "Users", this.currentUserId); // Lister ID
        const adopterDoc = await getDoc(adopterDocRef);
        const listerDoc = await getDoc(listerDocRef);

        const adopterFirstName = adopterDoc.exists()
          ? adopterDoc.data().firstName
          : "Adopter";
        const listerFirstName = listerDoc.exists()
          ? listerDoc.data().firstName
          : "Lister";

        await addDoc(messagesRef, {
          from: "admin",
          to: this.adopterId,
          content: `
          Hey there! ${listerFirstName} has decided not to accept the treat for ${this.petData.petName} this time 🐾

          Don’t be discouraged – there are plenty of other adorable pets waiting for you to send them a treat! 🐶🐱

          Thanks for being part of this journey. 💛

          The chat will be closed in 24 hours, but you can always reach out to us if you have any questions or need assistance. 💬
          `,
          timestamp: serverTimestamp(),
        });

        await addDoc(messagesRef, {
          from: "admin",
          to: this.listerId,
          content: `
          You’ve chosen to pass on this treat for ${this.petData.petName} 🦴💭

          We’ve let ${adopterFirstName} know gently. Remember, every pet is unique and finding the right match takes time. 🐾

          Don't forget to keep your listing updated so future treats are from paw-sible matches! 🐾✨

          The chat will be closed in 24 hours, but you can always reach out to us if you have any questions or need assistance. 💬
          `,
          timestamp: serverTimestamp(),
        });
        console.log("Initial message added to the message subcollection");

        await updateDoc(chatRoomDocRef, {
          latestMessageAdopter: `Hey there! ${listerFirstName} has decided not to accept the treat for ${this.petData.petName} this time 🐾`,
          latestMessageLister: `You’ve chosen to pass on this treat for ${this.petData.petName} 🦴💭`,
          latestTimeAdopter: serverTimestamp(),
          latestTimeLister: serverTimestamp(),
        });

        // Calculate expiry date (1 day from now)
        const expiryDate = serverTimestamp();
        expiryDate.setDate(expiryDate.getDate() + 1);

        // Update the ChatRoom document with the expiry date
        await updateDoc(chatRoomDocRef, {
          expiryDate: expiryDate, // Save the expiry date
        });
      } catch (error) {
        console.log("Error", error);
      }
    },
    async goToPetProfile(petListingId) {
      localStorage.setItem("currentPetId", petListingId); // Store petListingId in localStorage
      router.push({ name: "PetProfile" }); // Navigate to PetProfile
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
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
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
  bottom: -8px;
  left: -10px;
  width: 12px;
  height: 12px;
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
  padding: 20px;
  background-color: #e4e9fa;
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

.admin-message {
  background-color: #d9dff6;
  border: 0.2em #303030;
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.admin-text {
  font-family: Raleway-SemiBold;
  font-size: 1em;
  padding: 0.2em;
  text-align: center;
}

.treat-status-l-accept,
.treat-status-l-reject {
  font-family: Raleway-Bold;
  font-size: 1em;
  height: 2.625em;
  width: 12.5em;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5em;
}

.treat-status-l-accept {
  background-color: #cee1b9;
}
.treat-status-l-reject {
  background-color: #f4d5cf;
}

.treat-a {
  font-family: Raleway-Bold;
  font-size: 1em;
  padding: 0.2em 0.5em;
  background-color: #fdf6b7;
  border-radius: 0.5em;
  margin: 0.5em;
}

.treat-l {
  display: flex;
  gap: 1em;
}

.accept-button,
.reject-button {
  border-radius: 0.5em;
  font-family: Raleway-Bold;
  font-size: 1em;
  height: 2.625em;
  width: 8.5em;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.accept-button {
  background-color: #cee1b9;
}

.accept-button:hover {
  background-color: #a8cba0;
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.reject-button {
  background-color: #f4d5cf;
}

.reject-button:hover {
  background-color: #eab8b0;
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.treat-status-a-accept,
.treat-status-a-reject {
  font-family: Raleway-SemiBold;
  font-size: 1em;
  height: 2.625em;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5em;
  padding: 0.2em 2em;
  text-align: center;
}

.treat-status-a-accept {
  background-color: #cee1b9;
}
.treat-status-a-reject {
  background-color: #f4d5cf;
}
</style>
