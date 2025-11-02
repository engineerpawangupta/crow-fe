import { useState, useCallback } from 'react';
import { Contract } from 'ethers';
import { useWeb3 } from '@contexts/Web3Context';
import { CONTRACT_ADDRESSES } from '@config/constants';
import { formatTokenAmount, parseTokenAmount } from '@utils/web3';

// TODO: Add actual contract ABI when available
const PRESALE_ABI = [
  // Example ABI - replace with actual contract ABI
  'function buyTokens(uint256 amount) external payable',
  'function claimTokens() external',
  'function getUserBalance(address user) external view returns (uint256)',
  'function getPresaleInfo() external view returns (uint256, uint256, uint256)',
  'function getRemainingTokens() external view returns (uint256)',
  'function getCurrentPrice() external view returns (uint256)'
];

export const usePresaleContract = () => {
  const { provider, walletAddress, isConnected, isCorrectNetwork } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get contract instance
  const getContract = useCallback(async () => {
    if (!provider || !CONTRACT_ADDRESSES.presale) {
      throw new Error('Provider or contract address not available');
    }

    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESSES.presale, PRESALE_ABI, signer);
  }, [provider]);

  // Buy tokens
  const buyTokens = useCallback(async (amount, currency = 'BNB') => {
    if (!isConnected || !isCorrectNetwork) {
      throw new Error('Please connect wallet and switch to correct network');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      
      // Convert amount to wei
      const amountInWei = formatTokenAmount(amount);

      let tx;
      if (currency === 'BNB') {
        // For native BNB payments
        tx = await contract.buyTokens(amountInWei, {
          value: amountInWei
        });
      } else {
        // For ERC20 token payments (USDT, etc.)
        // TODO: Implement token approval first
        tx = await contract.buyTokens(amountInWei);
      }

      const receipt = await tx.wait();
      
      setLoading(false);
      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }, [isConnected, isCorrectNetwork, getContract]);

  // Claim tokens
  const claimTokens = useCallback(async () => {
    if (!isConnected || !isCorrectNetwork) {
      throw new Error('Please connect wallet and switch to correct network');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const tx = await contract.claimTokens();
      const receipt = await tx.wait();
      
      setLoading(false);
      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }, [isConnected, isCorrectNetwork, getContract]);

  // Get user balance
  const getUserBalance = useCallback(async () => {
    if (!provider || !walletAddress || !CONTRACT_ADDRESSES.presale) {
      return '0';
    }

    try {
      const contract = await getContract();
      const balance = await contract.getUserBalance(walletAddress);
      return parseTokenAmount(balance);
    } catch (err) {
      console.error('Error getting user balance:', err);
      return '0';
    }
  }, [provider, walletAddress, getContract]);

  // Get presale info
  const getPresaleInfo = useCallback(async () => {
    if (!provider || !CONTRACT_ADDRESSES.presale) {
      return null;
    }

    try {
      const contract = await getContract();
      const [totalRaised, tokensSold, currentPrice] = await contract.getPresaleInfo();
      
      return {
        totalRaised: parseTokenAmount(totalRaised),
        tokensSold: parseTokenAmount(tokensSold),
        currentPrice: parseTokenAmount(currentPrice, 6) // Assuming 6 decimals for price
      };
    } catch (err) {
      console.error('Error getting presale info:', err);
      return null;
    }
  }, [provider, getContract]);

  // Get remaining tokens
  const getRemainingTokens = useCallback(async () => {
    if (!provider || !CONTRACT_ADDRESSES.presale) {
      return '0';
    }

    try {
      const contract = await getContract();
      const remaining = await contract.getRemainingTokens();
      return parseTokenAmount(remaining);
    } catch (err) {
      console.error('Error getting remaining tokens:', err);
      return '0';
    }
  }, [provider, getContract]);

  return {
    buyTokens,
    claimTokens,
    getUserBalance,
    getPresaleInfo,
    getRemainingTokens,
    loading,
    error
  };
};

