<template>
    <div class="content">
        <h1 class="header">Reason for reporting 🐾</h1>

        <div v-for="(option, index) in options" :key="index" class="option-item">
            <input
                type="radio"
                class="radio-button"
                :value="option"
                v-model="selectedOption"
                name="reportReason"
            />
            <label class="label">{{ option }}</label>
        </div>

        <img src = "@/assets/images/report/PoliceDog.png" alt="PoliceDog" class="police-img"/>

        <p class="subtitle">Tell us a little more.</p>

        <div class="input-container">
            <textarea
                class="input-field"
                type="text"
                id="reason"
                v-model="reason"
                placeholder="Let us know so that we can build a safe community in Pawfect Home. 🐾"
            ></textarea>
        </div>

        <p><button class="submit-button" @click="sendReport">Submit</button></p>
        <p><button class="cancel-button" @click="cancel">Cancel</button></p>

        <div class="alert-background" v-if="alertEnabled">
            <div class="alert-modal">
                <p class="alert-header">Thank You for Helping Us Keep Pawfect Home Safe! 💙</p>
                <p class="alert-subtitle">We’ve received your report and will review it as soon as possible. Your efforts make a big difference in keeping our community a secure and trustworthy place for everyone.</p>
                <button class="next-button" @click="goToMarketplace">
                    <p class="next-text">Next</p>
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
            options: [
                "Fake profile",
                "Scammer",
                "Illegal content",
                "Others"
            ],
            selectedOption: "",
            reason: "",
            petListingId: "",
            userId: "",
            alertEnabled: false,
        };
    },

    setup() {
        const router = useRouter();
        return { router };
    },

    mounted() {
        this.petListingId = this.$route.params.petListingId;
        this.userId = this.$route.params.userId;
        console.log("Pet Listing ID:", this.petListingId);
        console.log("User ID:", this.userId);
    },

    methods: {
        async sendReport() {
            const petListingId = this.petListingId;
            const userId = this.userId;
            const petDocRef = doc(db, "Reports", petListingId);
            const petListingsRef = doc(db, "Pet_Listings", petListingId);
            const userDocRef = doc(db, "Users", userId);
            
            if (!this.selectedOption) {
                alert("Please select a reason for reporting.");
                return;
            }
            if (!this.reason) {
                alert("Please provide an explanation.");
                return;
            }
            if (this.selectedOption === "Others" && this.reason.length < 10) {
                alert("Please provide a more detailed explanation.");
                return;
            }
            if (this.reason.length > 500) {
                alert("Please provide a shorter explanation.");
                return;
            }

            try {
                const petListingDoc = await getDoc(petListingsRef);
                console.log("Pet Listing Document:", petListingDoc.data());
                
                const petListingData = petListingDoc.data();
                if (!petListingDoc.exists()) {
                    console.log("Pet listing does not exist.");
                    alert("This pet listing does not exist.");
                    return;
                }

                if (petListingData.userReports.includes(userId)) {
                    alert("You have already reported this pet listing.");
                    return;
                }

                const reportData = {
                    selectedOption: this.selectedOption,
                    explanation: this.reason,
                    userId: userId
                };

                /* get the doc with the pet listing id here */
                await updateDoc(petDocRef, {
                    users: arrayUnion(reportData),
                });

                await updateDoc(petListingsRef, {
                    userReports: arrayUnion(userId),
                });

                await updateDoc(userDocRef, {
                    reportedPets: arrayUnion(petListingId),
                });

                console.log("Report successfully sent to pet listing");
                this.alertEnabled=true;
            } catch (error) {
                console.log("Error sending report", error);
                alert("Oops! We have difficulties sending the report. Please try again later.");
            }
        },

        goToMarketplace() {
            this.router.push(`/home/${this.userId}`); //to transport the userId to marketplace
        }
    }
}

</script>

<style scoped>
@import url("../../assets/styles/font.css");

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
    min-height: 100vh;
    padding: 1em;
    box-sizing: border-box;
}

.header {
    font-family: 'FredokaOne-Regular';
    color: #222F61;
    text-align: center;
}

.option-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 10px 0;
    width: 8em;
}

.radio-button {
    color: #222F61;
    background-color: rgba(0,0,0,0);
}

.label {
    font-family: 'Raleway-Regular';
    font-size: 1em;
}

.subtitle {
    font-family: 'Raleway-SemiBold';
    font-size: 1em;
    margin-top: 20px;
    color: #222F61;
}

.input-container {
    display: flex;
}

.input-field {
    height: 11em;
    width: 40em;
    border-radius: 1.5em;
    border-width: 0em;
    font-family: 'Raleway-SemiBold';
    text-align: left;
    vertical-align: top;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    resize: none;
    padding: 1em;
}

.submit-button {
    margin-top: 20px;
    font-family: "Raleway-Bold";
    font-size: 16px;
    width: 144px;
    height: 50px;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #222f61;
    color: #f7f3eb;
    border-width: 0px;
}

.submit-button:hover{
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

.cancel-button {
    background-color: rgba(0,0,0,0);
    border-width: 0px;
    font-family: "Raleway-Medium";
    cursor: pointer;
}

.police-img {
    height: 40em;
    width: 40em;
    position: absolute;
    margin-right: -40em;
    margin-bottom: 4em;
    z-index: -1;
}

.alert-background {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.alert-modal {
    background-color: #ffffff;
    width: 45em;
    height: 27em;
    border-radius: 1.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.alert-header {
    font-family: 'FredokaOne-Regular';
    font-size: 2em;
    color: #696868;
    padding: 0 4em;
    text-align: center;
}

.alert-subtitle {
    font-family: 'Raleway-Regular';
    font-size: 1em;
    color: #000000;
    text-align: center;
    padding: 0 9em;
}

.next-button{
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

.next-button:hover {
    background-color: #c3cef9;
    transition: background-color 0.3s ease-in-out;
}

.next-text {
    font-family: 'Raleway-Bold';
    font-size: 1.25em;
    color: #ffffff;
}

</style>