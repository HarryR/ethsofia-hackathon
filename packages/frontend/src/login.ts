import { computed, ref, toValue, watch } from "vue";
import { ethersBrowserProvider, modal } from './wallet';
import { getBytes, SigningKey, Wallet } from "ethers";
import { hmac } from '@noble/hashes/hmac';
import { keccak_256 } from '@noble/hashes/sha3';

const siweDerivedKey = ref<Uint8Array>();
const lastAddress = ref<string>();

export const isLoggedIn = computed(() => toValue(siweDerivedKey) !== undefined);

export function deriveKey(namespace:string) {
    const dk = toValue(siweDerivedKey);
    if( ! dk ) {
        throw new Error('Not logged in');
    }
    return hmac(keccak_256, dk, new TextEncoder().encode(namespace));
}

export function derivedEthersWallet(namespace:string) {
    const key = new SigningKey(deriveKey(namespace));
    return new Wallet(key);
}

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
        siweDerivedKey.value = keccak_256(getBytes(result));
    }
    return {
        canSign,
        isSuccess,
        isSigning,
        doLogin
    };
}
