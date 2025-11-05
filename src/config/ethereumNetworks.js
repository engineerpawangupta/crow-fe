// Ethereum Network definitions for Reown AppKit
// These are imported from @reown/appkit/networks in Web3Context
// This file serves as documentation for network configurations

export const sepoliaTestnet = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.org'],
      webSocket: ['wss://ethereum-sepolia.publicnode.com']
    },
    public: {
      http: ['https://rpc.sepolia.org'],
      webSocket: ['wss://ethereum-sepolia.publicnode.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532
    }
  },
  testnet: true
};

export const ethereumMainnet = {
  id: 1,
  name: 'Ethereum',
  network: 'homestead',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://cloudflare-eth.com'],
      webSocket: ['wss://ethereum.publicnode.com']
    },
    public: {
      http: ['https://cloudflare-eth.com'],
      webSocket: ['wss://ethereum.publicnode.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601
    }
  },
  testnet: false
};
