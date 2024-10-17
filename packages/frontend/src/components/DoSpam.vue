<script setup lang="ts">
import { sleep } from '../utils';
import { ethersBrowserProvider } from '../wallet';
import { computed, ref, toValue, watch } from 'vue'

const doSpam = ref(false);

const disableSpam = computed(() =>
        toValue(ethersBrowserProvider) === undefined);

const isSpamming = computed(() =>
        !toValue(disableSpam) && toValue(doSpam));

watch(isSpamming, async () => {
    while( toValue(isSpamming) ) {
        for( let i = 0; i < 100; i++ ) {
            console.log('Spamming!');
        }
        await sleep(1000);
    }
});
</script>

<template>
    <label for="doSpam" id="doSpamContainer">
        <input type="checkbox" :disabled="disableSpam" v-model="doSpam" id="doSpam" /> Spam iExec RPC
    </label>
</template>

<style scoped>
#doSpamContainer {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
