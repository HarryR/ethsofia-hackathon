import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'
/*
import { BrowserProvider } from 'ethers/providers'
import { Eip1193Provider } from 'ethers';
import { computed, ref, toValue } from 'vue';
import { IExecDataProtectorCore, IExecDataProtectorSharing } from '@iexec/dataprotector';
import { asyncComputed, useMemoize } from '@vueuse/core'
*/

const projectId = 'be010c8142040f0e4ff0b6f05608622e';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}
const iexecSidechain = {
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
  chains: [/*mainnet,*/ iexecSidechain],
  projectId,
  enableSwaps: false,   // Fuck swaps
  enableAnalytics: false, // Fuck analytics
  enableOnramp: false // Fuck onramp
});

/*

export function useIExecWeb3Modal(modal: AppKit<EthersStoreUtilState, number>) {
  // Ref to track connection status
  const isConnectedRef = ref(false)

  // Function to get the wallet provider and ensure connection
  const getConnectedProvider = async () => {
    if (!isConnectedRef.value) {
      await modal.open()
      isConnectedRef.value = true
    }
    // AppKit doesn't have a direct getWalletProvider method, so we use getProvider
    return modal.getProvider()
  }

  // Memoize the getConnectedProvider function
  const memoizedGetConnectedProvider = useMemoize(getConnectedProvider)

  // Memoize the creation of IExecDataProtectorCore
  const memoizedCreateDataProtectorCore = useMemoize((provider: any) => new IExecDataProtectorCore(provider))

  // Computed property to get the memoized and connected wallet provider
  const walletProvider = computed(async () => {
    try {
      return await memoizedGetConnectedProvider()
    } catch (error) {
      console.error('Failed to get wallet provider:', error)
      return null
    }
  })

  // Computed property to get the memoized IExecDataProtectorCore instance
  const dataProtectorCore = computed(async () => {
    const provider = await walletProvider.value
    if (provider) {
      return memoizedCreateDataProtectorCore(provider)
    }
    return null
  })

  // Function to reset connection and clear memoized values
  const resetConnection = () => {
    isConnectedRef.value = false
    memoizedGetConnectedProvider.clear()
    memoizedCreateDataProtectorCore.clear()
  }

  // Function to handle wallet changes
  const handleWalletChange = () => {
    resetConnection()
  }

  // Set up event listeners for wallet changes
  modal.subscribeEvents(({ event }) => {
    if (event.name === 'MODAL_CLOSE' || event.name === 'CONNECT_ERROR') {
      handleWalletChange()
    }
  })

  return {
    isConnected: isConnectedRef,
    walletProvider,
    dataProtectorCore,
    resetConnection,
    handleWalletChange
  }
}
*/