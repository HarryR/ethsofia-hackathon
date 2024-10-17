import { computed, toValue } from 'vue'
import { IExecDataProtectorCore, IExecDataProtectorSharing } from '@iexec/dataprotector'
import { provider } from './wallet';

export function useIExec() {
  const dataProtectorCore = computed(() => {
    const p = toValue(provider);
    if( p ) {
      return new IExecDataProtectorCore(p);
    }
  });

  const dataProtectorSharing = computed(() => {
    const p = toValue(provider);
    if( p ) {
      return new IExecDataProtectorSharing(p);
    }
  });

  return { dataProtectorCore, dataProtectorSharing };
}
