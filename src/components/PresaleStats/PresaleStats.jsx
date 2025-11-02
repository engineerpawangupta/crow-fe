import { formatNumber, formatCurrency, formatCompactNumber } from '@utils/formatters';
import { Button } from '@components/common/Button/Button';
import { MOCK_PRESALE_STATS } from '@config/constants';
import styles from './PresaleStats.module.css';

export const PresaleStats = ({ onBuyClick }) => {
  const stats = MOCK_PRESALE_STATS;

  return (
    <section className={styles.presaleStats}>
      <p className={styles.title}>Coins Remaining</p>
      <h1 className={styles.coinsRemaining}>
        {formatCompactNumber(stats.coinsRemaining)}
      </h1>
      <p className={styles.subtitle}>Presale is Closing...</p>
      <p className={styles.description}>
        The clock is ticking and only {formatCompactNumber(stats.coinsRemaining)} coins remain in the Blackcroww presale. 
        Each stage increases naturally in price as supply decreases — driving real scarcity, organic demand, and long-term value.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Raised</div>
          <div className={styles.statValue}>
            {formatCurrency(stats.totalRaised)}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Current Price</div>
          <div className={`${styles.statValue} ${styles.highlight}`}>
            ${formatNumber(stats.currentPrice, 2)}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Next Price</div>
          <div className={styles.statValue}>
            ${formatNumber(stats.nextPrice, 2)}
          </div>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${stats.soldPercentage}%` }}
        />
      </div>
      <p className={styles.progressLabel}>
        {formatNumber(stats.soldPercentage, 1)}% Sold
      </p>

      <Button 
        variant="primary" 
        size="large"
        onClick={onBuyClick}
        className={styles.purchaseButton}
      >
        Purchase Now
      </Button>
    </section>
  );
};
