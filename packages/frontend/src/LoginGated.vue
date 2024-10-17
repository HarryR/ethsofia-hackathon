<script setup lang="ts">
import SIWEButton from './components/SIWEButton.vue';
import {isLoggedIn} from './login';
</script>
<!-- Displays the 'Connect' then 'Sign-in' buttons, before showing content -->
<template>
    <slot v-if="isLoggedIn"></slot>
    <div v-else>
        <div>
            <div>
                <h2>1: Connect Wallet</h2>
                <w3m-button  style="margin: 0 auto;" />
            </div>
            <br />
            <div>
                <h2>2: Sign in with Ethereum</h2>
                <SIWEButton />
            </div>
        </div>
    </div>
</template>
