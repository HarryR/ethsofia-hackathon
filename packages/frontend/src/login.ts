import { computed, ref, toValue, watch } from "vue";
import { ethersBrowserProvider, modal } from './wallet';
import { getBytes, keccak256 } from "ethers";

export const siweDerivedKey = ref<string>();
const lastAddress = ref<string>();

watch(ethersBrowserProvider, async (bp) => {
    if( ! bp ) {
        siweDerivedKey.value = undefined;
        lastAddress.value = undefined;
        return;
    }

    const address = modal.getAddress();
    if( toValue(lastAddress) !== address ) {
        siweDerivedKey.value = undefined;
        lastAddress.value = undefined;
    }
});

export function useSIWE() {
    const canSign = computed(() => toValue(ethersBrowserProvider) !== undefined);
    const isSuccess = ref(false);
    const isSigning = ref(false);
    async function doLogin () {
        if( ! toValue(canSign) || toValue(isSuccess) || toValue(isSigning) ) {
            return;
        }

        const ebp = toValue(ethersBrowserProvider);
        if( ! ebp ) {
            return;
        }

        const signer = await ebp.provider.getSigner(modal.getAddress());

        const siweMessage = [
            `${window.location.hostname} wants you to sign in with your Ethereum account:`,
            signer.address,
            '',
            'TODO: put warning message here',
            '',
            `URI: ${window.location}`,
            'Version: 1',
            'Chain ID: 1',
            'Nonce: DETERMINISTIC',
            'Issued At: 2024-09-09T09:09:09Z'
        ].join('\n');

        let result: string;
        try {
            result = await signer.signMessage(siweMessage);
        }
        catch(e:any) {
            return false;
        }
        siweDerivedKey.value = keccak256(getBytes(result));
    }
    return {
        canSign,
        isSuccess,
        isSigning,
        doLogin
    };
}