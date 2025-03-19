import { createRouter, createWebHistory } from 'vue-router';
import Login from '../screens/common/Login.vue';
import SignUp from '../screens/common/SignUp.vue';
import Welcome from '../screens/common/Welcome.vue';
import PetProfile from '../screens/common/PetProfile.vue';

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
    path: '/petprofile',
    name: 'PetProfile',
    component: PetProfile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
