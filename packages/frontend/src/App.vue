<script setup lang="ts">
import DoSpam from './components/DoSpam.vue';
import LoginGated from './LoginGated.vue';

import { RouterView } from 'vue-router';
</script>

<template>
  <LoginGated>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/upload">Upload</RouterLink>
    </nav>

    <RouterView />

    <w3m-button id="w3mbutton" />

    <DoSpam />
  </LoginGated>
</template>

<style scoped>
#w3mbutton {
  position: absolute;
  top: 10px;
  right: 10px;
}

nav a {
  padding: 10px;
  margin: 5px;
  border: 1px solid #333;
}
</style>
