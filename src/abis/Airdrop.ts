export const LensdropAbi = [
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "tokenAddress",
		  "type": "address"
		},
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		},
		{
		  "internalType": "uint256[]",
		  "name": "tokenIds",
		  "type": "uint256[]"
		}
	  ],
	  "name": "batchSendERC1155",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		},
		{
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		},
		{
		  "internalType": "address",
		  "name": "tokenAddress",
		  "type": "address"
		}
	  ],
	  "name": "batchSendERC20",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "tokenAddress",
		  "type": "address"
		},
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		},
		{
		  "internalType": "uint256[]",
		  "name": "tokenIds",
		  "type": "uint256[]"
		}
	  ],
	  "name": "batchSendERC721",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		},
		{
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		}
	  ],
	  "name": "batchSendNativeToken",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "stateMutability": "payable",
	  "type": "receive"
	}
  ]