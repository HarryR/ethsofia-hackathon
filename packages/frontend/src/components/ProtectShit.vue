<script setup lang="ts">
import { iExecDebug, useIExec } from '../iexec';
import { ethersBrowserProvider, iExecChain } from '../wallet';
import { computed, ref, toValue } from 'vue'
import { ProtectedDataWithSecretProps } from '@iexec/dataprotector';
import { ZeroAddress } from 'ethers';
import { associateTaskResults } from '../taskresult';
import QuestionField from './QuestionField.vue'
import { evaluatePrompt } from '../llm';

const isWorking = ref(false);
const isSuccess = ref(false);

const isButtonDisabled = computed(() =>
    dataProtectorCore.value === undefined || toValue(isWorking));

const dpcStatusText = ref('');
const dpcErrorText = ref('');
const dpcResult = ref<ProtectedDataWithSecretProps>();

const { dataProtectorWallet, dataProtectorCore, dataProtectorSharing } = useIExec();

const question = [
    ['', 'prompt', 'I am medical AI, here are my questions'],
    ['Please fill out this health questions', 'info'],
    ['What is your age?', 'number'],
    ['How many cigarettes per day?', 'range', [0,100]],
    ['What is your sex?', 'select', ['male', 'female', 'other']],
    ['When did your symptoms first appear?', 'select', ['Today','This Week', 'This Month', 'This Year', 'Longer than 1 year']],
    ['Please describe your problem', 'string'],
    ['', 'prompt', 'Please provide a brief response']
] as const;

const isFormError = ref(false);
const formErrorFields = ref<string[]>([]);

const qv:string[] = [];
for( const _ in question ) {
    qv.push('');
}

/// Checks if the questions have been answered
function areAnswersValid() {
    let isValid = true;
    formErrorFields.value = [];
    const errors = [];
    for( const i in question ) {
        const q = question[i];
        const v = qv[i];
        const qt = q[1];
        if( qt === 'prompt' || qt === 'info' ) {
            continue;
        }
        if( v.trim().length == 0 ) {
            isValid = false;
            errors.push(q[0]);
        }
    }
    return {isValid, errors};
}

function validateQuestions() {
    const {isValid,errors} = areAnswersValid();
    formErrorFields.value = errors;
    isFormError.value = isValid === false;
    return isValid;
}

/// Converts questions & answers into a prompt for the LLM
function makePrompt() {
    const lines = [];
    for( const i in question ) {
        const q = question[i];
        const qt = q[1];
        if( qt === 'info' ) {
            continue;
        }
        if( qt == 'prompt' ) {
            lines.push('');
            lines.push(q[2]);
            lines.push('');
            continue;
        }
        const v = qv[i];
        lines.push(` * ${q[0]}: ${v}`);
    }
    const llm_input = lines.join("\n");
    console.log(llm_input);
    return llm_input;
}

async function doProtectData () {
    if( ! validateQuestions() ) {
        return;
    }
    const llm_input = makePrompt();

    const ebp = toValue(ethersBrowserProvider);
    if( ! ebp ) {
        throw new Error('No ethersBrowserProvider!');
    }

    const dpw = toValue(dataProtectorWallet);
    if( ! dpw ) {
        throw new Error('No dataProtectorWallet!');
    }
    console.log('Wallet provider Address', dpw.address);

    const dpc = toValue(dataProtectorCore)
    if( dpc ) {
        console.log('Protecting data via', dpc);
        dpcErrorText.value = '';
        isWorking.value = true;
        isSuccess.value = false;
        //const browserWalletAddress = (await ebp.getSigner()).address;
        try {
            const result = dpcResult.value = await dpc.protectData({
                data: {
                    email: llm_input
                },
                onStatusUpdate: ({title, isDone}) => {
                    console.log('Data Protector', title, isDone);
                    dpcStatusText.value = title;
                }
            });
            console.log('Result is', result);

            // Debug sconified figlet
            const debugAppAddress = '0x05F88328fAe2Ac1271C68f2E65864692c3AD9B0A'
            const prodAppAddress = '0xa13cdc6d540b72672eea5997f817942c7d7bafc3';

            // Prod app?
            const appAddress = iExecDebug ? debugAppAddress : prodAppAddress;

            // Grant access to our user to submit it to the specific app
            const grantAccessResult = await dpc.grantAccess({
                protectedData: result.address,
                authorizedApp: appAddress,
                authorizedUser: ZeroAddress, // anybody can run this task
                pricePerAccess: 0,
                numberOfAccess: 100000000,
                onStatusUpdate: ({title,isDone}) => {
                    console.log('Data Protector Share (2)', title, isDone);
                    dpcStatusText.value = title;
                }
            });
            console.log('grantAccessResult', grantAccessResult);

            const protectedResult = await dpc.processProtectedData({
                app: appAddress,
                protectedData: result.address,
                workerpool: iExecDebug ? 'debug-v8-bellecour.main.pools.iexec.eth' : '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f',
                onStatusUpdate: ({title,isDone}) => {
                    console.log('Data Protector Share (3)', title, isDone);
                    dpcStatusText.value = title;
                }
            });
            console.log(protectedResult);

            const receipt = await associateTaskResults(dpw, result.address, protectedResult.taskId, '');
            /*
            const contract = getTaskRunnerContract(dpw); // new Contract(taskResultContractAddr, taskResultABI, dpw);
            const tx = await contract.associate(result.address, protectedResult.taskId);
            const receipt = await tx.wait();
            */
            console.log('Receipt', receipt);

            const x = await toValue(dataProtectorSharing)?.getResultFromCompletedTask({
                taskId: protectedResult.taskId
            })
            if( x ) {
                console.log('X is', x);
            }

            const fakeResult = await evaluatePrompt(llm_input)
            console.log('fakeResult s', fakeResult);

            // Finally transfer it to the browser owner
            /*
            dpcStatusText.value = 'Tansferring Ownership';
            await dpc.transferOwnership({
                protectedData: result.address,
                newOwner: browserWalletAddress
            });
            */

            isSuccess.value = true;
        }
        catch( e:any ) {
            dpcErrorText.value = `Error! ${e}`;
            console.log(e);
        }
        finally {
            isWorking.value = false;
            dpcStatusText.value = '';
        }
    }
}
</script>

<template>
    <hr />
  <h1>Protect Yo Data</h1>

  <div class="card">

    <div v-for="(q, index) of question">
        <QuestionField :ref="`q${index}`" v-model:model-value="qv[index]" :q="q"></QuestionField>
    </div>

    <div v-if="isFormError">
        Form validation errors:
        <ul>
            <li v-for="x of formErrorFields">{{ x }}</li>
        </ul>
    </div>

    <button type="button" :disabled="toValue(isButtonDisabled)" @click="doProtectData()">
        Do Everything
    </button>
    <br />

    <input type="text" :hidden="!isWorking" ref="dpcStatus" readonly v-model="dpcStatusText" />
    <input type="text" :hidden="toValue(dpcErrorText).length == 0" ref="dpcError" readonly v-model="dpcErrorText" />
    <div v-if="isSuccess">
        <h3>Success!</h3>
        Address: {{ dpcResult?.address }}<br />
        Tx: <a :href="`${iExecChain.explorerUrl}/tx/${dpcResult?.transactionHash}`">{{ dpcResult?.transactionHash }}</a><br />
    </div>
  </div>
  <hr />
</template>

<style scoped>

</style>
