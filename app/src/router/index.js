import { createRouter, createWebHistory } from 'vue-router';
import Login from '../screens/common/Login.vue';
import SignUp from '../screens/common/SignUp.vue';
import Welcome from '../screens/common/Welcome.vue';
import Onboarding1 from "../screens/common/Onboarding1.vue";
import Onboarding2 from "../screens/adopter/Onboarding2.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/onboarding1',
    name: 'Onboarding1',
    component: Onboarding1
  },
  {
    path: '/onboarding2',
    name: 'Onboarding2',
    component: Onboarding2
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
