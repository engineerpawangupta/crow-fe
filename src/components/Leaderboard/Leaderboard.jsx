import { useState } from 'react';
import { Card } from '@components/common/Card/Card';
import { formatCurrency } from '@utils/formatters';
import { MOCK_LEADERBOARD } from '@config/constants';
import styles from './Leaderboard.module.css';

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(MOCK_LEADERBOARD.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = MOCK_LEADERBOARD.slice(startIndex, endIndex);

  const getTierEmoji = (tier) => {
    switch (tier) {
      case 'whale':
        return '🐋';
      case 'dolphin':
        return '🐬';
      case 'fish':
        return '🐟';
      default:
        return '🦀';
    }
  };

  return (
    <Card className={styles.leaderboard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Leaderboard</h2>
          <p className={styles.subtitle}>Top 30 Holders</p>
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'daily' ? styles.active : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        {currentItems.map((item) => (
          <li key={item.rank} className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={`${styles.rank} ${item.rank <= 3 ? styles.top3 : ''}`}>
                #{item.rank}
              </span>
              <span className={styles.tier}>
                {getTierEmoji(item.tier)}
              </span>
              <span className={styles.address}>
                {item.address}
              </span>
            </div>
            <div>
              <div className={styles.amount}>
                {formatCurrency(item.amount)}
              </div>
              <div className={styles.amountLabel}>
                Total Transactions
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>
        <span className={styles.paginationInfo}>
          {currentPage} / {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>

      <div className={styles.userRank}>
        <div className={styles.itemLeft}>
          <span className={styles.rank}>#? Your Place</span>
          <span className={styles.tier}>🦀</span>
          <span className={styles.address}>Connect wallet to see your rank</span>
        </div>
      </div>
    </Card>
  );
};
