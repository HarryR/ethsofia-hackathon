import { ref } from 'vue'
import { IExecDataProtectorCore } from '@iexec/dataprotector'
import { createWeb3Modal } from '@web3modal/ethers/vue'
import { Eip1193Provider } from 'ethers';

export function useIExecWeb3Modal(modal: ReturnType<typeof createWeb3Modal>) {
  const provider = ref<Eip1193Provider>();
  const dataProtectorCore = ref<IExecDataProtectorCore>();
  modal.subscribeProvider((_) => {
    const p = _.provider;
    provider.value = p as Eip1193Provider;
    dataProtectorCore.value = new IExecDataProtectorCore(p);
  });

  return {
    provider,
    dataProtectorCore
  }
}
