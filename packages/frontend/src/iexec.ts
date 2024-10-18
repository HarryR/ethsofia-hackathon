import { computed, toValue } from 'vue'
import { IExecDataProtector, IExecDataProtectorCore, IExecDataProtectorSharing } from '@iexec/dataprotector';
import { ethersBrowserProvider } from './wallet';
import { derivedEthersWallet } from './login';

export const iExecDebug = true;

const iexecOptions = iExecDebug ? {
  smsURL: {
    scone: "https://sms.scone-debug.v8-bellecour.iex.ec",
    gramine: 'https://sms.gamine-debug.v8-bellecour.iex.ec', // XXX: unused!
  },
} : {};

export function useIExec() {
  const dataProtectorWallet = computed(() => {
    const ebp = toValue(ethersBrowserProvider);
    if( ! ebp ) {
        return;
    }
    const wallet = derivedEthersWallet("iExec.dataProtector");
    return wallet.connect(ebp);
  });

  const dataProtector = computed(() => {
    const dpw = toValue(dataProtectorWallet);
    if( dpw ) {
      return new IExecDataProtector(dpw, {iexecOptions});
    }
  });

  const dataProtectorCore = computed(() => {
    const dpw = toValue(dataProtectorWallet);
    if( dpw ) {
      return new IExecDataProtectorCore(dpw, {iexecOptions});
    }
  });

  const dataProtectorSharing = computed(() => {
    const dpw = toValue(dataProtectorWallet);
    if( dpw ) {
      return new IExecDataProtectorSharing(dpw);
    }
  });

  return { dataProtectorCore, dataProtector, dataProtectorSharing, dataProtectorWallet };
}
