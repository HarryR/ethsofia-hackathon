import { Contract, ContractRunner } from "ethers";

const qlistAddr = import.meta.env.VITE_CONTRACT_LLMQUESTION;
const qlistABI = [
  {
    "inputs": [],
    "name": "count",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "qtype",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "options",
                "type": "string"
              }
            ],
            "internalType": "struct LLMQuestion.Question[]",
            "name": "questions",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct LLMQuestion.Questionnaire",
        "name": "x",
        "type": "tuple"
      }
    ],
    "name": "create",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getList",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "qtype",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "options",
                "type": "string"
              }
            ],
            "internalType": "struct LLMQuestion.Question[]",
            "name": "questions",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct LLMQuestion.Questionnaire[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      }
    ],
    "name": "getOne",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "qtype",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "options",
                "type": "string"
              }
            ],
            "internalType": "struct LLMQuestion.Question[]",
            "name": "questions",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct LLMQuestion.Questionnaire",
        "name": "out",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTitles",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "out",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

type OptionsT = [number,number] | string[] | string;

export interface QuestionObj {
  title: string;
  qtype: string;
  options?: OptionsT;
}

export type Question = [string,string,OptionsT?];

export interface Questionnaire {
  owner: string;
  title: string;
  questions: Question[];
}

export function parseOptions (o?:string) {
  if( o ===undefined || o === '' ) {
    return undefined;
  }
  const p = JSON.parse(o);
  return p;
}

export function getQListContract (runner:ContractRunner) {
    return new Contract(qlistAddr, qlistABI, runner);
}

/*
export async function getQuestionList (runner:ContractRunner) : Promise<Questionnaire[]> {
    const contract = getQListContract(runner);
    const count = await contract.count();
    console.log('Count is', count);
    // TODO: parse options for each question
    return await contract.getList();
}
*/

export async function getTitles(runner:ContractRunner) : Promise<string[]> {
    const contract = getQListContract(runner);
    return await contract.getTitles();
}

export async function getQuestion (runner:ContractRunner, n:number) : Promise<any> {
  const contract = getQListContract(runner);
  const q = await contract.getOne(n);
  const ql = [];
  for( const x of q[2] ) {
    ql.push([x[0], x[1], parseOptions(x[2])]);
  }
  const result = [q[0], q[1], ql];
  return result;
}
