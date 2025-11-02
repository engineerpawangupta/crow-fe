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
