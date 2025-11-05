import { useState, useEffect } from 'react';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { Card } from '@components/common/Card/Card';
import { formatTokenAmount, formatCurrency } from '@utils/formatters';
import styles from './Leaderboard.module.css';

export const Leaderboard = () => {
  const { walletAddress } = useWeb3Wallet();
  const [holders, setHolders] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [previousCursors, setPreviousCursors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTab, setActiveTab] = useState('daily'); // ✅ added for tab control

  const itemsPerPage = 10;
  const chain = 'bsc testnet';//eth
  const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT  //'0x6982508145454ce325ddbe47a25d4ec3d2311933';
  const moralisApiKey = import.meta.env.VITE_MORALIS_API_KEY

  const fetchHolders = async (cursorToken = null) => {
    try {
      setLoading(true);
      setError('');

      let url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=${chain}&limit=${itemsPerPage}&order=DESC`;
      if (cursorToken) url += `&cursor=${cursorToken}`;

      // Example: use activeTab to adjust filters (mock logic for demo)
      if (activeTab === 'daily') {
        url += '&sort=balance&timeframe=24h';
      } else {
        url += '&sort=balance';
      }

      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          'X-API-Key': moralisApiKey,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch token holders');

      const data = await response.json();
      setHolders(data.result || []);
      setNextCursor(data.cursor || null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // fetch whenever activeTab changes
  useEffect(() => {
    fetchHolders();
    setCursor(null);
    setPreviousCursors([]);
    setPageNumber(1);
  }, [activeTab]);

  const handleNext = () => {
    if (nextCursor) {
      setPreviousCursors((prev) => [...prev, cursor]);
      setCursor(nextCursor);
      setPageNumber((prev) => prev + 1);
      fetchHolders(nextCursor);
    }
  };

  const handlePrev = () => {
    if (previousCursors.length > 0) {
      const prev = previousCursors[previousCursors.length - 1];
      setPreviousCursors((prevList) => prevList.slice(0, -1));
      setCursor(prev);
      setPageNumber((prev) => Math.max(1, prev - 1));
      fetchHolders(prev);
    }
  };

  const getTierEmoji = (balance) => {
    const ethValue = balance / 1e18;
    if (ethValue > 1000) return '🐋';
    if (ethValue > 100) return '🐬';
    if (ethValue > 10) return '🐟';
    return '🦀';
  };

  return (
    <Card className={styles.leaderboard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Leaderboard</h2>
          <p className={styles.subtitle}>Top Token Holders</p>
        </div>

        {/* ✅ Added Tabs Section */}
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

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : error ? (
        <p className={styles.error}>Error: {error}</p>
      ) : (
        <ul className={styles.list}>
          {holders.length === 0 ? (
            <li className={styles.empty}>No data found</li>
          ) : (
            holders.map((holder, index) => (
              <li key={holder.owner_address} className={styles.item}>
                <div className={styles.itemLeft}>
                  <span className={`${styles.rank} ${index < 3 ? styles.top3 : ''}`}>
                    #{((pageNumber - 1) * itemsPerPage) + index + 1}
                  </span>
                  <span className={styles.tier}>{getTierEmoji(holder.balance)}</span>
                  <span className={styles.address}>
                    {holder.owner_address.slice(0, 6)}...{holder.owner_address.slice(-4)}
                  </span>
                </div>
                <div>
                  <div className={styles.amount}>
                    {formatTokenAmount((holder.balance / 1e18), 3, 'CROWW')}
                  </div>
                  <div className={styles.amountLabel}>Token Balance</div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={handlePrev}
          disabled={previousCursors.length === 0 || loading}
        >
          ←
        </button>
        <span className={styles.paginationInfo}>Page {pageNumber}</span>
        <button
          className={styles.paginationButton}
          onClick={handleNext}
          disabled={!nextCursor || loading}
        >
          →
        </button>
      </div>

      <div className={styles.userRank}>
        <div className={styles.itemLeft}>
          {walletAddress ? (
            <span className={styles.address}>Your Wallet: {walletAddress}</span>
          ) : (
            <span className={styles.address}>Connect wallet to see your rank</span>
          )}
        </div>
      </div>
    </Card>
  );
};
