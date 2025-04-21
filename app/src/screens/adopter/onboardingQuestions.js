// QUESTION FILE IN JSON FORMAT
import onboardingRat from "@/assets/images/onboardingQn/onboardingRat.png";
import onboardingBird from "@/assets/images/onboardingQn/onboardingBird.png";
import onboardingPig from "@/assets/images/onboardingQn/onboardingPig.png";
import onboardingFish from "@/assets/images/onboardingQn/onboardingFish.png";

export const onboardingQuestions = [
  {
    question: "What type of pet are you looking for?",
    type: "multiple",
    options: ["Dog", "Bird", "Hamster", "Cat", "Rabbit", "Other"],
    key: "preferred_species",
    image: onboardingRat,
  },
  {
    question: "How experienced are you with pets?",
    type: "single",
    options: ["First-time owner", "Some experience", "Very experienced"],
    key: "previous_experience",
    image: onboardingBird,
  },
  {
    question: "What age do you prefer your pets to be?",
    type: "single",
    options: ["Young", "Adult", "Senior"],
    key: "age_preference",
    image: onboardingPig,
  },
  {
    question:
      "Do you have any restrictions on the pet? (i.e. Medical History etc.) Please write Nil if none ",
    type: "text",
    key: "restrictions",
    image: onboardingFish,
  },
  {
    question: "Upload your pet ownership course certificate",
    type: "file-upload",
    key: "certificate",
    image: onboardingFish, // Use the same image or a new one
  },
];
