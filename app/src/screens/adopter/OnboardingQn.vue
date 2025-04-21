<template>
  <div class="overall">
    <Logo />
    <div class="onboarding-container">
      <div
        class="question-image-container"
        v-if="currentStep < questions.length"
      >
        <div class="question-container">
          <img :src="currentQuestion.image" alt="Pet Image" class="pet-image" />
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
                <input
                  type="radio"
                  class="radio-input"
                  :value="option"
                  v-model="selectedOptions"
                />
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

            <!-- File Upload -->
            <div
              class="overall-question-container"
              v-else-if="currentQuestion.type === 'file-upload'"
            >
              <div class="upload-info">
                <label class="upload-label"
                  >Upload your pet ownership course certificate</label
                >
                <div
                  className="upload-certificate-error"
                  v-if="!selectedFileName"
                  class="upload-description"
                >
                  <br />
                  To adopt a dog or cat, you must first upload your pet
                  ownership course certificate.
                </div>
              </div>
              <div
                class="file-upload-box"
                @dragover.prevent
                @dragenter.prevent
                @drop.prevent="handleFileDrop"
              >
                <img
                  src="@/assets/images/editprofile/exportlogo.png"
                  alt="Export Logo"
                  class="exportlogo"
                />
                <p className="drop-message">
                  Select your file or drag and drop
                </p>
                <small className="drop-message"
                  >png, pdf, jpg, docx accepted <br />
                </small>
                <input
                  type="file"
                  ref="fileInput"
                  accept=".png, .pdf, .jpg, .jpeg, .docx"
                  style="display: none"
                  @change="handleFileSelect"
                />
                <button
                  type="button"
                  class="browse-btn"
                  @click="triggerFileInput"
                >
                  Browse
                </button>
                <p v-if="selectedFileName" class="uploaded-file">
                  Uploaded:
                  <a
                    :href="`data:image/jpeg;base64,${selectedFileBase64}`"
                    target="_blank"
                    >{{ selectedFileName }}</a
                  >
                  <button type="button" class="remove-btn" @click="removeFile">
                    Remove
                  </button>
                </p>
              </div>
            </div>

            <button @click="nextQuestion" class="next-button">
              {{ currentStep < questions.length - 1 ? "Next" : "Submit" }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="final">
        <h2>Thank you for completing the onboarding!</h2>
        <p class="subtitle">
          You’re officially part of the Pawfect Home family! Your journey starts
          here. Let’s make some tails (and hearts) wag.
        </p>
        <img
          src="@/assets/images/onboardingQn/onboardingComplete.png"
          alt="Pet Image"
          class="final-image"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../../firebase/firebase";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";
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
      selectedOptions: [], // v-model will two-way bind and update this for every user interaction
      questions: onboardingQuestions,
      userId: null,
      responses: {}, // Initialize the responses object
      showOtherInput: false, // Track whether "Other" is selected
      otherInputValue: "", // Store the value entered in the "Other" textbox
      textInput: "", // For text input questions
      selectedFile: null, // For file upload
      selectedFileName: "", // Name of the selected file
      selectedFileBase64: "", // Base64 string of the selected file
    };
  },

  components: {
    Logo,
  },

  computed: {
    currentQuestion() {
      return this.questions[this.currentStep]; // Retrieve the current question from the onboardingQuestions array
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
      const currentKey = this.currentQuestion.key; // This question key matches Firestore's structure

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
      this.responses[currentKey] = this.selectedFileBase64; // Save Base64 string

      // Reset states for the next question
      this.selectedOptions = [];
      this.showOtherInput = false;
      this.otherInputValue = "";

      if (this.currentStep < this.questions.length - 1) {
        this.currentStep++;
      } else {
        await this.submitResponses(); // Submit responses after the last question
      }
    },

    async submitResponses() {
      try {
        // Create document structure matching Firestore
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
          certificate_base64: this.selectedFileBase64,
          timestamp: new Date(),
          user_id: user ? user.uid : null, // Assign user ID if authenticated, otherwise null
        };

        // Save the last answer before submitting
        const currentKey = this.currentQuestion.key;

        // For single-select questions, store as a single value
        if (this.currentQuestion.type === "single") {
          this.responses[currentKey] = this.selectedOptions[0];
        } else if (this.currentQuestion.type === "multiple") {
          this.responses[currentKey] = [...this.selectedOptions];
        } else if (this.currentQuestion.type === "text") {
          // For text input questions, save the text input value
          this.responses[currentKey] = this.textInput;
          this.textInput = ""; // Clear the text input after saving
        } else if (this.currentQuestion.type === "file-upload") {
          // For file upload, save the Base64 string
          this.responses[currentKey] = this.selectedFileBase64;
        }

        this.selectedOptions = [];

        // Save the document to Firestore
        const userDocRef = doc(db, "Users", user.uid);
        await updateDoc(userDocRef, docData);
        console.log("Reponses array:" + JSON.stringify(this.responses));
        console.log("Responses saved successfully!");

        // Move to the completion screen
        this.currentStep++;
        setTimeout(() => {
          this.goToNextPage();
        }, 3000);
      } catch (error) {
        console.error("Error saving responses:", error);
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Convert file to Base64
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result.split(",")[1]; // Extract only the Base64 part
        console.log("File converted to Base64 successfully.");
      };
      reader.onerror = (error) => {
        console.error("Error converting file to Base64:", error);
        alert("Failed to process the file. Please try again.");
      };
      reader.readAsDataURL(file);
    },
    handleFileDrop(event) {
      const file = event.dataTransfer.files[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(
          "Invalid file type. Please upload a PNG, JPG, PDF, or DOCX file."
        );
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Convert file to Base64
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result.split(",")[1]; // Extract only the Base64 part
        console.log("File converted to Base64 successfully.");
      };
      reader.onerror = (error) => {
        console.error("Error converting file to Base64:", error);
        alert("Failed to process the file. Please try again.");
      };
      reader.readAsDataURL(file);
    },
    removeFile() {
      this.selectedFile = null;
      this.selectedFileName = "";
      this.selectedFileBase64 = "";
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
  text-align: center;
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
  border: 1px solid #222f61;
  border-radius: 20%;
  outline: none;
  cursor: pointer;
  position: relative;
}

