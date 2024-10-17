import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { ref} from 'vue';
//import { asyncComputed, useMemoize } from '@vueuse/core'

const projectId = 'be010c8142040f0e4ff0b6f05608622e';

/*
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}
*/

export const iExecChain = {
  chainId: 134,
  name: 'iExec',
  currency: 'xRLC',
  explorerUrl: 'https://blockscout.bellecour.iex.ec/',
  rpcUrl: 'https://bellecour.iex.ec'
};

const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // url must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default

    // Fuck coinbase
    enableCoinbase: false, // true by default
    //rpcUrl: '...' // used for the Coinbase SDK
    //defaultChainId: 1, // used for the Coinbase SDK
});

export const modal = createWeb3Modal({
  ethersConfig,
  chains: [/*mainnet,*/ iExecChain],
  projectId,
  enableSwaps: false,   // Fuck swaps
  enableAnalytics: false, // Fuck analytics
  enableOnramp: false // Fuck onramp
});

export type ModalT = ReturnType<typeof createWeb3Modal>;

export const provider = ref<Eip1193Provider>();

export const ethersBrowserProvider = ref<BrowserProvider>();

modal.subscribeState((_) => {
  console.log('State change', _);
  if( _.activeChain === undefined ) {
    provider.value = undefined;
  }
});
modal.subscribeEvents((_) => {
  console.log('Event', _);
});
modal.subscribeProvider((_) => {
  console.log('Subscribe provider', _);
  const p = _.provider as Eip1193Provider;
  provider.value = p;
  if( _.provider ) {
    ethersBrowserProvider.value = new BrowserProvider(_.provider);
  }
  else {
    ethersBrowserProvider.value = undefined;
  }
});
