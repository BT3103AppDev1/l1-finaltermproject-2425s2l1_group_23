import { createRouter, createWebHistory } from "vue-router";
import Login from "../screens/common/Login.vue";
import SignUp from "../screens/common/SignUp.vue";
import Welcome from "../screens/common/Welcome.vue";
import OnboardingView from "./views/OnboardingView.vue";

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
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: OnboardingView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
