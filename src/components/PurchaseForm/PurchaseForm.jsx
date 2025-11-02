import { useState } from 'react';
import { useWeb3 } from '@contexts/Web3Context';
import { Card } from '@components/common/Card/Card';
import { Input } from '@components/common/Input/Input';
import { Button } from '@components/common/Button/Button';
import { calculateTokenAmount } from '@utils/web3';
import { formatTokenAmount } from '@utils/formatters';
import { TOKEN_CONFIG, PAYMENT_CURRENCIES, PRESALE_CONFIG } from '@config/constants';
import styles from './PurchaseForm.module.css';

export const PurchaseForm = () => {
  const { isConnected, connectWallet } = useWeb3();
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [loading, setLoading] = useState(false);

  const currencies = Object.keys(PAYMENT_CURRENCIES);

  // Calculate BCRW tokens based on payment amount
  const tokenAmount = amount ? calculateTokenAmount(amount, TOKEN_CONFIG.initialPrice) : 0;

  const handleMaxClick = () => {
    // In real implementation, this would get user's balance
    setAmount('1000');
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) < PRESALE_CONFIG.minPurchaseUSDT) {
      alert(`Minimum purchase is ${PRESALE_CONFIG.minPurchaseUSDT} USDT`);
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual contract interaction
      console.log('Buying tokens:', {
        currency: selectedCurrency,
        amount,
        tokenAmount,
        referralCode
      });

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Purchase successful! (This is a demo)');
      setAmount('');
      setReferralCode('');
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Card className={styles.purchaseForm}>
      <div className={styles.currencyTabs}>
        {currencies.map(currency => (
          <button
            key={currency}
            className={`${styles.currencyTab} ${selectedCurrency === currency ? styles.active : ''}`}
            onClick={() => setSelectedCurrency(currency)}
          >
            <span className={styles.currencyIcon} />
            {currency}
          </button>
        ))}
      </div>

      <div className={styles.inputSection}>
        <Input
          label={`Amount (${selectedCurrency})`}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          suffix={
            <button className={styles.maxButton} onClick={handleMaxClick}>
              MAX
            </button>
          }
        />
        <p className={styles.minAmount}>
          Min. Amount to Purchase: {PRESALE_CONFIG.minPurchaseUSDT} {selectedCurrency}
        </p>
      </div>

      <div className={styles.calculation}>
        <div className={styles.calculationLabel}>BCRW Worth</div>
        <div className={styles.calculationValue}>
          {formatTokenAmount(tokenAmount, 2, 'BCRW')}
        </div>
      </div>

      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handleBuy}
        loading={loading}
        disabled={!amount || parseFloat(amount) < PRESALE_CONFIG.minPurchaseUSDT}
        className={styles.buyButton}
      >
        Buy Coins
      </Button>

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
    </Card>
  );
};
