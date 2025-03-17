<template>
  <div class="onboarding-container">
    <div v-if="currentStep < questions.length">
      <div class="question-container">
        <img
          src="../../assets/images/onboardingQn/onboardingRat.png"
          alt="Pet Image"
          class="pet-image"
        />
        <div class="question-text">
          <h2>{{ currentQuestion.question }}</h2>
          <!-- Multiple Choice -->
          <div
            class="multiple-reponse"
            v-if="currentQuestion.type === 'multiple'"
          >
            <label
              v-for="option in currentQuestion.options"
              :key="option"
              class="option-label"
            >
              <input
                type="checkbox"
                :value="option"
                v-model="selectedOptions"
                @change="handleOptionChange(option)"
              />
              {{ option }}
            </label>
            <!-- Show textbox if "Other" is selected -->
            <div class="other-box" v-if="showOtherInput">
              <input
                type="text"
                v-model="otherInputValue"
                placeholder="Please specify"
                class="text-input"
              />
            </div>
          </div>

          <!-- Single Choice -->
          <div v-else-if="currentQuestion.type === 'single'">
            <label
              v-for="option in currentQuestion.options"
              :key="option"
              class="option-label"
            >
              <input type="radio" :value="option" v-model="selectedOptions" />
              {{ option }}
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

    <div v-else>
      <h2>Thank you for completing the onboarding!</h2>
    </div>
  </div>
</template>

<script>
import { db } from "../../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onboardingQuestions } from "./onboardingQuestions";

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
      currentStep: 0,
      selectedOptions: [],
      questions: onboardingQuestions,
      userId: null,
      responses: {}, // Initialize the responses object
      showOtherInput: false, // Track whether "Other" is selected
      otherInputValue: "", // Store the value entered in the "Other" textbox
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentStep];
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
    async nextQuestion() {
      const currentKey = this.currentQuestion.key;

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
        const docData = {
          ...this.responses,
          timestamp: new Date(),
          user_id: this.userId, // You need to implement user auth
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
      } catch (error) {
        console.error("Error saving responses:", error);
      }
    },
  },
};
</script>

<style scoped>
.onboarding-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.question-container {
  width: 80%;
  display: flex;
  align-items: center;
  gap: 40px;
}

.pet-image {
  width: 400px;
  height: 300px;
  object-fit: 90%;
  object-position: center;
}

.question-text {
  text-align: center;
}

h2 {
  font-size: 36px;
  margin-bottom: 20px;
  font-family: "Fredoka One", cursive;
}

.option-label {
  font-family: "Poppins", sans-serif;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 10px;
}

.text-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  margin-top: 10px;
  font-family: "Poppins", sans-serif;
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
  font-family: "Poppins", sans-serif;
}

.next-button:hover {
  background-color: #0e2233;
}
</style>
