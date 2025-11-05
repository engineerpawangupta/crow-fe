import { useState, useCallback, useEffect } from 'react';
import { Contract, BrowserProvider, parseUnits, formatUnits } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { CONTRACT_ADDRESSES, USDT_CONFIG, APPROVAL_CONSTANTS } from '@config/constants';
import { USDTABI } from '@contracts/USDTABI';

export const useUSDTContract = () => {
  const { address: walletAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { isCorrectNetwork } = useWeb3Wallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState('0');
  const [allowance, setAllowance] = useState('0');

  // Get USDT contract instance
  const getContract = useCallback(async (readOnly = false) => {
    if (!CONTRACT_ADDRESSES.usdt) {
      throw new Error('USDT contract address not configured');
    }

    if (readOnly && walletClient) {
      // For read-only operations, we can use a provider without signer
      const provider = new BrowserProvider(walletClient);
      return new Contract(CONTRACT_ADDRESSES.usdt, USDTABI, provider);
    }

    if (!walletClient) {
      throw new Error('Wallet client not available');
    }

    // Convert wagmi wallet client to ethers provider and signer
    const provider = new BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESSES.usdt, USDTABI, signer);
  }, [walletClient]);

  // Get user's USDT balance
  const getUSDTBalance = useCallback(async () => {
    if (!walletAddress || !CONTRACT_ADDRESSES.usdt) {
      return '0';
    }

    try {
      const contract = await getContract(true);
      const balanceWei = await contract.balanceOf(walletAddress);
      const formattedBalance = formatUnits(balanceWei, USDT_CONFIG.decimals);
      return formattedBalance;
    } catch (err) {
      console.error('Error getting USDT balance:', err);
      return '0';
    }
  }, [walletAddress, getContract]);

  // Check current allowance for presale contract
  const checkAllowance = useCallback(async (spenderAddress) => {
    if (!walletAddress || !spenderAddress) {
      return '0';
    }

    try {
      const contract = await getContract(true);
      const allowanceWei = await contract.allowance(walletAddress, spenderAddress);
      const formattedAllowance = formatUnits(allowanceWei, USDT_CONFIG.decimals);
      return formattedAllowance;
    } catch (err) {
      console.error('Error checking allowance:', err);
      return '0';
    }
  }, [walletAddress, getContract]);

  // Check if user has sufficient approval
  const hasApproval = useCallback(async (spenderAddress, amount) => {
    if (!spenderAddress || !amount) {
      return false;
    }

    try {
      const currentAllowance = await checkAllowance(spenderAddress);
      return parseFloat(currentAllowance) >= parseFloat(amount);
    } catch (err) {
      console.error('Error checking approval:', err);
      return false;
    }
  }, [checkAllowance]);

  // Approve USDT spending
  const approveUSDT = useCallback(async (spenderAddress, amount, unlimited = true) => {
    if (!isConnected || !isCorrectNetwork) {
      throw new Error('Please connect wallet and switch to correct network');
    }

    if (!spenderAddress) {
      throw new Error('Spender address is required');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      
      // Use unlimited approval or specific amount
      let approvalAmount;
      if (unlimited || APPROVAL_CONSTANTS.USE_UNLIMITED_APPROVAL) {
        approvalAmount = APPROVAL_CONSTANTS.MAX_UINT256;
      } else {
        // Parse amount with USDT decimals (6)
        approvalAmount = parseUnits(amount.toString(), USDT_CONFIG.decimals);
      }

      console.log('Approving USDT:', {
        spender: spenderAddress,
        amount: unlimited ? 'Unlimited' : amount,
        rawAmount: approvalAmount.toString()
      });

      const tx = await contract.approve(spenderAddress, approvalAmount);
      
      console.log('Approval transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      
      console.log('Approval confirmed:', receipt.hash);
      
      // Update allowance after successful approval
      const newAllowance = await checkAllowance(spenderAddress);
      setAllowance(newAllowance);
      
      setLoading(false);
      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error('Approval error:', err);
      throw err;
    }
  }, [isConnected, isCorrectNetwork, getContract, checkAllowance]);

  // Fetch and update balance
  const updateBalance = useCallback(async () => {
    if (!walletAddress) {
      setBalance('0');
      return;
    }

    try {
      const newBalance = await getUSDTBalance();
      setBalance(newBalance);
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  }, [walletAddress, getUSDTBalance]);

  // Fetch and update allowance for presale contract
  const updateAllowance = useCallback(async () => {
    if (!walletAddress || !CONTRACT_ADDRESSES.presale) {
      setAllowance('0');
      return;
    }

    try {
      const newAllowance = await checkAllowance(CONTRACT_ADDRESSES.presale);
      setAllowance(newAllowance);
    } catch (err) {
      console.error('Error updating allowance:', err);
    }
  }, [walletAddress, checkAllowance]);

  // Auto-update balance and allowance when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      updateBalance();
      updateAllowance();
    }
  }, [isConnected, walletAddress, updateBalance, updateAllowance]);

  return {
    // State
    balance,
    allowance,
    loading,
    error,
    
    // Functions
    getUSDTBalance,
    checkAllowance,
    approveUSDT,
    hasApproval,
    updateBalance,
    updateAllowance
  };
};

