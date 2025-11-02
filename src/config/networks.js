// Network configurations for BSC

export const NETWORKS = {
  testnet: {
    chainId: 97,
    chainIdHex: '0x61',
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },
  mainnet: {
    chainId: 56,
    chainIdHex: '0x38',
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  }
};

// Get current network based on environment variable
export const getCurrentNetwork = () => {
  const env = import.meta.env.VITE_NETWORK_ENV || 'testnet';
  return NETWORKS[env] || NETWORKS.testnet;
};

// Get network by chain ID
export const getNetworkByChainId = (chainId) => {
  return Object.values(NETWORKS).find(network => network.chainId === chainId);
};

// Check if chain ID is supported
export const isSupportedChain = (chainId) => {
  return Object.values(NETWORKS).some(network => network.chainId === chainId);
};

// Add network to wallet
export const addNetwork = async (networkConfig) => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet found');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: networkConfig.chainIdHex,
        chainName: networkConfig.name,
        nativeCurrency: networkConfig.nativeCurrency,
        rpcUrls: [networkConfig.rpcUrl],
        blockExplorerUrls: [networkConfig.blockExplorer]
      }]
    });
  } catch (error) {
    console.error('Error adding network:', error);
    throw error;
  }
};
