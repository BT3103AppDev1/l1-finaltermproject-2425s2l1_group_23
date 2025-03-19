import { createRouter, createWebHistory } from "vue-router";
import Login from "../screens/common/Login.vue";
import SignUp from "../screens/common/SignUp.vue";
import Welcome from "../screens/common/Welcome.vue";
import Onboarding1 from "../screens/common/Onboarding1.vue";
import Onboarding2 from "../screens/adopter/Onboarding2.vue";
import PetListing from "../screens/lister/PetListing.vue";
import OnboardingQn from "../screens/adopter/OnboardingQn.vue";
import MarketPlace from "../screens/adopter/MarketPlace.vue";
import EditProfile from "../screens/adopter/EditProfile.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/onboarding",
    name: "Onboarding1",
    component: Onboarding1,
  },
  {
    path: "/onboarding-adopters",
    name: "Onboarding2",
    component: Onboarding2,
  },
  {
    path: "/petlisting",
    name: "PetListing",
    component: PetListing,
  },
  {
    path: "/onboarding-questions",
    name: "OnboardingQn",
    component: OnboardingQn,
  },
  {
    path: "/home",
    name: "MarketPlace",
    component: MarketPlace,
  },
  {
    path: "/editprofile",
    name: "EditProfile",
    component: EditProfile,

  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
