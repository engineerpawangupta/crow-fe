import { useState, useEffect, useRef } from 'react';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { formatAddress } from '@utils/formatters';
import { Button } from '@components/common/Button/Button';
import styles from './WalletConnect.module.css';

export const WalletConnect = () => {
  const { 
    walletAddress, 
    isConnected, 
    isCorrectNetwork,
    connectWallet, 
    disconnectWallet,
    switchNetwork 
  } = useWeb3Wallet();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
  };

  const handleSwitchNetwork = async () => {
    await switchNetwork();
    setShowDropdown(false);
  };

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} variant="primary">
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className={styles.walletButton} ref={dropdownRef}>
      <Button 
        onClick={() => setShowDropdown(!showDropdown)}
        variant="secondary"
      >
        <span className={styles.address}>
          <span className={styles.addressText}>
            {formatAddress(walletAddress)}
          </span>
        </span>
      </Button>

      {showDropdown && (
        <div className={styles.dropdown}>
          {!isCorrectNetwork && (
            <>
              <div className={styles.networkWarning}>
                Wrong Network
              </div>
              <Button 
                onClick={handleSwitchNetwork}
                variant="primary"
                size="small"
                fullWidth
                className={styles.switchButton}
              >
                Switch Network
              </Button>
              <div className={styles.divider} />
            </>
          )}
          
          <button className={styles.dropdownItem} onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
