<script setup lang="ts">
import { ref, toValue } from 'vue'

import { ethersBrowserProvider } from '../wallet';
import { useIExec } from '../iexec';
import { ProtectedData } from '@iexec/dataprotector';

const { dataProtectorCore, dataProtectorWallet } = useIExec();

const results = ref<ProtectedData[]>([]);
const isLoading = ref(false);

async function refreshData() {
  isLoading.value = true;
  try {
    const browserOwner = (await toValue(ethersBrowserProvider)!.getSigner()).address;
    //const dpw = toValue(dataProtectorWallet)!
    const dpc = toValue(dataProtectorCore)!;
    const blah = results.value = await dpc.getProtectedData({
      owner: browserOwner
    });
    console.log(blah);
  } finally {
    isLoading.value = false;
  }
}

refreshData();
</script>

<template>
  <h1>Hello!</h1>

  <p v-if="isLoading">Loading!...</p>

  owner: {{  dataProtectorWallet?.address  }}

  <div class="card">
    <div class="item" v-for="item in results">
      Address: {{ item.address }}<br />
      Schema: {{ item.schema }}<br />
      Timestamp: {{ item.creationTimestamp }}<br />
      Owner: {{ item.owner }}<br />
    </div>

    <button @click.prevent="refreshData">Refresh</button>
  </div>
</template>

<style scoped>
div.item {
  border: 1px solid #333;
  margin-bottom: 5px;
}
</style>
