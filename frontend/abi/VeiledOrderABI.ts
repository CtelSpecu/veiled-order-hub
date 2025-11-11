
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const VeiledOrderABI = {
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isBuy",
          "type": "bool"
        }
      ],
      "name": "OrderSubmitted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getMyOrderIndices",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        }
      ],
      "name": "getOrder",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "amount",
          "type": "bytes32"
        },
        {
          "internalType": "euint32",
          "name": "price",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "isBuy",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
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
      "inputs": [],
      "name": "getOrderCount",
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
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserOrderCount",
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
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "amount",
          "type": "bytes32"
        },
        {
          "internalType": "externalEuint32",
          "name": "price",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "isBuy",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "inputProof",
          "type": "bytes"
        }
      ],
      "name": "submitOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

