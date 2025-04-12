<template>
  <div class="overall">
    <Logo />
    <div class="onboarding-container">
      <div class="question-image-container" v-if="currentStep < questions.length">
        <div class="question-container">
          <img
            :src="currentQuestion.image"
            alt="Pet Image"
            class="pet-image"
          />
          <div class="question-text">
            <h2 class="question">{{ currentQuestion.question }}</h2>
            <!-- Multiple Choice -->
            <div
              class="multiple-response"
              v-if="currentQuestion.type === 'multiple'"
            >
              <label
                v-for="option in currentQuestion.options"
                :key="option"
                class="option-label"
              >
                <input
                  class="checkbox-input"
                  type="checkbox"
                  :value="option"
                  v-model="selectedOptions"
                  @change="handleOptionChange(option)"
                />
                {{ option }}
              </label>
              <!-- Show textbox if "Other" is selected -->
              <!-- Only activated when "showOtherInput" function is true -->
              <!-- i.e. to say user clicked "Other" -->
              <div class="other-box" v-if="showOtherInput">
                <input
                  type="text"
                  v-model="otherInputValue"
                  placeholder="Please specify"
                  class="text-input"
                />
              </div>
              <!-- ################ end of textbox ################### -->
            </div>

            <!-- Single Choice -->
            <div v-else-if="currentQuestion.type === 'single'">
              <label
                v-for="option in currentQuestion.options"
                :key="option"
                class="option-label"
              >
                <input type="radio" class="radio-input" :value="option" v-model="selectedOptions" />
                <!-- radio button: only one radio button in the group can be selected at once -->
                {{ option }}
                <!-- Displays the LABEL of radio button -->
              </label>
            </div>

            <!-- Text Input -->
            <div v-else-if="currentQuestion.type === 'text'">
              <input
                type="text"
                v-model="textInput"
                placeholder="Type your answer here"
                class="text-input"
              />
            </div>
            <button @click="nextQuestion" class="next-button">
              {{ currentStep < questions.length - 1 ? "Next" : "Submit" }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="final">
        <h2>Thank you for completing the onboarding!</h2>
        <p class="subtitle">You’re officially part of the Pawfect Home family! Your journey starts here. Let’s make some tails (and hearts) wag.</p>
        <img
          src="@/assets/images/onboardingQn/onboardingComplete.png"
          alt = "Pet Image"
          class="final-image"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onboardingQuestions } from "./onboardingQuestions";
