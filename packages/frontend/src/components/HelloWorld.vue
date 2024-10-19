<script setup lang="ts">
import { ref, toValue } from 'vue'

import { useIExec } from '../iexec';
import { ProtectedData } from '@iexec/dataprotector';
import { getTaskInfo } from '../taskresult';
import { getQuestion } from '../qlist';

const { dataProtectorCore, dataProtectorWallet } = useIExec();

const results = ref<ProtectedData[]>([]);
const isLoading = ref(false);
const extraData = ref<any[]>([]);

async function refreshData() {
  isLoading.value = true;
  try {
    const dpw = toValue(dataProtectorWallet)!
    const browserOwner = dpw.address;
    //const dpw = toValue(dataProtectorWallet)!
    const dpc = toValue(dataProtectorCore)!;
    const extra = [];
    const blah = results.value = await dpc.getProtectedData({
      owner: browserOwner,
      pageSize: 100,
      requiredSchema: {
        bulgariaIsCool: "bool"
      }
    });
    for( const b of blah ) {
      const i = await getTaskInfo(dpw, b.address)
      const qid = i[2];
      const taskid = i[0];
      //const result = i[1];
      const q = await getQuestion(dpw, qid);
      const qtitle = q[1];
      console.log(i, q);
      extra.push({qid,taskid,qtitle});
    }
    extraData.value = extra as any;
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
    <div class="item" v-for="(item, index) in results">
      <h3>{{ toValue(extraData)[index].qtitle }}</h3>
      Address: {{ item.address }}<br />
      Timestamp: {{ item.creationTimestamp }}<br />
    </div>

    <button @click.prevent="refreshData">Refresh</button>
  </div>
</template>

<style scoped>
div.item {
  border: 1px solid #333;
  margin-bottom: 20px;
  padding-bottom: 20px;;
}
</style>
