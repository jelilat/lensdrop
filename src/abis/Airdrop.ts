export const LensdropAbi = [
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "sender",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "address",
		  "name": "token",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		}
	  ],
	  "name": "ERC1155Drop",
	  "type": "event"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "sender",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "address",
		  "name": "token",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		},
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		}
	  ],
	  "name": "ERC20Drop",
	  "type": "event"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "sender",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "address",
		  "name": "token",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		}
	  ],
	  "name": "ERC721Drop",
	  "type": "event"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "sender",
		  "type": "address"
		},
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		},
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		}
	  ],
	  "name": "NativeDrop",
	  "type": "event"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "previousOwner",
		  "type": "address"
		},
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "newOwner",
		  "type": "address"
		}
	  ],
	  "name": "OwnershipTransferred",
	  "type": "event"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "",
		  "type": "string"
		}
	  ],
	  "name": "Escrows",
	  "outputs": [
		{
		  "internalType": "address",
		  "name": "user",
		  "type": "address"
		},
		{
		  "internalType": "address",
		  "name": "token",
		  "type": "address"
		},
		{
		  "internalType": "bool",
		  "name": "paid",
		  "type": "bool"
		},
		{
		  "internalType": "string",
		  "name": "rewardDetails",
		  "type": "string"
		},
		{
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "deadline",
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
	  "stateMutability": "payable",
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
	  "stateMutability": "payable",
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
	  "stateMutability": "payable",
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
	  "inputs": [],
	  "name": "controller",
	  "outputs": [
		{
		  "internalType": "address payable",
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
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "rewardDetails",
		  "type": "string"
		},
		{
		  "internalType": "address",
		  "name": "tokenAddress",
		  "type": "address"
		},
		{
		  "internalType": "uint256[]",
		  "name": "tokenIds",
		  "type": "uint256[]"
		},
		{
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "deadline",
		  "type": "uint256"
		}
	  ],
	  "name": "escrowErc1155Tokens",
	  "outputs": [
		{
		  "components": [
			{
			  "internalType": "address",
			  "name": "user",
			  "type": "address"
			},
			{
			  "internalType": "address",
			  "name": "token",
			  "type": "address"
			},
			{
			  "internalType": "uint256[]",
			  "name": "tokenIds",
			  "type": "uint256[]"
			},
			{
			  "internalType": "bool",
			  "name": "paid",
			  "type": "bool"
			},
			{
			  "internalType": "string",
			  "name": "rewardDetails",
			  "type": "string"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "noOfRecipients",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "deadline",
			  "type": "uint256"
			}
		  ],
		  "internalType": "struct Lensdrop.EscrowDetails",
		  "name": "",
		  "type": "tuple"
		}
	  ],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "rewardDetails",
		  "type": "string"
		},
		{
		  "internalType": "address",
		  "name": "tokenAddress",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "deadline",
		  "type": "uint256"
		}
	  ],
	  "name": "escrowErc20Tokens",
	  "outputs": [
		{
		  "components": [
			{
			  "internalType": "address",
			  "name": "user",
			  "type": "address"
			},
			{
			  "internalType": "address",
			  "name": "token",
			  "type": "address"
			},
			{
			  "internalType": "uint256[]",
			  "name": "tokenIds",
			  "type": "uint256[]"
			},
			{
			  "internalType": "bool",
			  "name": "paid",
			  "type": "bool"
			},
			{
			  "internalType": "string",
			  "name": "rewardDetails",
			  "type": "string"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "noOfRecipients",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "deadline",
			  "type": "uint256"
			}
		  ],
		  "internalType": "struct Lensdrop.EscrowDetails",
		  "name": "",
		  "type": "tuple"
		}
	  ],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "rewardDetails",
		  "type": "string"
		},
		{
		  "internalType": "address",
		  "name": "tokenAddress",
		  "type": "address"
		},
		{
		  "internalType": "uint256[]",
		  "name": "tokenIds",
		  "type": "uint256[]"
		},
		{
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "deadline",
		  "type": "uint256"
		}
	  ],
	  "name": "escrowErc721Tokens",
	  "outputs": [
		{
		  "components": [
			{
			  "internalType": "address",
			  "name": "user",
			  "type": "address"
			},
			{
			  "internalType": "address",
			  "name": "token",
			  "type": "address"
			},
			{
			  "internalType": "uint256[]",
			  "name": "tokenIds",
			  "type": "uint256[]"
			},
			{
			  "internalType": "bool",
			  "name": "paid",
			  "type": "bool"
			},
			{
			  "internalType": "string",
			  "name": "rewardDetails",
			  "type": "string"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "noOfRecipients",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "deadline",
			  "type": "uint256"
			}
		  ],
		  "internalType": "struct Lensdrop.EscrowDetails",
		  "name": "",
		  "type": "tuple"
		}
	  ],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "rewardDetails",
		  "type": "string"
		},
		{
		  "internalType": "uint256",
		  "name": "amount",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "noOfRecipients",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "deadline",
		  "type": "uint256"
		}
	  ],
	  "name": "escrowTokens",
	  "outputs": [
		{
		  "components": [
			{
			  "internalType": "address",
			  "name": "user",
			  "type": "address"
			},
			{
			  "internalType": "address",
			  "name": "token",
			  "type": "address"
			},
			{
			  "internalType": "uint256[]",
			  "name": "tokenIds",
			  "type": "uint256[]"
			},
			{
			  "internalType": "bool",
			  "name": "paid",
			  "type": "bool"
			},
			{
			  "internalType": "string",
			  "name": "rewardDetails",
			  "type": "string"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "noOfRecipients",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "deadline",
			  "type": "uint256"
			}
		  ],
		  "internalType": "struct Lensdrop.EscrowDetails",
		  "name": "",
		  "type": "tuple"
		}
	  ],
	  "stateMutability": "payable",
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
	  "name": "getUserEscrows",
	  "outputs": [
		{
		  "internalType": "string[]",
		  "name": "",
		  "type": "string[]"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address payable",
		  "name": "_controller",
		  "type": "address"
		}
	  ],
	  "name": "initialize",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [],
	  "name": "owner",
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
	  "name": "renounceOwnership",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		}
	  ],
	  "name": "reward",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		}
	  ],
	  "name": "rewardErc1155Tokens",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		}
	  ],
	  "name": "rewardErc721Tokens",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "postId",
		  "type": "string"
		},
		{
		  "internalType": "address[]",
		  "name": "recipients",
		  "type": "address[]"
		}
	  ],
	  "name": "rewardTokens",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [],
	  "name": "totalEscrows",
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
		  "name": "newOwner",
		  "type": "address"
		}
	  ],
	  "name": "transferOwnership",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "stateMutability": "payable",
	  "type": "receive"
	}
  ]