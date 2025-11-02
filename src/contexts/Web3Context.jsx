import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { BrowserProvider } from 'ethers';
import { getCurrentNetwork, isSupportedChain, addNetwork } from '@config/networks';
import { CONTRACT_ADDRESSES } from '@config/constants';

const Web3Context = createContext(null);

// Web3Modal configuration (Reown)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a21854a77c3b6670a9c1b857e35ef5ea';
const currentNetwork = getCurrentNetwork();

const metadata = {
  name: 'Blackcroww ICO',
  description: 'Blackcroww Token Presale - Powered by Reown',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: [`${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png`]
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: currentNetwork.rpcUrl,
  defaultChainId: currentNetwork.chainId
});

// Create Web3Modal (Reown) instance
const modal = createWeb3Modal({
  ethersConfig,
  chains: [
    {
      chainId: 97,
      name: 'BSC Testnet',
      currency: 'BNB',
      explorerUrl: 'https://testnet.bscscan.com',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    },
    {
      chainId: 56,
      name: 'BSC Mainnet',
      currency: 'BNB',
      explorerUrl: 'https://bscscan.com',
      rpcUrl: 'https://bsc-dataseed.binance.org/'
    }
  ],
  projectId,
  enableAnalytics: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#00d4ff',
    '--w3m-border-radius-master': '8px',
    '--w3m-z-index': '9999'
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa' // Coinbase
  ]
});

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check if wallet is connected
  const checkConnection = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.listAccounts();
      
      if (accounts.length > 0) {
        const network = await browserProvider.getNetwork();
        const signerInstance = await browserProvider.getSigner();
        
        setWalletAddress(accounts[0].address);
        setChainId(Number(network.chainId));
        setProvider(browserProvider);
        setSigner(signerInstance);
        setIsConnected(true);
        setIsCorrectNetwork(Number(network.chainId) === currentNetwork.chainId);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  }, []);

  // Connect wallet - Open Web3Modal (Reown)
  const connectWallet = useCallback(async () => {
    try {
      // Open Web3Modal
      modal.open();
      
      // Wait a bit then check connection
      setTimeout(() => {
        checkConnection();
      }, 1000);
    } catch (error) {
      console.error('Error opening wallet modal:', error);
    }
  }, [checkConnection]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await modal.disconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      setWalletAddress(null);
      setChainId(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
      setIsCorrectNetwork(false);
    }
  }, []);

  // Switch to correct network
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: currentNetwork.chainIdHex }]
      });
      setIsCorrectNetwork(true);
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await addNetwork(currentNetwork);
          setIsCorrectNetwork(true);
        } catch (addError) {
          console.error('Error adding network:', addError);
          alert('Failed to add network. Please add it manually.');
        }
      } else {
        console.error('Error switching network:', error);
      }
    }
  }, []);

  // Subscribe to Web3Modal events
  useEffect(() => {
    const unsubscribe = modal.subscribeState((state) => {
      if (state.open === false) {
        // Modal closed, check if wallet connected
        setTimeout(() => {
          checkConnection();
        }, 500);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [checkConnection]);

  // Listen to account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        checkConnection();
      }
    };

    const handleChainChanged = (chainIdHex) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      setIsCorrectNetwork(newChainId === currentNetwork.chainId);
      checkConnection();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkConnection, disconnectWallet]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const value = {
    walletAddress,
    chainId,
    provider,
    signer,
    isConnected,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    currentNetwork,
    contractAddresses: CONTRACT_ADDRESSES,
    modal
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};
