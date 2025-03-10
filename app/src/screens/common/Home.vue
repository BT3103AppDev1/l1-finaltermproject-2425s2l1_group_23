<template>
    <div id="app">
      <Login />
      <SignUp />
    </div>
  </template>
  
  <script>
  import Login  from './Login.vue';
  import SignUp from './SignUp.vue';
  
  export default {
    name: 'App',
    components: {
      SignUp,
      Login
    }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>