.radio-input {
  appearance: none;
  width: 18px; /* Set the size of the circle */
  height: 18px;
  border: 1px solid #222f61;
  border-radius: 100%;
  outline: none;
  cursor: pointer;
  position: relative;
}

.checkbox-input:checked {
  background-color: #222f61;
}

.radio-input:checked {
  border-color: #222f61;
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
  font-family: Raleway-Regular;
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
  width: 30em;
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

.overall {
  font-family: Poppins-Medium;
  padding: 2em;
  width: 100%;
  margin: auto;
}

.upload-certificate {
  background-color: #f5f5f5;
  padding: 1.5em;
  border-radius: 0.75em;
  text-align: center;
  margin-bottom: 1.5em;
}

.upload-info {
  text-align: left;
  margin-left: -1.5em;
}

.upload-label {
  font-family: "Raleway-SemiBold";
  font-size: 1.1em;
  color: #1c1c1c;
  display: flex;
  margin-bottom: 0.5em;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}

.upload-description {
  font-family: "Raleway-Light";
  color: #1c1c1c;
  font-size: 0.95em;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  margin-bottom: 1em;
}

.file-upload-box {
  border: 0.15em dashed #ccc;
  padding: 1.5em;
  border-radius: 0.75em;
  cursor: pointer;
  width: 100%;
  margin-left: -1.5em;
  text-align: center;
}

.file-upload-box p {
  font-family: "Raleway-SemiBold";
  color: #000000;
  margin-bottom: 1em;
  font-size: 1em;
}

.file-upload-box small {
  font-family: "Poppins-Regular";
  color: #000000;
  opacity: 0.7;
}

.browse-btn {
  font-family: "Poppins-Bold";
  color: #f7f3eb;
  background-color: #858585;
  font-size: 12px;
  width: 12.8em;
  height: 3.3em;
  border-radius: 0.5em;
  padding: 0.5em 1em;
  border: none;
  cursor: pointer;
  margin-top: 3em;
}

.browse-btn:hover {
  background-color: grey;
}

.uploaded-file {
  margin-top: 1em;
  font-family: "Raleway-Regular";
  font-size: 0.9em;
}

.uploaded-file a {
  color: #222f61;
  text-decoration: underline;
}

.remove-btn {
  font-family: "Poppins-Regular";
  color: #ff0000;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  margin-left: 1em;
}

.overall-question-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Responsive design */
@media (max-width: 1024px) {
  .overall-question-container {
    gap: 1em; /* Reduce spacing on smaller screens */
  }

  .browse-btn {
    width: 100%; /* Make the button full-width on smaller screens */
  }
}
</style>
