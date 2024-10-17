<script setup lang="ts">
import { useIExec } from '../iexec';
import { computed, ref, toValue, useTemplateRef } from 'vue'

const info = ref('');

const {dataProtectorCore} = useIExec();

const isButtonDisabled = computed(() =>
    dataProtectorCore.value === undefined);

const infoInput = useTemplateRef('myInput');

async function doProtectData () {
    const i = toValue(info).trim();
    if( ! i.length ) {
        toValue(infoInput)?.focus();
        return;
    };

    const dpc = toValue(dataProtectorCore);
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
</script>

<template>
    <hr />
  <h1>Protect Yo Data</h1>

  <div class="card">
    <input type="text" ref="myInput" :disabled="toValue(isButtonDisabled)" name="Data Protector" v-model="info" />
    <button type="button" :disabled="toValue(isButtonDisabled)" @click="doProtectData()">
        Do Everything
    </button>
  </div>
  <hr />
</template>

<style scoped>

</style>
