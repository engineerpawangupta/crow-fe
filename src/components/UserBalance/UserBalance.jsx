import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { Card } from '@components/common/Card/Card';
import { formatTokenAmount, formatCurrency } from '@utils/formatters';
import styles from './UserBalance.module.css';

export const UserBalance = () => {
  const { isConnected } = useWeb3Wallet();

  // Mock data - will be replaced with actual contract data
  const balanceData = {
    totalBalance: 0,
    worthAtLaunch: 0,
    referralEarnings: 0
  };

  if (!isConnected) {
    return (
      <Card>
        <div className={styles.emptyState}>
          <p>Connect your wallet to see your balance</p>
        </div>
      </Card>
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
        <div className={styles.subtitle}>Your token holdings</div>
      </Card>

      <Card className={styles.balanceCard}>
        <div className={styles.icon}>🎯</div>
        <div className={styles.label}>Coin Worth at Launch</div>
        <div className={styles.value}>
          {formatCurrency(balanceData.worthAtLaunch)}
        </div>
        <div className={styles.subtitle}>Estimated value</div>
      </Card>

      <Card className={styles.balanceCard}>
        <div className={styles.icon}>🔗</div>
        <div className={styles.label}>Referral Earnings</div>
        <div className={styles.value}>
          {formatTokenAmount(balanceData.referralEarnings, 2, 'CROWW')}
        </div>
        <div className={styles.subtitle}>From referrals</div>
      </Card>
    </div>
  );
};
