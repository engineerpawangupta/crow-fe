import { useState, useCallback } from 'react';
import { Contract, BrowserProvider, JsonRpcProvider, formatUnits, parseUnits } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { CONTRACT_ADDRESSES, TOKEN_CONFIG, USDT_CONFIG } from '@config/constants';
import { PresaleABI } from '@contracts/PresaleABI';

export const usePresaleContract = () => {
  const { address: walletAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { isCorrectNetwork } = useWeb3Wallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentEnv = import.meta.env.VITE_NETWORK_ENV || 'testnet';

  // Get contract instance
  const getContract = useCallback(async (readOnly = false) => {
    if (!CONTRACT_ADDRESSES.presale) {
      throw new Error('Presale contract address not configured');
    }

    if (readOnly) {
      if (walletClient) {
        const provider = new BrowserProvider(walletClient);
        return new Contract(CONTRACT_ADDRESSES.presale, PresaleABI, provider);
      }

      const rpcUrl = currentEnv === 'mainnet'
        ? 'https://cloudflare-eth.com'
        : 'https://rpc.sepolia.org';
      const provider = new JsonRpcProvider(rpcUrl);
      return new Contract(CONTRACT_ADDRESSES.presale, PresaleABI, provider);
    }

    if (!walletClient) {
      throw new Error('Wallet client not available');
    }

    const provider = new BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESSES.presale, PresaleABI, signer);
  }, [walletClient, currentEnv]);

  // Get USDT address from contract
  const getUsdtAddress = useCallback(async () => {
    try {
      const contract = await getContract(true);
      const usdtAddr = await contract.getUsdtAddress();
      return usdtAddr;
    } catch (err) {
      console.error('Error getting USDT address:', err);
      return CONTRACT_ADDRESSES.usdt; // Fallback to env config
    }
  }, [getContract]);

  // Get current token price
  const getTokenPrice = useCallback(async () => {
    try {
      const contract = await getContract(true);
      const priceWei = await contract.getTokenPrice();
      // Price is returned in USDT units (6 decimals)
      const price = formatUnits(priceWei, USDT_CONFIG.decimals);
      return price;
    } catch (err) {
      console.error('Error getting token price:', err);
      return TOKEN_CONFIG.initialPrice.toString(); // Fallback to config
    }
  }, [getContract]);

  // Buy presale tokens with USDT
  const buyPresaleTokenUSDT = useCallback(async (usdtAmount) => {
    if (!isConnected || !isCorrectNetwork) {
      throw new Error('Please connect wallet and switch to correct network');
    }

    if (!usdtAmount || parseFloat(usdtAmount) <= 0) {
      throw new Error('Invalid purchase amount');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      
      // Convert USDT amount to proper units (6 decimals)
      const amountInUnits = parseUnits(usdtAmount.toString(), USDT_CONFIG.decimals);

      console.log('Buying tokens with USDT:', {
        usdtAmount,
        amountInUnits: amountInUnits.toString()
      });

      // Call buyPresaleToken function
      const tx = await contract.buyPresaleToken(amountInUnits);
      
      console.log('Purchase transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      
      console.log('Purchase confirmed:', receipt.hash);
      
      setLoading(false);
      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      console.error('Purchase error:', err);
      throw err;
    }
  }, [isConnected, isCorrectNetwork, getContract]);

  // Get total number of buyers
  const getTotalBuyers = useCallback(async () => {
    try {
      const contract = await getContract(true);
      const count = await contract.getTotalBuyers();
      return count.toString();
    } catch (err) {
      console.error('Error getting total buyers:', err);
      return '0';
    }
  }, [getContract]);

  // Get total tokens sold
  const getTotalTokensSold = useCallback(async () => {
    try {
      const contract = await getContract(true);
      const sold = await contract.getTotalTokensSold();
      return formatUnits(sold, TOKEN_CONFIG.decimals);
    } catch (err) {
      console.error('Error getting total tokens sold:', err);
      return '0';
    }
  }, [getContract]);

  // Get total USDT received
  const getTotalUSDTReceived = useCallback(async () => {
    try {
      const contract = await getContract(true);
      const received = await contract.getTotalUSDTReceived();
      return formatUnits(received, USDT_CONFIG.decimals);
    } catch (err) {
      console.error('Error getting total USDT received:', err);
      return '0';
    }
  }, [getContract]);

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

  // Get remaining tokens
  const getRemainingTokens = useCallback(async () => {
    try {
      const contract = await getContract(true);
      const remaining = await contract.getRemainingTokens();
      return formatUnits(remaining, TOKEN_CONFIG.decimals);
    } catch (err) {
      console.error('Error getting remaining tokens:', err);
      return '0';
    }
  }, [getContract]);

  // Get user's purchased token balance
  const getUserBalance = useCallback(async () => {
    if (!walletAddress || !CONTRACT_ADDRESSES.presale) {
      return '0';
    }

    try {
      const contract = await getContract(true);
      const balance = await contract.getUserBalance(walletAddress);
      return formatUnits(balance, TOKEN_CONFIG.decimals);
    } catch (err) {
      console.error('Error getting user balance:', err);
      return '0';
    }
  }, [walletAddress, getContract]);

  // Get user's purchase history
  const fetchUserBuyDetails = useCallback(async () => {
    if (!walletAddress) {
      return [];
    }

    try {
      const contract = await getContract(true);
      const purchases = await contract.fetchUserBuyDetails(walletAddress);
      
      // Format purchase data
      // Note: buyOptions is a string in the actual contract ("USDT" or "Fiat")
      return purchases.map(purchase => ({
        buyerAddress: purchase.buyerAddress,
        usdtAddress: purchase.usdtAddress,
        usdtValue: formatUnits(purchase.usdtValue, USDT_CONFIG.decimals),
        tokenValue: formatUnits(purchase.tokenValue, TOKEN_CONFIG.decimals),
        buyOption: purchase.buyOptions, // Already a string: "USDT" or "Fiat"
        timestamp: Number(purchase.currentTime),
        status: purchase.status
      }));
    } catch (err) {
      console.error('Error fetching user purchase history:', err);
      return [];
    }
  }, [walletAddress, getContract]);

  return {
    // USDT purchase functions
    getUsdtAddress,
    getTokenPrice,
    buyPresaleTokenUSDT,
    
    // Stats functions
    getTotalBuyers,
    getTotalTokensSold,
    getTotalUSDTReceived,
    getRemainingTokens,
    
    // User functions
    getUserBalance,
    fetchUserBuyDetails,
    claimTokens,
    
    // State
    loading,
    error
  };
};

