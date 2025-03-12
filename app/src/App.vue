<template>
  <div id="nav">
    <router-link to="/login">Login</router-link> |
    <router-link to="/signup">Sign Up</router-link> |
    <router-link to="/welcome">Welcome</router-link>
  </div> 

  <!-- This is where pages will be rendered -->
  <router-view/>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#nav {
  padding: 20px;
  background-color: #f8f9fa;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
