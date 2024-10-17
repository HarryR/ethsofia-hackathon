<script setup lang="ts">
//import { dataProtectorCore } from '../wallet';
import { useIExecWeb3Modal } from '../iexecshit';
import { modal } from '../wallet';
import { ref, toValue } from 'vue'

const info = ref('');

const blah = useIExecWeb3Modal(modal);

async function doProtectData () {
    const i = toValue(info);
    if( i ) {
        const dpc = toValue(blah.dataProtectorCore);
        if( dpc ) {
            console.log('Protecting data via', dpc);
            const result = await dpc.protectData({
                data: {
                    stuff: i
                }
            });
            console.log('Result is', result);
        }
    }
}
</script>

<template>
    <hr />
  <h1>Protect Data</h1>

  <div class="card">
    <input type="text" name="Data Protector" v-model="info" />
    <button type="button" @click="doProtectData()">
        Do Everything
    </button>
  </div>
  <hr />
</template>

<style scoped>

</style>
