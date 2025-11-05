import { useState, useEffect } from 'react';
import { usePresaleContract } from '@hooks/usePresaleContract';
import { formatNumber, formatCurrency, formatCompactNumber } from '@utils/formatters';
import { Button } from '@components/common/Button/Button';
import { TOKEN_CONFIG } from '@config/constants';
import styles from './PresaleStats.module.css';

export const PresaleStats = ({ onBuyClick }) => {
  const {
    getTotalBuyers,
    getTotalTokensSold,
    getTotalUSDTReceived,
    getRemainingTokens,
    getTokenPrice
  } = usePresaleContract();

  const [stats, setStats] = useState({
    coinsRemaining: TOKEN_CONFIG.presaleAllocation,
    totalRaised: 0,
    currentPrice: TOKEN_CONFIG.initialPrice,
    soldPercentage: 0,
    totalBuyers: 0,
    tokensSold: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch presale statistics from contract
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const [remaining, sold, raised, price, buyers] = await Promise.all([
          getRemainingTokens(),
          getTotalTokensSold(),
          getTotalUSDTReceived(),
          getTokenPrice(),
          getTotalBuyers()
        ]);

        const remainingNum = parseFloat(remaining);
        const soldNum = parseFloat(sold);
        const raisedNum = parseFloat(raised);
        const priceNum = parseFloat(price);
        const buyersNum = parseInt(buyers) || 0;

        // Calculate sold percentage
        const totalSupply = TOKEN_CONFIG.presaleAllocation;
        const soldPercentage = soldNum > 0 ? (soldNum / totalSupply) * 100 : 0;

        // Calculate next price (example: 10% increase)
        const nextPrice = priceNum * 1.1;

        setStats({
          coinsRemaining: remainingNum,
          totalRaised: raisedNum,
          currentPrice: priceNum,
          nextPrice: nextPrice,
          soldPercentage: soldPercentage,
          totalBuyers: buyersNum,
          tokensSold: soldNum
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching presale stats:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [getTotalBuyers, getTotalTokensSold, getTotalUSDTReceived, getRemainingTokens, getTokenPrice]);

  // Show loading state
  if (loading && stats.coinsRemaining === TOKEN_CONFIG.presaleAllocation) {
    return (
      <section className={styles.presaleStats}>
        <div className={styles.loadingState}>
          <p>Loading presale data...</p>
        </div>
      </section>
    );
  }

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
            ${formatNumber(stats.currentPrice, 3)}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Next Price</div>
          <div className={styles.statValue}>
            ${formatNumber(stats.nextPrice, 3)}
          </div>
        </div>

        {stats.nextPrice && (
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Next Price</div>
            <div className={styles.statValue}>
              ${formatNumber(stats.nextPrice, 6)}
            </div>
          </div>
        )}
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${Math.min(stats.soldPercentage, 100)}%` }}
        />
      </div>
      <p className={styles.progressLabel}>
        {formatNumber(stats.soldPercentage, 1)}% Sold
      </p>

      {error && (
        <p className={styles.errorText}>
          ⚠️ Unable to fetch live data. Showing cached values.
        </p>
      )}

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
