import { createRouter, createWebHistory } from "vue-router";
import Login from "../screens/common/Login.vue";
import SignUp from "../screens/common/SignUp.vue";
import Welcome from "../screens/common/Welcome.vue";
import Onboarding1 from "../screens/common/Onboarding1.vue";
import Onboarding2 from "../screens/adopter/Onboarding2.vue";
import PetListing from "../screens/lister/PetListing.vue";
import OnboardingQn from "../screens/adopter/OnboardingQn.vue";
import MarketPlace from "../screens/adopter/MarketPlace.vue";
import ForgetPassword from "../screens/common/ForgetPassword.vue";
import PetProfile from "../screens/adopter/PetProfile.vue";
import EditProfile from "../screens/adopter/EditProfile.vue";
import ResetPassword from "../screens/adopter/ResetPassword.vue";
import AddListing1 from "../screens/lister/AddListing1.vue";
import AddListing2 from "../screens/lister/AddListing2.vue";
import AddListing3 from "../screens/lister/AddListing3.vue";
import AddListing4 from "../screens/lister/AddListing4.vue";
import PetProfilePreview from "../screens/lister/PetProfilePreview.vue";




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
    path: "/forget-password",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/pet-profile",
    name: "PetProfile",
    component: PetProfile,
  },
  {
    path: "/editprofile",
    name: "EditProfile",
    component: EditProfile,

  },
 
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },

  {
    path: "/addlisting1",
    name: "AddListing1",
    component: AddListing1,
  },

  {
    path: "/addlisting2",
    name: "AddListing2",
    component: AddListing2,
  },

  {
    path: "/addlisting3",
    name: "AddListing3",
    component: AddListing3,
  },

  {
    path: "/addlisting4",
    name: "AddListing4",
    component: AddListing4,
  },

  {
    path: "/petprofilepreview",
    name: "PetProfilePreview",
    component: PetProfilePreview,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
