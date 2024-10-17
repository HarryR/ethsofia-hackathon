<script setup lang="ts">
import { computed, ref, toValue } from 'vue';
import { ethersBrowserProvider } from '../wallet';
import { useSIWE } from '../login';

const siwe = useSIWE();
const isButtonDisabled = computed(() => toValue(ethersBrowserProvider) === undefined || toValue(siwe.isSigning) || toValue(siwe.isSuccess));
</script>

<template>
    <button :disabled="isButtonDisabled" @click.prevent="siwe.doLogin">
        Sign-in
    </button>
</template>