<template>
    <div class="content">
        <div class="fixed-container">
            <img src="@/assets/images/PetProfileMockUp/ProfileImage.jpg" alt="ProfileImage" class="profile-img"/>
            <div class = "treat-button">
                <button class = "rectangular-button" @click="sendTreat":disabled="treatSent">
                    <p class="treat-button-text">🐾 Like this pet? <span class="treat-button-bolded-text">Send a treat!</span></p>
                </button>
                <button class= "circle-button" @click="sendTreat":disabled="treatSent">
                    <img src = "@/assets/images/PetProfileMockUp/TreatButton.png" alt="TreatButton" class="treat-img"/>
                </button>
            </div>
        </div>

        <div class="scrollable-container">
            <div class="pet-intro-header">
                <p class="header">My name is...</p>
                <p id="pet-name" class="pet-name">{{ petData.petName }}</p>
            </div>

            <div class="basic-info">
                <div class="age">
                    <img src = "@/assets/images/PetProfileMockUp/BirthdayIcon.png" alt="BirthdayIcon" class="icon"/>
                    <p id="pet-age" class="pet-age">{{ petData.petAge }}</p>
                </div>

                <div class="gender">
                    <img src = "@/assets/images/PetProfileMockUp/GenderIcon.png" alt="GenderIcon" class="icon"/>
                    <p id="pet-gender" class="pet-gender">{{ petData.petGender }}</p>
                </div>
            </div>

            <div class="info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/BreedIcon.png" alt="BreedIcon" class="icon"/>
                    <p class="info-header">Breed</p>
                </div>
                <p class="pet-breed">{{ petData.petBreed }}</p>
            </div>

            <div  v-if="(petData.petPersonalityTemperament && petData.petPersonalityTemperament.length) || (petData.petPersonalitySocialisation && petData.petPersonalitySocialisation.length)" class="info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/StarIcon.png" alt="StarIcon" class="icon"/>
                    <p class="info-header">Personality</p>
                </div>
                <div v-if="petData.petPersonalityTemperament && petData.petPersonalityTemperament.length" class="values">
                    <p class="subtitle">Temperament</p>
                    <p class="value" v-for="(item, index) in petData.petPersonalityTemperament" :key="index"> {{ item }}</p>
                </div>
                <div  v-if="petData.petPersonalitySocialisation && petData.petPersonalitySocialisation.length"class="values">
                    <p class="subtitle">Socialisation</p>
                    <p class="value" v-for="(item, index) in petData.petPersonalitySocialisation" :key="index"> {{ item }}</p>
                </div>
            </div>

            <div  v-if="(petData.petLifestyleActivity && petData.petLifestyleActivity.length) || (petData.petLifestyleTraining && petData.petLifestyleTraining.length)" class="info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/BallIcon.png" alt="BallIcon" class="icon"/>
                    <p class="info-header">Lifestyle</p>
                </div>
                <div  v-if="petData.petLifestyleActivity && petData.petLifestyleActivity.length"class="values">
                    <p class="subtitle">Activity level</p>
                    <p class="value">{{ petData.petLifestyleActivity }}</p>
                </div>
                <div  v-if="petData.petLifestyleTraining && petData.petLifestyleTraining.length"class="values">
                    <p class="subtitle">Training level</p>
                    <p class="value" v-for="(item, index) in petData.petLifestyleTraining" :key="index"> {{ item }}</p>
                </div>
            </div>

            <div class="info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/SyringeIcon.png" alt="SyringeIcon" class="icon"/>
                    <p class="info-header">Medical Information</p>
                </div>
                <div class="values">
                    <p class="subtitle">Weight</p>
                    <p class="value">{{ petData.petWeight }}</p>
                </div>
                <div class="values">
                    <p class="subtitle">Height</p>
                    <p class="value">{{ petData.petHeight }}</p>
                </div>
                <div  v-if="petData.petVax && petData.petVax.length"class="values">
                    <p class="subtitle">Vaccination status</p>
                    <p class="value" v-for="(item, index) in petData.petVax" :key="index"> {{ item }}</p>
                </div>
            </div>

            <div  v-if="(petData.petDiet && petData.petDiet.length) || (petData.petFavFood && petData.petFavFood.length) || (petData.petAllergies && petData.petAllergies.length)" class="info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/PetFoodIcon.png" alt="PetFoodIcon" class="icon"/>
                    <p class="info-header">Dietary Prefereces & Needs</p>
                </div>
                <div  v-if="petData.petDiet && petData.petDiet.length"class="values">
                    <p class="subtitle">Diet type</p>
                    <p class="value" v-for="(item, index) in petData.petDiet" :key="index"> {{ item }}</p>
                </div>
                <div  v-if="petData.petFavFood && petData.petFavFood.length"class="values">
                    <p class="subtitle">Favourite food or snacks</p>
                    <p class="value" v-for="(item, index) in petData.petFavFood" :key="index"> {{ item }}</p>
                </div>
                <div  v-if="petData.petAllergies && petData.petAllergies.length"class="values">
                    <p class="subtitle">Allergies</p>
                    <p class="value" v-for="(item, index) in petData.petAllergies" :key="index"> {{ item }}</p>
                </div>
            </div> 
            
            <div class="report-button">
                <button class = "red-button" @click="reportClick">
                    <img src = "@/assets/images/PetProfileMockUp/FlagIcon.png" alt="FlagIcon" class="icon"/>
                </button>
                <button class= "text-button" @click="reportClick">
                    <p class="report-text">Report</p>
                </button>
            </div>

        </div>
        <div class="report-background" v-if="reportButtonClicked">
            <div class="report-modal">
                <p class="report-header">Report this listing? 🚩</p>
                <p class="report-subtitle"> Please report this listing only if you believe it violates our community guidelines. Unnecessary reports can delay our response to genuine concerns. Thank you for helping us maintain a safe and trustworthy community.</p>
                <button class="continue-button" @click="goToReport">
                    <p class="continue-text">Continue</p>
                </button>
                <button class="cancel-button" @click="reportUnclick">
                    <p class="cancel-text">Cancel</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import { db } from "../../../firebase/firebase.js";
