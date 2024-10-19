<script setup lang="ts">
import { ref, toValue } from 'vue';
import { getTitles } from '../qlist';
import { ethersBrowserProvider } from '../wallet';
const ebp = toValue(ethersBrowserProvider)!;
const titles = ref<string[]>([]);
async function refreshData() {
    const t = await getTitles(ebp);
    titles.value = t;
}
refreshData();
</script>

<template>
    <h1>Choose a Quiz</h1>
    <router-link class="q" :to="{name:'q', params:{id:qid}}" v-for="(t,qid) of titles">
        {{t}}
    </router-link>
</template>

<style scoped>
a.q {
  padding: 10px;
  margin: 5px;
  border: 1px solid #333;
  display: block;
}
</style>
