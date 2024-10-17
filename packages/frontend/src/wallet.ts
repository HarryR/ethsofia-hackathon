import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'
import { BrowserProvider } from 'ethers/providers'
import { Eip1193Provider } from 'ethers';
import { computed } from 'vue';

const projectId = 'be010c8142040f0e4ff0b6f05608622e';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}
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

const modal = createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableSwaps: false,   // Fuck swaps
  enableAnalytics: false, // Fuck analytics
  enableOnramp: false // Fuck onramp
});

const walletProvider = modal.getWalletProvider() as Eip1193Provider;
export const ethersProvider = computed(() => {
  if( walletProvider )
    return new BrowserProvider(walletProvider)
});