import { Contract, ContractRunner, ContractTransactionResponse } from "ethers";

const taskResultContractAddr = '0x2049b8064FBD4E137c24e0fc383d76662b7f2701';

const taskResultABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dataset",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "taskId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "associate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "datasetAddress",
        "type": "address"
      }
    ],
    "name": "datasetTasks",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "taskId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registry",
    "outputs": [
      {
        "internalType": "contract IERC721",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export function getTaskRunnerContract (r:ContractRunner) {
    return new Contract(taskResultContractAddr, taskResultABI, r);
}

export async function associateTaskResults (
  runner:ContractRunner,
  owner:string,
  taskId:string,
  result:string
)
{
  const contract = getTaskRunnerContract(runner);
  const tx = await contract.associate(owner, taskId, result) as ContractTransactionResponse;
  return await tx.wait();
}
