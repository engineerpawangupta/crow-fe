import { useState, useEffect } from 'react';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { useUSDTContract } from '@hooks/useUSDTContract';
import { usePresaleContract } from '@hooks/usePresaleContract';
import { Card } from '@components/common/Card/Card';
import { Input } from '@components/common/Input/Input';
import { Button } from '@components/common/Button/Button';
import { calculateTokenAmount } from '@utils/web3';
import { formatTokenAmount } from '@utils/formatters';
import { TOKEN_CONFIG, PRESALE_CONFIG, CONTRACT_ADDRESSES } from '@config/constants';
import styles from './PurchaseForm.module.css';

export const PurchaseForm = () => {
  const { isConnected, connectWallet } = useWeb3Wallet();
  
  // USDT Contract hook
  const {
    balance: usdtBalance,
    allowance,
    approveUSDT,
    hasApproval,
    updateBalance,
    updateAllowance,
    loading: usdtLoading
  } = useUSDTContract();

  // Presale Contract hook
  const {
    buyPresaleTokenUSDT,
    getTokenPrice,
    loading: presaleLoading
  } = usePresaleContract();

  const [amount, setAmount] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(TOKEN_CONFIG.initialPrice);
  const [approvalStatus, setApprovalStatus] = useState('none'); // 'none', 'pending', 'approved'
  const [purchaseStatus, setPurchaseStatus] = useState('idle'); // 'idle', 'pending', 'success', 'error'
  const [txHash, setTxHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate BCRW tokens based on payment amount
  const tokenAmount = amount ? calculateTokenAmount(amount, tokenPrice) : 0;

  // Fetch current token price
  useEffect(() => {
    if (isConnected) {
      getTokenPrice().then(price => {
        setTokenPrice(parseFloat(price));
      });
    }
  }, [isConnected, getTokenPrice]);

  // Check approval status when amount or allowance changes
  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setApprovalStatus('none');
        return;
      }

      const approved = await hasApproval(CONTRACT_ADDRESSES.presale, amount);
      setApprovalStatus(approved ? 'approved' : 'none');
    };

    if (isConnected && CONTRACT_ADDRESSES.presale) {
      checkApprovalStatus();
    }
  }, [amount, allowance, isConnected, hasApproval]);

  const handleMaxClick = () => {
    if (usdtBalance && parseFloat(usdtBalance) > 0) {
      setAmount(usdtBalance);
    }
  };

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) < PRESALE_CONFIG.minPurchaseUSDT) {
      setErrorMessage(`Minimum purchase is ${PRESALE_CONFIG.minPurchaseUSDT} USDT`);
      return;
    }

    setApprovalStatus('pending');
    setErrorMessage('');

    try {
      const result = await approveUSDT(CONTRACT_ADDRESSES.presale, amount, true);
      
      if (result.success) {
        setApprovalStatus('approved');
        setTxHash(result.txHash);
        await updateAllowance();
        console.log('✅ USDT approved successfully');
      }
    } catch (error) {
      console.error('Approval error:', error);
      setApprovalStatus('none');
      setErrorMessage(error.message || 'Approval failed. Please try again.');
    }
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) < PRESALE_CONFIG.minPurchaseUSDT) {
      setErrorMessage(`Minimum purchase is ${PRESALE_CONFIG.minPurchaseUSDT} USDT`);
      return;
    }

    // Check USDT balance
    if (parseFloat(usdtBalance) < parseFloat(amount)) {
      setErrorMessage('Insufficient USDT balance');
      return;
    }

    setPurchaseStatus('pending');
    setErrorMessage('');

    try {
      const result = await buyPresaleTokenUSDT(amount);
      
      if (result.success) {
        setPurchaseStatus('success');
        setTxHash(result.txHash);
        
        // Reset form
        setAmount('');
        setReferralCode('');
        setApprovalStatus('none');
        
        // Update balances
        await updateBalance();
        await updateAllowance();
        
        console.log('✅ Purchase successful:', result.txHash);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseStatus('error');
      setErrorMessage(error.message || 'Purchase failed. Please try again.');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setPurchaseStatus('idle');
      }, 5000);
    }
  };

  // Not connected - show connect button
  if (!isConnected) {
    return (
      <Card className={styles.purchaseForm}>
        <div className={styles.connectPrompt}>
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to participate in the presale</p>
          <Button variant="primary" size="large" onClick={connectWallet}>
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  const loading = usdtLoading || presaleLoading;

  return (
    <Card className={styles.purchaseForm}>
      <div className={styles.header}>
        <h3>Buy BCRW Tokens</h3>
        <p className={styles.paymentMethod}>Payment: USDT</p>
      </div>

      {/* USDT Balance Display */}
      <div className={styles.balanceInfo}>
        <span>Your USDT Balance:</span>
        <span className={styles.balanceAmount}>
          {parseFloat(usdtBalance).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
          })} USDT
        </span>
      </div>

      {/* Amount Input */}
      <div className={styles.inputSection}>
        <Input
          label="Amount (USDT)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          suffix={
            <button 
              className={styles.maxButton} 
              onClick={handleMaxClick}
              disabled={!usdtBalance || parseFloat(usdtBalance) === 0}
            >
              MAX
            </button>
          }
        />
        <p className={styles.minAmount}>
          Min. Amount to Purchase: {PRESALE_CONFIG.minPurchaseUSDT} USDT
        </p>
      </div>

      {/* Token Calculation */}
      <div className={styles.calculation}>
        <div className={styles.calculationLabel}>BCRW You'll Receive</div>
        <div className={styles.calculationValue}>
          {formatTokenAmount(tokenAmount, 2, 'CROWW')}
        </div>
        <div className={styles.priceInfo}>
          1 BCRW = ${tokenPrice.toFixed(6)} USDT
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {purchaseStatus === 'success' && (
        <div className={styles.successMessage}>
          ✅ Purchase successful! 
          {txHash && (
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              View on Etherscan
            </a>
          )}
        </div>
      )}

      {/* Step 1: Approve USDT */}
      {approvalStatus !== 'approved' && (
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleApprove}
          loading={approvalStatus === 'pending'}
          disabled={!amount || parseFloat(amount) < PRESALE_CONFIG.minPurchaseUSDT || loading}
          className={styles.approveButton}
        >
          {approvalStatus === 'pending' ? 'Approving USDT...' : '1. Approve USDT'}
        </Button>
      )}

      {/* Step 2: Buy Tokens */}
      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handleBuy}
        loading={purchaseStatus === 'pending'}
        disabled={
          approvalStatus !== 'approved' || 
          !amount || 
          parseFloat(amount) < PRESALE_CONFIG.minPurchaseUSDT ||
          parseFloat(usdtBalance) < parseFloat(amount) ||
          loading
        }
        className={styles.buyButton}
      >
        {purchaseStatus === 'pending' 
          ? 'Buying Tokens...' 
          : approvalStatus === 'approved' 
            ? '2. Buy BCRW Tokens' 
            : '2. Buy BCRW Tokens (Approve First)'}
      </Button>

      {/* Approval Status Indicator */}
      {approvalStatus === 'approved' && (
        <div className={styles.approvalIndicator}>
          ✅ USDT Approved - Ready to purchase
        </div>
      )}

      {/* Referral Section */}
      <div className={styles.referralSection}>
        <div 
          className={styles.referralToggle}
          onClick={() => setShowReferral(!showReferral)}
        >
          <span>{showReferral ? '−' : '+'}</span>
          <span>Have a referral code?</span>
        </div>
        
        {showReferral && (
          <div className={styles.referralInput}>
            <Input
              placeholder="Enter your referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Purchase Info */}
      <div className={styles.purchaseInfo}>
        <div className={styles.infoRow}>
          <span>Network:</span>
          <span>Ethereum Sepolia</span>
        </div>
        <div className={styles.infoRow}>
          <span>Token:</span>
          <span>{TOKEN_CONFIG.symbol}</span>
        </div>
      </div>
    </Card>
  );
};