import { getAuth } from "firebase/auth";
import Logo from "../../components/Logo.vue";
/* FYI
... is a spread operator. When used with arrays, 
the spread operator expands the elements of the array into individual elements

eg.
const arr1 = ["you", "are", "gay"];
const arr2 = [...arr1, 4, 5]; // Expands arr1 into its elements
console.log(arr2); Output: ["you", "are", "gay", 4, 5]

*/
export default {
  data() {
    return {
      // Initialize everything
      currentStep: 0,
      selectedOptions: [], // v-model will two-way binding and update this for everytime the user clicks on their options
      questions: onboardingQuestions,
      userId: null,
      responses: {}, // Initialize the responses object
      showOtherInput: false, // Track whether "Other" is selected
      otherInputValue: "", // Store the value entered in the "Other" textbox
    };
  },

  components: {
    Logo
  },

  computed: {
    currentQuestion() {
      return this.questions[this.currentStep]; // Sieve out the questions in JSON format from the onboardingQuestion.js
      // onboardingQuestions[qn_num] to get current qn
    },
  },
  methods: {
    handleOptionChange(option) {
      // Check if "Other" is selected
      if (option === "Other") {
        this.showOtherInput = this.selectedOptions.includes("Other");
      } else {
        // If "Other" is deselected, reset the textbox
        if (!this.selectedOptions.includes("Other")) {
          this.showOtherInput = false;
          this.otherInputValue = "";
        }
      }
    },
    goToNextPage() {
      this.$router.push("/home");
    },
    async nextQuestion() {
      const currentKey = this.currentQuestion.key; // this question key matches the firestore's

      // Validation for multiple-choice questions
      if (this.currentQuestion.type === "multiple") {
        if (this.selectedOptions.length === 0) {
          alert("Please select at least one option before proceeding.");
          return; // Stop further execution
        }
        // If "Other" is selected, ensure the textbox is filled
        if (
          this.selectedOptions.includes("Other") &&
          !this.otherInputValue.trim()
        ) {
          alert("Please specify your selection for 'Other'.");
          return;
        }
        this.responses[currentKey] = [...this.selectedOptions];
        if (this.selectedOptions.includes("Other")) {
          this.responses[currentKey].push(this.otherInputValue);
        }
      }

      // Validation for single-choice questions
      else if (this.currentQuestion.type === "single") {
        if (!this.selectedOptions[0]) {
          alert("Please select an option before proceeding.");
          return;
        }
        this.responses[currentKey] = this.selectedOptions[0];
      }

      // Validation for text input questions
      else if (this.currentQuestion.type === "text") {
        if (!this.textInput.trim()) {
          alert("Please provide an answer before proceeding.");
          return;
        }
        this.responses[currentKey] = this.textInput;
        this.textInput = ""; // Clear the text input after saving
      }

      // Reset states for the next question
      this.selectedOptions = [];
      this.showOtherInput = false;
      this.otherInputValue = "";

      this.selectedOptions = [];

      if (this.currentStep < this.questions.length - 1) {
        this.currentStep++;
      } else {
        await this.submitResponses();
      }
    },
    async submitResponses() {
      try {
        // Create document structure matching your Firestore
        const auth = getAuth();

        const user = auth.currentUser;

        if (user) {
          console.log("User ID:", user.uid);
        } else {
          console.log("No user is signed in.");
          return;
        }
        const docData = {
          ...this.responses,
          /* eg.
          {
            preferred_species: "Dog",
            previous_experience: "Some experience",
            age_preference: "Adult",
            restrictions: "No allergies"
          }
          */
          timestamp: new Date(),
          user_id: user ? user.uid : null, // Check if user exists. if it does, assign user.uid (document id) to user_id. null if not authenticated
        };

        // ###### SAVE MY LAST ANSWER BEFORE SUBMITTING #######
        const currentKey = this.currentQuestion.key;

        // For single-select questions, store as single value
        if (this.currentQuestion.type === "single") {
          this.responses[currentKey] = this.selectedOptions[0];
        } else if (this.currentQuestion.type === "multiple") {
          this.responses[currentKey] = [...this.selectedOptions];
        } else {
          // For text input questions, save the text input value
          this.responses[currentKey] = this.textInput;
          this.textInput = ""; // Clear the text input after saving
        }
        this.selectedOptions = [];

        await addDoc(collection(db, "Adopter_Onboarding"), docData);
        console.log("Responses saved successfully!");
        this.currentStep++; // Move to completion screen
        setTimeout(() => {
          this.goToNextPage();
        }, 3000);
      } catch (error) {
        console.error("Error saving responses:", error);
      }
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/font.css";

.question-image-container {
  align-items: center;
  display: flex;
  justify-content: center;
}

.onboarding-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  gap: 5em;
}

.question-container {
  width: 80%;
  display: flex;
  align-items: center;
  gap: 40px;
}

.pet-image {
  width: 40em;
  height: auto;
  margin-top: -5em;
}

.question-text {
  text-align: center;
}

h2 {
  font-size: 36px;
  margin-bottom: 20px;
  font-family: FredokaOne-Regular;
}

.question {
  text-align: left;
}

.multiple-response {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.option-label {
  font-family: Poppins-Regular;
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 10px;
  gap: 10px;
}

.checkbox-input {
  appearance: none; /* Remove default browser styles */
  width: 20px; /* Set the size of the circle */
  height: 20px;
  border: 1px solid #222F61;
  border-radius: 20%;
  outline: none;
  cursor: pointer;
  position: relative;
}

.radio-input {
  appearance: none;
  width: 18px; /* Set the size of the circle */
  height: 18px;
  border: 1px solid #222F61;
  border-radius: 100%;
  outline: none;
  cursor: pointer;
  position: relative;
}

.checkbox-input:checked {
  background-color: #222F61;
}

.radio-input:checked {
  border-color: #222F61; 
}

.radio-input:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%; 
  width: 12px; 
  height: 12px;
  background-color: #222f61;
  border-radius: 50%; 
  transform: translate(-50%, -50%);
}

.checkbox-input:after {
  content: "";
  position: absolute;
  top: 2px; 
  left: 5px;
  width: 5px;
  height: 10px;
  border: solid #f7f3eb;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.text-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-top: 10px;
  font-family: Raleway-Regular
}

.text-input:focus {
  outline: none;
}

.next-button {
  background-color: #1a374d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  align-self: right;
  font-family: Poppins-Regular;
}

.next-button:hover {
  background-color: #0e2233;
}

.subtitle {
  font-family: Raleway-Medium;
  font-size: 1.5em;
}

.final-image {
  width: 50em;
  height: auto;
}

.final {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1024px) {
  .question-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
