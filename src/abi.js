export const AgreementABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_initialBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_inputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_outputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_serverOwner",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_client",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_clientPubKey",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "clientPubKey",
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
        "internalType": "uint32",
        "name": "numInputTokens",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "numOutputTokens",
        "type": "uint32"
      }
    ],
    "name": "notifyResponse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "remainingBalance",
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
    "inputs": [],
    "name": "satisfied",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "serverAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unsatisfied",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


export const BrokerABI =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "serverAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "serverCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "createServer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "index",
        "type": "uint32"
      }
    ],
    "name": "deleteServer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllServers",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "model",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "inputTokenCost",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "outputTokenCost",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "serverContract",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "internalType": "struct LLMBroker.Server[]",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "market",
    "outputs": [
      {
        "internalType": "string",
        "name": "model",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "inputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "outputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "serverContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "index",
        "type": "uint32"
      }
    ],
    "name": "updateServerDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "index",
        "type": "uint32"
      },
      {
        "internalType": "string",
        "name": "_model",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_inputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_outputTokenCost",
        "type": "uint256"
      }
    ],
    "name": "updateServerDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "index",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "_inputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_outputTokenCost",
        "type": "uint256"
      }
    ],
    "name": "updateServerTokenCost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ServerABI = [
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_serverOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_brokerAddress",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "_brokerIndex",
        "type": "uint32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "agreements",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "costInUSD",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pubKey",
        "type": "uint256"
      }
    ],
    "name": "createAgreement",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentAgreements",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "destroySelf",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endAgreement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "clientAddress",
        "type": "address"
      }
    ],
    "name": "getAgreementContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "clientAddress",
        "type": "address"
      }
    ],
    "name": "getAgreementPubKey",
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
    "inputs": [],
    "name": "getInputTokenCost",
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
    "inputs": [],
    "name": "getOutputTokenCost",
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
    "inputs": [],
    "name": "model",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_inputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_outputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_costInUSD",
        "type": "bool"
      }
    ],
    "name": "setTokenCost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_maxConcurrentAgreements",
        "type": "uint16"
      }
    ],
    "name": "setmaxConcurrentAgreements",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_endpoint",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_model",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_inputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_outputTokenCost",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_costInUSD",
        "type": "bool"
      }
    ],
    "name": "setupModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "newIndex",
        "type": "uint32"
      }
    ],
    "name": "updateIndex",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];