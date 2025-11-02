import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from '@components/WalletConnect/WalletConnect';
import { useWeb3 } from '@contexts/Web3Context';
import styles from './Header.module.css';

export const Header = () => {
  const location = useLocation();
  const { isConnected, isCorrectNetwork, currentNetwork } = useWeb3();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Blackcroww</span>
        </Link>

        <nav className={styles.nav}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Presale
          </Link>
          <Link 
            to="/dashboard" 
            className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
        </nav>

        <div className={styles.actions}>
          {isConnected && (
            <div className={styles.networkBadge}>
              <span className={`${styles.networkIndicator} ${!isCorrectNetwork ? styles.wrong : ''}`} />
              {currentNetwork.name}
            </div>
          )}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};
