import { useState, useEffect } from 'react';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { usePresaleContract } from '@hooks/usePresaleContract';
import { useUSDTContract } from '@hooks/useUSDTContract';
import { Card } from '@components/common/Card/Card';
import { formatTokenAmount, formatCurrency } from '@utils/formatters';
import { TOKEN_CONFIG } from '@config/constants';
import styles from './UserBalance.module.css';

export const UserBalance = () => {
  const { isConnected, address } = useWeb3Wallet();
  const { getUserBalance, getTokenPrice } = usePresaleContract();
  const { balance: usdtBalance, updateBalance } = useUSDTContract();

  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    usdtBalance: 0,
    worthAtCurrentPrice: 0,
    estimatedLaunchValue: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch user balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [bcrwBalance, currentPrice] = await Promise.all([
          getUserBalance(),
          getTokenPrice()
        ]);

        const bcrwNum = parseFloat(bcrwBalance) || 0;
        const usdtNum = parseFloat(usdtBalance) || 0;
        const priceNum = parseFloat(currentPrice) || TOKEN_CONFIG.initialPrice;

        // Calculate current worth
        const currentWorth = bcrwNum * priceNum;

        // Estimate launch value (assuming 3x price at launch)
        const launchPrice = priceNum * 3;
        const launchValue = bcrwNum * launchPrice;

        setBalanceData({
          totalBalance: bcrwNum,
          usdtBalance: usdtNum,
          worthAtCurrentPrice: currentWorth,
          estimatedLaunchValue: launchValue
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching balances:', err);
        setLoading(false);
      }
    };

    fetchBalances();

    // Refresh balances every 30 seconds
    const interval = setInterval(fetchBalances, 30000);

    return () => clearInterval(interval);
  }, [isConnected, address, usdtBalance, getUserBalance, getTokenPrice]);

  if (!isConnected) {
    return (
      <Card>
        <div className={styles.emptyState}>
          <p>Connect your wallet to see your balance</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className={styles.userBalance}>
        <Card className={styles.loadingCard}>
          <p>Loading balances...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.userBalance}>
      <Card className={styles.balanceCard} variant="highlight">
        <div className={styles.icon}>💎</div>
        <div className={styles.label}>Total CROWW Balance</div>
        <div className={`${styles.value} ${styles.highlight}`}>
          {formatTokenAmount(balanceData.totalBalance, 2, 'CROWW')}
        </div>
        <div className={styles.subtitle}>Your purchased tokens</div>
      </Card>

      <Card className={styles.balanceCard}>
        <div className={styles.icon}>💵</div>
        <div className={styles.label}>USDT Balance</div>
        <div className={styles.value}>
          {formatCurrency(balanceData.usdtBalance)}
        </div>
        <div className={styles.subtitle}>Available for purchase</div>
      </Card>

      <Card className={styles.balanceCard}>
        <div className={styles.icon}>📊</div>
        <div className={styles.label}>Current Worth</div>
        <div className={styles.value}>
          {formatTokenAmount(balanceData.referralEarnings, 2, 'CROWW')}
        </div>
        <div className={styles.subtitle}>At current price</div>
      </Card>

      <Card className={styles.balanceCard}>
        <div className={styles.icon}>🚀</div>
        <div className={styles.label}>Estimated Launch Value</div>
        <div className={styles.value}>
          {formatCurrency(balanceData.estimatedLaunchValue)}
        </div>
        <div className={styles.subtitle}>Projected value (3x)</div>
      </Card>
    </div>
  );
};
