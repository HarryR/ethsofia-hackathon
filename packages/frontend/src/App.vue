<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ProtectShit from './components/ProtectShit.vue';
import DoSpam from './components/DoSpam.vue';
import LoginGated from './LoginGated.vue';
</script>

<template>
  <LoginGated>
    <HelloWorld msg="Vite + Vue" />
    <ProtectShit />

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
</style>
