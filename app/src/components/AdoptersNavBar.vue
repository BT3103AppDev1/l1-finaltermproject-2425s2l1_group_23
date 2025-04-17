<template>
  <div class="overall">
    <img src="@/assets/images/PawfectHome-Logo.png" class="logo" />
    <div class="adopters-navbar">
      <!-- Home (MarketPlace.vue) -->
      <router-link to="/home" class="icon-button">
        <v-icon name="io-home-outline" class="icon" v-tooltip="`Home`" />
      </router-link>

      <!-- Chat -->
      <router-link to="/chat" class="icon-button">
        <v-icon name="co-chat-bubble" class="icon2" v-tooltip="`Chats`" />
        <span v-if="chatsUnread > 0" class="chat-notification">{{
          chatsUnread
        }}</span>
      </router-link>

      <!-- PetTreatSummary -->
      <router-link to="/sendtreatssummary" class="icon-button">
        <v-icon
          name="la-bone-solid"
          class="icon2"
          v-tooltip="`Treats Summary`"
        />
      </router-link>

      <!-- Edit Profile (EditProfile.vue) -->
      <router-link to="/editprofile" class="icon-button">
        <v-icon
          name="fa-regular-edit"
          class="icon"
          v-tooltip="`Edit Profile`"
        />
      </router-link>

      <div class="spacer"></div>

      <!-- Logout -->
      <button @click="logout" class="icon-button">
        <v-icon name="hi-logout" class="icon" v-tooltip="`Log Out`" />
      </button>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  CoChatBubble,
  LaBoneSolid,
  IoHomeOutline,
  HiLogout,
  FaRegularEdit,
} from "oh-vue-icons/icons";

addIcons(LaBoneSolid, IoHomeOutline, CoChatBubble, FaRegularEdit, HiLogout);

export default {
  name: "AdoptersNavBar",
  components: {
    "v-icon": OhVueIcon,
  },
  mounted() {
    this.fetchUnreadChats();
  },
  data() {
    return {
      chatsUnread: 0,
    };
  },
  methods: {
    async fetchUnreadChats() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userUid = user.uid; // Get the current user's UID

        try {
          // Query chats where current user is in the participants array
          const chatsQuery = query(
            collection(db, "ChatRooms"),
            where("participants", "array-contains", userUid),
            where("hasRead", "==", false) // Filter for unread chats
          );

          // Fetch the query results
          const querySnapshot = await getDocs(chatsQuery);

          const unreadCount = querySnapshot.docs.filter((doc) => {
            const data = doc.data();
            return data.lastSenderAdopter !== userUid;
          }).length;

          this.chatsUnread = unreadCount;
          console.log(`Unread chats: ${this.chatsUnread}`);
        } catch (error) {
          console.error("Error fetching unread chats:", error);
        }
      } else {
        console.error("User not authenticated");
      }
    },

    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log("User signed out successfully.");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  },
};
</script>

<style scoped>
@import url("../assets/styles/font.css");

.overall {
  display: flex;
  align-items: center;
  width: 80px;
  flex-direction: column;
  height: 100vh;
  top: 0;
  left: 1em;
  z-index: 1000;
  position: fixed;
}

.logo {
  width: 4.5em;
  height: 4.5em;
  display: block;
}

.adopters-navbar {
  width: 80px;
  height: calc(95vh - 100px);
  background-color: #c9d0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 100px;
  left: 1em;
  border-radius: 20px;
}
.router-link-exact-active .icon {
  filter: brightness(1.4);
  opacity: 1;
}

.icon-button {
  all: unset;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
}

.icon {
  width: 30px;
  height: 30px;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: brightness(0.8);
  outline: none;
}

.icon2 {
  width: 35px;
  height: 35px;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: brightness(0.8);
  outline: none;
}

.icon-button:hover .icon {
  transform: scale(1.1);
}

.icon-button:hover .icon2 {
  transform: scale(1.1);
}

.spacer {
  flex-grow: 1;
}
</style>
