<script setup lang="ts">
import { randomBytes } from '@noble/hashes/utils';
import { hexlify } from 'ethers';
import { Question } from '../qlist';

//defineProps(['modelValue']);
const {q} = defineProps<{
  q: Question,
  modelValue: string,
  disabled?: boolean
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: string): void
}>();

function updateValue (value:string) {
  emit('update:modelValue', value)
};
/*
type InfoQ = readonly [string, 'info']
type PromptQ = readonly ['', 'prompt', string];  // Ignored
type NumberRangeQ = readonly [string, 'range', readonly [number,number]];
type SelectQ = readonly [string, 'select', readonly string[]];
type NumberQ = readonly [string, 'number'];
type StringQ = readonly [string, 'string'];
type Question = PromptQ | NumberRangeQ | SelectQ | StringQ | NumberQ | InfoQ;
*/

if( q === undefined ) {
    throw new Error('Unknown question type!');
}
const randomId = hexlify(randomBytes(8));

const title = q[0];
const qtype = q[1];
const options = q[2] !== undefined ? (q[2][0] === '[' ? JSON.parse(q[2] as string) : q[2]) : '';

//console.log('title', title, 'qtype', qtype, 'options', typeof options, options);

const range:number[] = [];
if( qtype == 'range' && options ) {
    for( let i = Number(options[0]); i <= Number(options![1]); i++ ) {
        range.push(i);
    }
}
</script>

<template>
    <label v-if="qtype!='info'" :for="randomId">{{ title }}</label>
    <div v-if="qtype=='number'">
        <input :disabled="disabled" type="text" size="3" :id="randomId" :value="modelValue" @input="updateValue(($event.target as HTMLInputElement).value)" />
    </div>
    <div v-else-if="qtype=='range'">
        <select :disabled="disabled" :id="randomId" @change="updateValue(($event.target as HTMLSelectElement).value)">
            <option value=""></option>
            <option v-for="x of range" :value="x">{{ x }}</option>
        </select>
    </div>
    <div v-else-if="qtype=='select'">
        <select :disabled="disabled" :id="randomId" @change="updateValue(($event.target as HTMLSelectElement).value)">
            <option value=""></option>
            <option v-for="x of options" :value="x">{{ x }}</option>
        </select>
    </div>
    <div v-else-if="qtype=='string'"  @input="updateValue(($event.target as HTMLInputElement).value)" >
        <input :disabled="disabled" type="text" :value="modelValue" :id="randomId" />
    </div>
    <div v-else-if="qtype=='info'">
        <p>{{ title }}</p>
    </div>
</template>