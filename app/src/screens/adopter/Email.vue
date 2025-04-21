<template>
  <div class="overall-container">
    <div class="navbar">
      <AdoptersNavBar />
    </div>
    <div class="content-container">
      <div class="email-container">
        <!-- Email List -->
        <aside class="email-list">
          <h2 class="inbox-header">Inbox 📫</h2>
          <ul>
            <li
              v-for="email in emails"
              :key="email.id"
              @click="selectEmail(email)"
              :class="{ active: email.id === selectedEmail?.id }"
            >
              <div class="email-list-header">
                <div class="email-sender-read">
                  <p class="email-sender">{{ email.senderId }}</p>
                  <span
                    v-if="email.isRead === false"
                    class="unread-indicator"
                  ></span>
                </div>
                <p class="email-time">{{ formatTimestamp(email.timestamp) }}</p>
              </div>
              <p class="email-subject">{{ email.subject }}</p>
              <p class="email-content">
                {{ formatContentInbox(email.content) }}
              </p>
            </li>
          </ul>
        </aside>

        <!-- Email Content -->
        <section class="email-detail" v-if="selectedEmail">
          <button class="back-button" @click="deselectEmail">
            Back to Inbox
          </button>
          <h2 class="selected-email-subject">{{ selectedEmail.subject }}</h2>
          <p class="selected-email-sender">{{ selectedEmail.senderId }}</p>
          <p class="selected-email-time">
            {{ formatTimestamp(selectedEmail.timestamp) }}
          </p>
          <hr />
          <p
            class="selected-email-content"
            v-html="formatContentSelected(selectedEmail.content)"
          ></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../../firebase/firebase.js";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  increment,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import AdoptersNavBar from "../../components/AdoptersNavBar.vue";

export default {
  components: {
    AdoptersNavBar,
  },
  data() {
    return {
      emails: [],
      selectedEmail: null,
      userId: null,
    };
  },
  mounted() {
    const auth = getAuth();
    if (auth.currentUser) {
      this.userId = auth.currentUser.uid;
    } else {
      console.error("No user is currently logged in.");
    }
    this.fetchEmails();
  },

  methods: {
    async fetchEmails() {
      try {
        const emailsRef = collection(db, "Emails");

        //im checking in my collection if any emails with the userId (this is an attribute in each document) exists
        const q = query(emailsRef, where("userId", "==", this.userId));

        const emailsSnapshot = await getDocs(q);
        this.emails = emailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched emails:", this.emails); // Debugging
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    },

    formatContentInbox(content) {
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    },

    selectEmail(email) {
      console.log("Selected email:", email);
      this.selectedEmail = email;

      if (!email.isRead) {
        updateDoc(doc(db, "Emails", email.id), {
          isRead: true,
        })
          .then(() => {
            console.log(`Email ${email.id} marked as read.`);
            this.selectedEmail.isRead = true; //update locally
            email.isRead = true;
          })
          .catch((error) => {
            console.error("Error updating email:", error);
          });
      }
    },

    deselectEmail() {
      this.selectedEmail = null;
    },

    formatTimestamp(date) {
      return new Date(date).toLocaleDateString();
    },

    formatContentSelected(content) {
      if (!content) return ""; // Handle empty content

      // Split the content into paragraphs based on double newlines
      const paragraphs = content.split(/\n\s*\n/); // Split by double newlines

      // For each paragraph, split into lines and wrap them in <p> and <br> tags
      return paragraphs
        .map((paragraph) => {
          const lines = paragraph.split(/\n/); // Split by single newlines
          return `<p>${lines
            .map((line) => {
              // Replace lines starting with '-' with a bullet point
              if (line.trim().startsWith("-")) {
                return `• ${line.trim().substring(1).trim()}`;
              }
              return line.trim();
            })
            .join("<br>")}</p>`;
        })
        .join(""); // Join all paragraphs
    },
  },
};
</script>

<style scoped>
@import url("../../assets/styles/font.css");

.content-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 2em;
}

.overall-container {
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

.email-container {
  display: flex;
  height: 90vh;
  width: 80vw;
  background-color: #ffffff;
  border-radius: 1em;
}

.email-list {
  width: 30%;
  border-right: 1px solid #ccc;
  padding: 0em 1em;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.email-sender-read {
  display: flex;
  align-items: center;
}

.inbox-header {
  font-size: 1.5em;
  padding: 0.8em;
  font-family: "FredokaOne-Regular";
  border-bottom: 1px solid #ccc;
  margin: 0;
}

.email-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -1em;
}
.email-sender {
  font-weight: bold;
  font-family: "Raleway-SemiBold";
  font-size: 0.9em;
}

.email-subject {
  font-weight: bold;
  color: #222f61;
  font-family: "Raleway-Medium";
  font-size: 0.9em;
}

.email-content {
  font-family: "Raleway-Regular";
  color: #7f7e83;
  font-size: 0.9em;
}

.email-time {
  color: #7f7e83;
  font-size: 0.8em;
  font-family: "Raleway-Regular";
}

.email-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.email-list li {
  padding: 0.8em;
  cursor: pointer;
  border-bottom: 1px solid #ddd; /* Add a border for better separation */
  transition: background 0.3s;
}

.email-list li:hover {
  background: #e6f0ff; /* Add a hover effect */
  border-radius: 0.3em;
}

.email-list li.active {
  background: #d3e3fd; /* Highlight the active email */
  border-radius: 0.3em;
}

.email-detail {
  flex: 1;
  padding: 1em;
  overflow: auto;
}

.navbar {
  padding-right: 5em;
  flex-shrink: 0;
  
}

.selected-email-subject {
  font-size: 1.5em;
  font-family: "FredokaOne-Regular";
  margin-bottom: 0.5em;
}
.selected-email-sender {
  font-weight: bold;
  font-family: "Raleway-SemiBold";
  font-size: 0.9em;
}
.selected-email-time {
  color: #7f7e83;
  font-size: 0.8em;
  font-family: "Raleway-Regular";
}

.selected-email-content {
  font-family: "Raleway-SemiBold";
  color: #7f7e83;
  font-size: 0.9em;
}

.header {
  font-family: "FredokaOne-Regular";
}

.unread-indicator {
  display: inline-block;
  width: 0.5em;
  height: 0.5em;
  background-color: #8c9de1; /* Blue color */
  border-radius: 50%; /* Make it a circle */
  margin-left: 0.5em; /* Add some spacing from the text */
}

.back-button {
  background-color: rgba(0, 0, 0, 0);
  font-family: "Raleway-Medium";
  color: #222f61;
  border-width: 0em;
  padding: 0em;
}

.header-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
}

@media (max-width: 1024px) {
  .email-container {
  display: flex;
  width: 80vw;
  height: 90vh;
  background-color: #ffffff;
  border-radius: 1em;
}
}
</style>
