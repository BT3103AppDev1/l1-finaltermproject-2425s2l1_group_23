// QUESTION FILE IN JSON FORMAT

export const onboardingQuestions = [
  {
    question: "What type of pet are you looking for?",
    type: "multiple",
    options: ["Dog", "Bird", "Hamster", "Cat", "Rabbit", "Other"],
    key: "preferred_species",
  },
  {
    question: "How experienced are you with pets?",
    type: "single",
    options: ["First-time owner", "Some experience", "Very experienced"],
    key: "previous_experience",
  },
  {
    question: "What age do you prefer your pets to be?",
    type: "single",
    options: ["Young", "Adult", "Senior"],
    key: "age_preference",
  },
  {
    question:
      "Do you have any restrictions on the pet? (i.e. Medical History etc.) Please write Nil if none ",
    type: "text",
    key: "restrictions",
  },
];
