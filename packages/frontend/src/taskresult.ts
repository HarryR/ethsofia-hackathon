import { Contract, ContractRunner } from "ethers";

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
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export function getTaskRunnerContract (r:ContractRunner) {
    const contract = new Contract(taskResultContractAddr, taskResultABI, r);
    return contract;
}
