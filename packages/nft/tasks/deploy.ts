import { task } from 'hardhat/config';
import { existsSync, promises as fs } from 'fs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ContractFactory } from 'ethers';
import dotenv from 'dotenv';

function makeEnvUpdater(env: dotenv.DotenvParseOutput, filename?: string) {
  return async function updater(key: string, value: string) {
    env[key] = value;
    const line = `${key}=${value}`;
    console.log(line);
    if (filename) {
      await fs.writeFile(
        filename,
        Object.entries(env)
          .map(([k, v]) => `${k}=${v}`)
          .join('\n') + '\n',
      );
    }
  };
}

interface DeployArgs {
  viteenv: string | undefined;
}

async function deployContract<T extends ContractFactory>(
  hre: HardhatRuntimeEnvironment,
  factory: T,
  name: string,
  env: dotenv.DotenvParseOutput,
  setenv: ReturnType<typeof makeEnvUpdater>,
  ...args: Parameters<typeof factory.getDeployTransaction>
): Promise<string> {
  const varname = `VITE_${name}`;
  const varname_tx = `${varname}_TX`;
  if (varname in env) {
    const varval = env[varname];
    if (varname_tx in env) {
      // Retrieve previous deployment transaction
      const txid = env[varname_tx];
      const tx = await hre.ethers.provider.getTransaction(txid);

      if (tx) {
        // And compare it against the new deployment transaction
        // If they are the same, don't deploy the new contract
        const dt = await factory.getDeployTransaction(...args);
        if (dt.data === tx.data) {
          return varval;
        }
      }
    }
  }

  // Otherwise, deploy new contract and update env
  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();
  await setenv(varname_tx, contract.deploymentTransaction()?.hash!);
  await setenv(varname, await contract.getAddress());

  return await contract.getAddress();
}

// Default DAO deployment, no permissions.
task('deploy')
  .addParam('viteenv', 'Output contract addresses to environment file', '')
  .setAction(async (args: DeployArgs, hre) => {
    await hre.run('compile', { quiet: true });

    let env: dotenv.DotenvParseOutput = {};
    if (args.viteenv && existsSync(args.viteenv)) {
      const envFileData = await fs.readFile(args.viteenv);
      env = dotenv.parse(envFileData);
    }

    if (args.viteenv) {
      console.log(`# Saving environment to ${args.viteenv}`);
    }

    const setenv = makeEnvUpdater(env, args.viteenv);

    // Export RPC info etc. from current hardhat config
    const currentNetwork = Object.values(hre.config.networks).find(
      (x) => x.chainId === hre.network.config.chainId,
    );
    const currentNetworkUrl = (currentNetwork as any).url;
    setenv('VITE_NETWORK', String(hre.network.config.chainId!));
    if (!currentNetworkUrl) {
      setenv('VITE_WEB3_GATEWAY', 'http://localhost:8545');
    } else {
      setenv('VITE_WEB3_GATEWAY', currentNetworkUrl);
    }

    await deployContract(
        hre,
        await hre.ethers.getContractFactory('TaskResult'),
        'CONTRACT_TASKRESULT',
        env, setenv);

    await deployContract(
        hre,
        await hre.ethers.getContractFactory('LLMQuestion'),
        'CONTRACT_LLMQUESTION',
        env, setenv);
});
