// Web3 utility functions
import { ethers } from 'ethers';

// Convert Wei to Ether
export const fromWei = (value, decimals = 18) => {
  if (!value) return '0';
  try {
    return ethers.formatUnits(value.toString(), decimals);
  } catch (error) {
    console.error('Error converting from Wei:', error);
    return '0';
  }
};

// Convert Ether to Wei
export const toWei = (value, decimals = 18) => {
  if (!value) return '0';
  try {
    return ethers.parseUnits(value.toString(), decimals).toString();
  } catch (error) {
    console.error('Error converting to Wei:', error);
    return '0';
  }
};

// Get provider from window.ethereum
export const getProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
};

// Get signer from provider
export const getSigner = async (provider) => {
  if (!provider) return null;
  try {
    return await provider.getSigner();
  } catch (error) {
    console.error('Error getting signer:', error);
    return null;
  }
};

// Get contract instance
export const getContract = (address, abi, signerOrProvider) => {
  if (!address || !abi || !signerOrProvider) return null;
  try {
    return new ethers.Contract(address, abi, signerOrProvider);
  } catch (error) {
    console.error('Error creating contract instance:', error);
    return null;
  }
};

// Request account access
export const requestAccounts = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet found. Please install MetaMask.');
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    return accounts[0];
  } catch (error) {
    console.error('Error requesting accounts:', error);
    throw error;
  }
};

// Switch network
export const switchNetwork = async (chainId) => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet found');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      throw new Error('Network not added to wallet');
    }
    throw error;
  }
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

// Get current chain ID
export const getCurrentChainId = async () => {
  if (!window.ethereum) return null;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return null;
  }
};

// Get balance
export const getBalance = async (provider, address) => {
  if (!provider || !address) return '0';
  
  try {
    const balance = await provider.getBalance(address);
    return fromWei(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

// Wait for transaction
export const waitForTransaction = async (provider, txHash) => {
  if (!provider || !txHash) return null;
  
  try {
    const receipt = await provider.waitForTransaction(txHash);
    return receipt;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    throw error;
  }
};

// Calculate token price in payment currency
export const calculateTokenAmount = (paymentAmount, tokenPrice) => {
  if (!paymentAmount || !tokenPrice) return 0;
  return parseFloat(paymentAmount) / parseFloat(tokenPrice);
};

// Calculate payment amount from token amount
export const calculatePaymentAmount = (tokenAmount, tokenPrice) => {
  if (!tokenAmount || !tokenPrice) return 0;
  return parseFloat(tokenAmount) * parseFloat(tokenPrice);
};

// ===== USDT Formatting Helpers =====

// Format USDT amount (18 decimals for testnet, 6 for mainnet)
// NOTE: Testnet mock USDT uses 18 decimals, different from mainnet's 6
export const formatUSDT = (amount, decimals = 18) => {
  if (!amount) return '0';
  try {
    return ethers.formatUnits(amount.toString(), decimals);
  } catch (error) {
    console.error('Error formatting USDT:', error);
    return '0';
  }
};

// Parse USDT amount (18 decimals for testnet, 6 for mainnet)
export const parseUSDT = (amount, decimals = 18) => {
  if (!amount) return '0';
  try {
    return ethers.parseUnits(amount.toString(), decimals).toString();
  } catch (error) {
    console.error('Error parsing USDT:', error);
    return '0';
  }
};

// ===== Approval Amount Helpers =====

// Get max uint256 for unlimited approval
export const getMaxApproval = () => {
  return ethers.MaxUint256.toString();
};

// Format approval amount for display
export const formatApprovalAmount = (amount, unlimited = false) => {
  if (unlimited || amount === getMaxApproval()) {
    return 'Unlimited';
  }
  return formatUSDT(amount);
};

// Check if amount is max approval
export const isUnlimitedApproval = (amount) => {
  try {
    const maxUint = ethers.MaxUint256;
    return BigInt(amount) >= maxUint;
  } catch (error) {
    return false;
  }
};

// ===== Transaction Helpers =====

// Get Etherscan/Explorer URL for transaction
export const getExplorerUrl = (txHash, network = 'sepolia') => {
  const baseUrls = {
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    bsc: 'https://bscscan.com',
    bscTestnet: 'https://testnet.bscscan.com'
  };

  const baseUrl = baseUrls[network] || baseUrls.sepolia;
  return `${baseUrl}/tx/${txHash}`;
};

// Get address URL on explorer
export const getAddressExplorerUrl = (address, network = 'sepolia') => {
  const baseUrls = {
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    bsc: 'https://bscscan.com',
    bscTestnet: 'https://testnet.bscscan.com'
  };

  const baseUrl = baseUrls[network] || baseUrls.sepolia;
  return `${baseUrl}/address/${address}`;
};

// Wait for transaction with timeout
export const waitForTransactionWithTimeout = async (provider, txHash, timeoutMs = 120000) => {
  if (!provider || !txHash) return null;

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs)
    );

    const receiptPromise = provider.waitForTransaction(txHash);

    const receipt = await Promise.race([receiptPromise, timeoutPromise]);
    return receipt;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    throw error;
  }
};

// Parse transaction error message
export const parseTransactionError = (error) => {
  if (!error) return 'Unknown error occurred';

  // User rejected transaction
  if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
    return 'Transaction rejected by user';
  }

  // Insufficient funds
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for transaction';
  }

  // Network error
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection';
  }

  // Contract revert
  if (error.message && error.message.includes('revert')) {
    const match = error.message.match(/revert (.+?)"/);
    if (match && match[1]) {
      return `Transaction failed: ${match[1]}`;
    }
    return 'Transaction reverted by contract';
  }

  // Gas estimation error
  if (error.message && error.message.includes('gas')) {
    return 'Gas estimation failed. Transaction may fail.';
  }

  // Default error message
  return error.message || 'Transaction failed';
};

// Shorten address for display
export const shortenAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

// Validate Ethereum address
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

// ===== Token Formatting Helpers =====

// Generic format token amount
export const formatTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  try {
    return ethers.formatUnits(amount.toString(), decimals);
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

// Generic parse token amount
export const parseTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  try {
    return ethers.parseUnits(amount.toString(), decimals).toString();
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return '0';
  }
};
