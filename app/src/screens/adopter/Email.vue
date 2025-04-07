<template>
    <div class="overall-container">
        <h1 class="header">Your emails</h1>
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
                <div class = "email-list-header">
                    <div class="email-sender-read">
                        <p class="email-sender">{{ email.senderId }}</p>
                        <span v-if="email.isRead === false" class="unread-indicator"></span>
                    </div>
                    <p class="email-time">{{ formatTimestamp(email.timestamp) }}</p>
                </div>
                <p class="email-subject">{{ email.subject }}</p>
                <p class="email-content">{{ formatContentInbox(email.content) }}</p>
            </li>
            </ul>
        </aside>
    
        <!-- Email Content -->
        <section class="email-detail" v-if="selectedEmail">
            <button class="back-button" @click="deselectEmail">Back to Inbox</button>
            <h2 class="selected-email-subject">{{ selectedEmail.subject }}</h2>
            <p class="selected-email-sender">{{ selectedEmail.senderId }}</p>
            <p class="selected-email-time">{{ formatTimestamp(selectedEmail.timestamp) }}</p>
            <hr />
            <p class="selected-email-content" v-html="formatContentSelected(selectedEmail.content)"></p>
        </section>
        </div>
    </div>
    
</template>
  
<script>
import { db } from "../../../firebase/firebase.js";
import { collection, getDocs, query, where, increment, updateDoc, doc, getDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            emails: [],
            selectedEmail: null,
            userId: "testing",
            emailsUnread: 0,
        };    
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

        async fetchEmailsUnread() {
            try {
                const userDocRef = doc(db, "Users", this.userId);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    this.emailsUnread = userDocSnapshot.data().emailsUnread || 0;
                    console.log("Fetched emailsUnread:", this.emailsUnread);
                } else {
                    console.error("User document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching emailsUnread:", error);
            }
        },

        formatContentInbox(content) {
            return content.length > 100 ? content.substring(0, 100) + '...' : content;
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

                if (this.emailsUnread > 0){
                    updateDoc(doc(db, "Users", this.userId), {
                        emailsUnread: increment(-1),
                    })
                    .then(() => {
                        console.log("User's unread email count decremented.");
                    })
                    .catch((error) => {
                        console.error("Error updating user's unread email count:", error);
                    });
                }
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
        }
    },
    mounted() {
        this.fetchEmails();
        this.fetchEmailsUnread();
    },
}
</script>

<style scoped>
@import url("../../assets/styles/font.css");
.overall-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2em;
    background-color: #f7f3eb;
}
.email-container {
    display: flex;
    width: 60em;
    height: 38em;
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
    width: 85%;
    padding: 0.8em;
    text-align: center;
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
    font-family: 'Raleway-SemiBold';
    font-size: 0.9em;
}

.email-subject {
    font-weight: bold;
    color: #222f61;
    font-family: 'Raleway-Medium';
    font-size: 0.9em;
}

.email-content {
    font-family: 'Raleway-Regular';
    color: #7f7e83;
    font-size: 0.9em;
}

.email-time {
    color: #7f7e83;
    font-size: 0.8em;
    font-family: 'Raleway-Regular';
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
}

.email-detail {
    flex: 1;
    padding: 1em;
    overflow: auto;
}

.selected-email-subject {
    font-size: 1.5em;
    font-family: "FredokaOne-Regular";
    margin-bottom: 0.5em;
}
.selected-email-sender {
    font-weight: bold;
    font-family: 'Raleway-SemiBold';
    font-size: 0.9em;
}
.selected-email-time {
    color: #7f7e83;
    font-size: 0.8em;
    font-family: 'Raleway-Regular';
}

.selected-email-content {
    font-family: 'Raleway-SemiBold';
    color: #7f7e83;
    font-size: 0.9em;
}

.header {
    font-family: 'FredokaOne-Regular';
}

.unread-indicator {
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    background-color: #8C9DE1; /* Blue color */
    border-radius: 50%; /* Make it a circle */
    margin-left: 0.5em; /* Add some spacing from the text */
}

.back-button {
    background-color: rgba(0,0,0,0);
    font-family: 'Raleway-Medium';
    color: #222f61;
    border-width: 0em;
    padding: 0em;
}
</style>
  