<template>
    <div class="content">
        <div class="fixed-container">
            <img src="@/assets/images/PetProfileMockUp/ProfileImage.jpg" alt="ProfileImage" class="profile-img"/>
            <div class = "treat-button">
                <button class = "rectangular-button">
                    <p class="treat-button-text">🐾 Like this pet? <span class="treat-button-bolded-text">Send a treat!</span></p>
                </button>
                <button class= "circle-button">
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
                <button class = "red-button">
                    <img src = "@/assets/images/PetProfileMockUp/FlagIcon.png" alt="FlagIcon" class="icon"/>
                </button>
                <button class= "text-button">
                    <p class="report-text">Report</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import { db } from "../../../firebase/firebase.js";
import { getDoc, doc } from "firebase/firestore";

export default {
    data() {
        return {
        petData: {}
        };
    },

    mounted() {
        this.display();
    },

    methods: {

        async display() {
            /* so the logic is from marketplace page, when a user clicks on a listing,
            it will lead to this page, hence must send the pet listing id to this page
            */

            /* get pet listing id here */
            let petListingId = "testing"; /* this will be changed once marketplace set up a fn to send the listing id to here */
            
            const petDocRef = doc(db, "Pet_Listings", petListingId);

            /* get the doc with the pet listing id here */
            try {
                const docSnap = await getDoc(petDocRef);
                console.log("Fetching document:", petListingId);

                if (docSnap.exists) {
                    console.log("Document data:", docSnap.data());
                    /* grab the pet details here */
                    this.petData = docSnap.data();
                    console.log("Document data:", docSnap.data());
                } else {
                    console.log("No such pet in firebase")
                }
            } catch (error) {
                console.log("Error fetching pet listing", error);
            }
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

.pet-gender {
    color: blue;
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
}

.report-button {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

</style>