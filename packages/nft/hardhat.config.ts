import '@nomicfoundation/hardhat-ethers';
import { HardhatUserConfig } from 'hardhat/config';
import '@typechain/hardhat';

import './tasks/deploy';

const TEST_HDWALLET = {
    mnemonic: 'test test test test test test test test test test test junk',
    path: "m/44'/60'/0'/0",
    initialIndex: 0,
    count: 20,
    passphrase: '',
  };

  const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : TEST_HDWALLET;

  const config: HardhatUserConfig = {
    networks: {
      hardhat: {
        chainId: 1337, // @see https://hardhat.org/metamask-issue.html
      },
      hardhat_local: {
        url: 'http://127.0.0.1:8545/',
      },
      bellecour: {
        url: 'https://bellecour.iex.ec',
        chainId: 134,
        accounts,
      },
    },
    solidity: {
      version: '0.8.23',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        viaIR: true,
      },
    },
    typechain: {
      target: 'ethers-v6',
      outDir: 'src/contracts',
    },
    mocha: {
      require: ['ts-node/register/files'],
      timeout: 50_000,
    },
};

export default config;
