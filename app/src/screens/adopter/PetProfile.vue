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
                <p id="pet-name" class="pet-name">Goldie</p>
            </div>

            <div class="basic-info">
                <div class="age">
                    <img src = "@/assets/images/PetProfileMockUp/BirthdayIcon.png" alt="BirthdayIcon" class="icon"/>
                    <p id="pet-age" class="pet-age">4.5</p>
                </div>

                <div class="gender">
                    <img src = "@/assets/images/PetProfileMockUp/GenderIcon.png" alt="GenderIcon" class="icon"/>
                    <p id="pet-gender" class="pet-gender">M</p>
                </div>
            </div>

            <div class="breed-info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/BreedIcon.png" alt="BreedIcon" class="icon"/>
                    <p class="info-header">Breed</p>
                </div>
                <p class="subtitle">Golden Retriever</p>
            </div>

            <div class="personality-info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/StarIcon.png" alt="StarIcon" class="icon"/>
                    <p class="info-header">Personality</p>
                </div>
                <div class="values">
                    <p class="subtitle">Temperament</p>
                </div>
                <div class="values">
                    <p class="subtitle">Socialisation</p>
                </div>
            </div>

            <div class="lifestyle-info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/BallIcon.png" alt="BallIcon" class="icon"/>
                    <p class="info-header">Lifestyle</p>
                </div>
                <div class="values">
                    <p class="subtitle">Activity level</p>
                </div>
                <div class="values">
                    <p class="subtitle">Training level</p>
                </div>
            </div>

            <div class="medical-info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/SyringeIcon.png" alt="SyringeIcon" class="icon"/>
                    <p class="info-header">Medical Information</p>
                </div>
                <div class="values">
                    <p class="subtitle">Weight</p>
                </div>
                <div class="values">
                    <p class="subtitle">Height</p>
                </div>
            </div>

            <div class="diet-info">
                <div class="subheader">
                    <img src = "@/assets/images/PetProfileMockUp/PetFoodIcon.png" alt="PetFoodIcon" class="icon"/>
                    <p class="info-header">Dietary Prefereces & Needs</p>
                </div>
                <div class="values">
                    <p class="subtitle">Diet type</p>
                </div>
                <div class="values">
                    <p class="subtitle">Favourite food or snacks</p>
                </div>
                <div class="values">
                    <p class="subtitle">Allergies</p>
                </div>
            </div>   
        </div>
    </div>
    
    


</template>

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
    left: 10em;
}

.scrollable-container {
    padding: 5em;
    overflow-y: auto; /*for scrolling*/
    flex-grow: 1;
    margin-left: 50%;
}

/* if width too small, then pic can become scrollable*/
@media (max-width: 1024px) {
    .fixed-container {
        position: relative;
        height: auto;
        margin-bottom: 2em;
    }
    .content {
        flex-direction: column;
    }

    .fixed-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.25em;
        margin-top: 3.125em;
        height: 100%;
        top: 0;
        left: 0;
    }
    .scrollable-container {
        margin-top: -5em;
        padding: 5em;
        overflow-y: auto; /*for scrolling*/
        flex-grow: 1;
        margin-left: 0%;
    }
}


.profile-img {
    width: 25em;
    height: 31.25em;
    border-radius: 3.125em;
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
    padding-left: 2em;
}

.pet-name {
    font-family: 'FredokaOne-Regular';
    color: #000000;
    font-size: 3em;
    padding-left: 5em;
    margin-top: -0.5em;
}

.pet-intro-header {
    align-items: center;
    margin-left: 0em;
}

.age, .gender, .subheader{
    display: flex;
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

.values {
    display: flex;
}

.subtitle {
    font-family: 'Raleway-Medium';
    margin-left: 2em;
}

</style>