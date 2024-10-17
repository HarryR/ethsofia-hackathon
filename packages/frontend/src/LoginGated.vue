<script setup lang="ts">
import SIWEButton from './components/SIWEButton.vue';
import {siweDerivedKey} from './login';
</script>
<!-- Displays the 'Connect' then 'Sign-in' buttons, before showing content -->
<template>
    <slot v-if="siweDerivedKey !== undefined"></slot>
    <div v-else>
        <w3m-button id="w3mbutton" />
        <SIWEButton />
    </div>
</template>
