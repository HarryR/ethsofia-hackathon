import { ref } from 'vue'
import { IExecDataProtectorCore } from '@iexec/dataprotector'
import { Eip1193Provider } from 'ethers';
import { ModalT, modal as defaultModal } from './wallet';

export function useIExecWeb3Modal(modal?:ModalT) {
  modal = modal ?? defaultModal;
  const dataProtectorCore = ref<IExecDataProtectorCore>();
  modal.subscribeProvider((_) => {
    const p = _.provider as Eip1193Provider;
    if( p !== undefined ) {
      dataProtectorCore.value = new IExecDataProtectorCore(p);
    }
    else {
      dataProtectorCore.value = undefined;
    }
  });

  return {
    dataProtectorCore
  }
}
