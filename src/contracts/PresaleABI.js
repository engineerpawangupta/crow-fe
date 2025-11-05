// BlackCroww Presale Contract ABI - ACTUAL TESTNET ABI
// Contract Address: 0xdD25f57232d12a150413F67798500F92E9127b18

export const PresaleABI = [
  // View Functions - Read Contract Data
  {
    inputs: [],
    name: 'getUsdtAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTokenPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalBuyers',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalTokensSold',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalUSDTReceived',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalFiatReceived',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRemainingTokens',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalTransactions',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getPresaleStatus',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTokenAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getReceiverAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getUserList',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'userAddress', type: 'address' }],
    name: 'fetchUserBuyDetails',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'buyerAddress', type: 'address' },
          { internalType: 'address', name: 'usdtAddress', type: 'address' },
          { internalType: 'uint256', name: 'usdtValue', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenValue', type: 'uint256' },
          { internalType: 'string', name: 'buyOptions', type: 'string' },
          { internalType: 'uint256', name: 'currentTime', type: 'uint256' },
          { internalType: 'bool', name: 'status', type: 'bool' }
        ],
        internalType: 'struct BlackCrowwPresale.BuyDetails[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllBuyDetails',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'buyerAddress', type: 'address' },
          { internalType: 'address', name: 'usdtAddress', type: 'address' },
          { internalType: 'uint256', name: 'usdtValue', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenValue', type: 'uint256' },
          { internalType: 'string', name: 'buyOptions', type: 'string' },
          { internalType: 'uint256', name: 'currentTime', type: 'uint256' },
          { internalType: 'bool', name: 'status', type: 'bool' }
        ],
        internalType: 'struct BlackCrowwPresale.BuyDetails[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },

  // State-Changing Functions - Write to Contract
  {
    inputs: [{ internalType: 'uint256', name: 'usdtToken', type: 'uint256' }],
    name: 'buyPresaleToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'usdtValue', type: 'uint256' },
      { indexed: true, internalType: 'string', name: 'buyOptions', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'tokenValue', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    name: 'TokenPurchased',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'ownerAddress', type: 'address' },
      { indexed: true, internalType: 'bool', name: 'status', type: 'bool' }
    ],
    name: 'PresaleStatus',
    type: 'event'
  }
];
