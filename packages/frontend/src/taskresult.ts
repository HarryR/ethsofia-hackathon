import { Contract, ContractRunner, ContractTransactionResponse } from "ethers";

const taskResultContractAddr = import.meta.env.VITE_CONTRACT_TASKRESULT;

const taskResultABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
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
      },
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
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
      },
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
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
] as const;

export function getTaskRunnerContract (runner:ContractRunner) {
    return new Contract(taskResultContractAddr, taskResultABI, runner);
}

export async function getTaskInfo(runner:ContractRunner, datasetAddress:string) {
  const contract = getTaskRunnerContract(runner);
  return contract.datasetTasks(datasetAddress);
}
export async function associateTaskResults (
  runner:ContractRunner,
  owner:string,
  taskId:string,
  result:string,
  questionId:number
)
{
  const contract = getTaskRunnerContract(runner);
  const tx = await contract.associate(owner, taskId, result, questionId) as ContractTransactionResponse;
  return await tx.wait();
}
