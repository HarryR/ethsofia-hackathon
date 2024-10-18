<script setup lang="ts">
import { useIExec } from '../iexec';
import { ethersBrowserProvider, iExecChain } from '../wallet';
import { derivedEthersWallet } from '../login';
import { computed, ref, toValue, useTemplateRef } from 'vue'
import { IExecDataProtectorCore, ProtectedDataWithSecretProps } from '@iexec/dataprotector';

const info = ref('');

const {dataProtectorCore} = useIExec();

const isWorking = ref(false);
const isSuccess = ref(false);

const isButtonDisabled = computed(() =>
    dataProtectorCore.value === undefined || toValue(isWorking));

const infoInput = useTemplateRef('myInput');

const dpcStatusText = ref('');
const dpcErrorText = ref('');
const dpcResult = ref<ProtectedDataWithSecretProps>();

async function doProtectData () {
    const i = toValue(info).trim();
    if( ! i.length ) {
        toValue(infoInput)?.focus();
        return;
    };

    const ebp = toValue(ethersBrowserProvider);
    if( ! ebp ) {
        return;
    }
    const wallet = derivedEthersWallet("iExec.dataProtector");
    const walletProvider = wallet.connect(ebp);
    console.log('Wallet provider Address', walletProvider.address);

    const dpc = new IExecDataProtectorCore(walletProvider);
    //const dpc = toValue(dataProtectorCore);
    if( dpc ) {
        console.log('Protecting data via', dpc);
        dpcErrorText.value = '';
        isWorking.value = true;
        isSuccess.value = false;
        const browserWalletAddress = (await ebp.getSigner()).address;
        try {
            const result = dpcResult.value = await dpc.protectData({
                data: {
                    stuff: i
                },
                onStatusUpdate: ({title, isDone}) => {
                    console.log('Data Protector', title, isDone);
                    dpcStatusText.value = title;
                }
            });
            console.log('Result is', result);

            // Grant access to our user to submit it to the specific app
            /*
            dpc.grantAccess({
                protectedData: result.address,
                authorizedApp: '0xB907E09DB4D5f512a64694D6160F4b9c446442b1',
                authorizedUser: wallet.address,
                pricePerAccess: 0,
                numberOfAccess: 1000000,
                onStatusUpdate: ({title,isDone}) => {
                    console.log('Data Protector Share (2)', title, isDone);
                    dpcStatusText.value = title;
                }
            });
            */

            dpcStatusText.value = 'Tansferring Ownership';
            await dpc.transferOwnership({
                protectedData: result.address,
                newOwner: browserWalletAddress
            });

            isSuccess.value = true;
        }
        catch( e:any ) {
            dpcErrorText.value = `Error! ${e}`;;
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
    <input type="text" ref="myInput" :disabled="toValue(isButtonDisabled)" name="Data Protector" v-model="info" />
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
