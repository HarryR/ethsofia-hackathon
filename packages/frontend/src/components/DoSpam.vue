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
            // TODO: spam iExec RPC with gas consumption stuff
        }
        await sleep(1000);
    }
});
</script>

<template>
    <label for="doSpam" id="doSpamContainer">
        <input type="checkbox" :disabled="disableSpam" v-model="doSpam" id="doSpam" />
        Enable DDoS
    </label>
</template>

<style scoped>
#doSpamContainer {
    position: fixed;
    padding: 10px;
    bottom: 0px;
    right: 0px;
    background: rgba(1,1,1,0.4);
    border-top-left-radius: 10px;
}
</style>
