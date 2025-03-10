import { createRouter, createWebHistory } from 'vue-router';
import Home from '../screens/common/Home.vue';
import Login from '../screens/common/Login.vue';
import SignUp from '../screens/common/SignUp.vue';
import Welcome from '../screens/common/Welcome.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