import { getDoc, doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      petData: {},
      treatSent: false,
      treatStatus: "pending",
      reportButtonClicked: false,
      adopterId: null,
      petListingId: null,
      listerId: null,
    };
  },

  setup() {
    const router = useRouter();
    const petListingId =
      router.currentRoute.value.state?.petListingId ||
      localStorage.getItem("currentPetId");
    if (!petListingId) {
      console.error("No pet listing ID provided");
      router.push("/home"); // Redirect to marketplace if no ID is provided
      return;
    }
  },

  beforeUnmount() {
    localStorage.removeItem("currentPetId"); // Remove petListingId from localStorage
  },

  created() {
    // Retrieve petListingId from query parameters
    this.petListingId = localStorage.getItem("currentPetId");

    if (!this.petListingId) {
      console.error("No pet listing ID provided");
      this.$router.push("/home"); // Redirect to marketplace if no ID is provided
      return;
    }

    this.display();
  },

  beforeUnmount() {
    // Clean up localStorage when leaving the page
    localStorage.removeItem("currentPetId");
  },

  methods: {
    async display() {
      /* so the logic is from marketplace page, when a user clicks on a listing,
            it will lead to this page, hence must send the pet listing id to this page
            */

      /* get user id here */
      const auth = getAuth();
      if (auth.currentUser) {
        this.adopterId = auth.currentUser.uid;
      } else {
        console.error("No user is currently logged in.");
      }
      /* get pet listing id here */

      const petDocRef = doc(db, "Pet_Listings", this.petListingId);

      /* get the doc with the pet listing id here */
      try {
        const docSnap = await getDoc(petDocRef);
        console.log("Fetching document:", this.petListingId);

        if (docSnap.exists) {
          console.log("Document data:", docSnap.data());
          /* grab the pet details here */
          this.petData = docSnap.data();
          this.listerId = this.petData.userID;

          console.log("Document data:", docSnap.data());

          if (this.petData.users.includes(this.adopterId)) {
            this.treatSent = true;
            console.log("Treat already sent to pet listing!");
            return;
          }

          const chatRoomQuery = query(
            collection(db, "ChatRooms"),
            where("petListingId", "==", this.petListingId),
            where("adopterId", "==", this.adopterId),
            where("listerId", "==", this.listerId)
          );

          const chatRoomSnap = await getDocs(chatRoomQuery);
          if (chatRoomSnap.empty) {
            console.log("No chat room found");
            return;
          } else {
            /* Check if treat status is pending */
            if (this.petData.treatStatus == "pending") {
              this.treatStatus = "pending";
              console.log("Treat is on its way!");
            } else if (this.petData.treatStatus == "accepted") {
              this.treatStatus = "accepted";
              console.log("Accepted treat status!");
            } else if (this.petData.treatStatus == "rejected") {
              this.treatStatus = "rejected";
              console.log("Rejected treat status!");
            } else {
              console.log("No treat status found");
            }
          }
        } else {
          console.log("No such pet in firebase");
        }
      } catch (error) {
        console.log("Error fetching pet listing", error);
      }
    },

    async createChatRoom(petListingId, adopterId, listerId) {
      const chatRoomsCollectionRef = collection(db, "ChatRooms");

      /* create chat room here */
      try {
        const chatRoomDocRef = await addDoc(chatRoomsCollectionRef, {
          petListingId: petListingId,
          participants: [adopterId, listerId],
          latestTimeAdopter: new Date(),
          latestTimeLister: new Date(),
          latestMessageLister: `Say hi to get things started! ${this.petData.petName} is waiting for your message so the lister can respond to your treat! 💬`,
          latestMessageAdopter: `Paw-some! ${this.ad} sent a treat for ${this.petData.petName}. 🦴 Say hi to see if it’s a match! ✨`,
          treatStatus: "pending"
        });
        console.log("Chat room successfully created!");

        const messagesRef = collection(chatRoomDocRef, "messages");

        await addDoc(messagesRef, {
          from: "admin",
          to: adopterId,
          content: `Say hi to get things started! ${this.petData.petName} is waiting for your message so the lister can respond to your treat! 💬`,
          timestamp: new Date(),
        });

        await addDoc(messagesRef, {
          from: "admin",
          to: listerId,
          content: `Paw-some! Someone sent a treat for ${this.petData.petName} 🦴✨ Say hi to see if it’s a match! ✨`,
          timestamp: new Date(),
        });
        console.log("Initial message added to the message subcollection");
      } catch (error) {
        console.log("Error creating chat room", error);
      }
    },

    async sendTreat() {
      /* get pet listing id here */
      let petListingId =
        "testing"; /* this will be changed once marketplace set up a fn to send the listing id to here */
      const petDocRef = doc(db, "Pet_Listings", petListingId);

      /* get the doc with the pet listing id here */
      try {
        if (this.treatSent) {
          /* get user id here, change when got actual user alrd*/
          console.log("Treat already sent to pet listing!");
          return;
        } else {
          await updateDoc(petDocRef, {
            numTreats: increment(1),
            users: arrayUnion(this.adopterId),
          });
          this.treatSent = true;
          console.log("Treat successfully sent to pet listing!");

          await this.createChatRoom(
            petListingId,
            this.adopterId,
            this.listerId
          );
        }
      } catch (error) {
        console.log("Error sending treat", error);
      }
    },

    reportClick() {
      this.reportButtonClicked = true;
      console.log("Report button clicked");
    },

    reportUnclick() {
      this.reportButtonClicked = false;
        },

        goToReport() {
            const petListingId = "testing"; /* this will be changed once marketplace set up a fn to send the listing id to here */  
            const userId = 'testing';
            this.router.push(`/report/${petListingId}/${userId}`); //to transport the userId to report
            console.log("Navigating to report page:", petListingId, userId);

        }
    }
}

</script>

<style scoped>
@import url("../../assets/styles/font.css");

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.fixed-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25em;
    margin-top: 3.125em;
    position: fixed;
    height: 100%;
    top: 0;
    left: 10%;

}

.scrollable-container {
    padding: 2em;
    overflow-y: auto; /*for scrolling*/
    flex-grow: 1;
    margin-left: 50%;
    width: 80%;
}

/* if width too small, then pic can become scrollable*/
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
    }

    .fixed-container {
        display: flex;
        flex-direction: column;
        margin-top: 3.125em;
        height: 100%;
        top: 0;
        left: 0;
        position: relative;
        height: auto;
        margin-bottom: 2em;
    }
    .scrollable-container {
        margin-top: -3em;
        padding: 2em;
        overflow-y: auto; /*for scrolling*/
        flex-grow: 1;
        margin-left: 0%;
        
    }
}


.profile-img {
    width: 25em;
    height: 31.25em;
    border-radius: 3.125em;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.circle-button {
    background-color: #8C9DE1;
    border-width: 0em;
    width: 6.25em;
    height: 6.25em;
    border-radius: 3em;
    display: flex;
    justify-content: center;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.basic-info {
    display: flex;
    gap: 2em;
    margin-top: 1.25em;
}

treat-img {
    align-self: center;
}

.rectangular-button {
    background-color: #8C9DE1;
    border-width: 0em;
    font-family: 'Raleway-Medium';
    font-size: 1em;
    padding-left: 3em;
    width: 12em;
    height: 4em;
    margin-right: -13.75em;
    border-radius: 1em;
    display: flex;
    align-items: center;
}

.circle-button:hover, .rectangular-button:hover {
    cursor: pointer;
}

.treat-button {
    display: flex;
    align-items: center;
    margin-right: 6.875em;
}

.treat-button-bolded-text {
    font-family: 'Raleway-SemiBold';
}

.header {
    font-family: 'FredokaOne-Regular';
    color: #696969;
    font-size: 2em;
}

.pet-name {
    font-family: 'FredokaOne-Regular';
    color: #000000;
    font-size: 3em;
    margin-top: 4em;
}

.pet-intro-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0em;
    margin-bottom: -2em;
}

.age, .gender, .subheader{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;

}

.pet-age, .pet-gender {
    font-family: 'Raleway-SemiBold';
    font-size: 1em;
}

.icon {
    width: 1.5em;
    height: 1.5em;
}

.info-header {
    font-family: 'Raleway-SemiBold';
}

.subheader {
    margin-bottom: -0.75em;
}

.subtitle {
    font-family: 'Raleway-Medium';
    margin: 0em;
    align-self: center;
}

.red-button {
    width: 4em;
    height: 4em;
    background-color: #DD595B;
    border-width: 0em;
    border-radius: 2em;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease-in-out, transform 0.4s ease-in-out;
}

.report-button {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.red-button:hover {
    background-color: rgb(218, 112, 113);
    transform: scale(1.2);
    transition: background-color 0.3s ease-in-out, transform 0.4s ease-in-out;
}

.report-text {
    font-family: 'Raleway-Bold';
    font-size: 1em;
    color: #DD595B;
}

.text-button {
    border-width: 0em;
    background-color: rgba(0,0,0,0);
}

.text-button:hover, .red-button:hover {
    cursor: pointer;
}

.values {
    display: flex;
    align-items: center;
    gap: 0.5em;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
}


.value {
    background-color: #8C9DE1;
    border-radius: 1.5em;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    font-family: 'Raleway-SemiBold';
    color: #ffffff;
    font-size: 1em;
    margin: 0em;
}

.pet-breed {
    font-family: 'Raleway-Medium';
    margin-left: 2em;
}

.info {
    margin-bottom: 2em;
}

.report-background {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.report-modal {
    background-color: #ffffff;
    width: 45em;
    height: 27em;
    border-radius: 1.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.report-header {
    font-family: 'FredokaOne-Regular';
    font-size: 2em;
    color: #696868;
    margin: 0em;
}

.report-subtitle {
    font-family: 'Raleway-Regular';
    font-size: 1em;
    color: #000000;
    text-align: center;
    padding: 0 9em;
}

.continue-button{
    background-color: #8C9DE1;
    border-width: 0em;
    border-radius: 1em;
    width: 15em;
    height: 3em;
    margin: 1em;
    align-items: center;
    justify-content: center;
    display: flex;
    cursor: pointer;
}

.continue-button:hover {
    background-color: #c3cef9;
    transition: background-color 0.3s ease-in-out;
}

.continue-text {
    font-family: 'Raleway-Bold';
    font-size: 1.25em;
    color: #ffffff;
}

.cancel-button {
    background-color: rgba(0,0,0,0);
    border-width: 0em;
    font-family: 'Raleway-Regular';
    margin-top: -1.5em;
    cursor: pointer;
}

</style>