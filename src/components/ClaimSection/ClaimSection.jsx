import { useState } from 'react';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { usePresaleContract } from '../../hooks/usePresaleContract';
import { formatNumber } from '@utils/formatters';
import styles from './ClaimSection.module.css';

export const ClaimSection = () => {
  const { isConnected, isCorrectNetwork } = useWeb3Wallet();
  const { claimTokens, loading, error } = usePresaleContract();
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Mock data - will be replaced with contract data
  const availableToClaim = 0;
  const totalClaimed = 0;
  const claimableDate = 'TBA'; // To be announced

  const handleClaim = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!isCorrectNetwork) {
      alert('Please switch to the correct network');
      return;
    }

    if (availableToClaim === 0) {
      alert('No tokens available to claim yet');
      return;
    }

    try {
      const result = await claimTokens();
      
      if (result.success) {
        setClaimSuccess(true);
        alert(`Successfully claimed tokens! Transaction: ${result.txHash}`);
      }
    } catch (err) {
      console.error('Claim failed:', err);
      alert(`Claim failed: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Claim Your Tokens</h3>
      
      <Card variant="gradient" className={styles.claimCard}>
        <div className={styles.claimInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Available to Claim:</span>
            <span className={styles.value}>
              {formatNumber(availableToClaim)} BCRW
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Already Claimed:</span>
            <span className={styles.value}>
              {formatNumber(totalClaimed)} BCRW
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Next Claim Date:</span>
            <span className={styles.value}>{claimableDate}</span>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {claimSuccess && (
          <div className={styles.successMessage}>
            ✓ Tokens claimed successfully!
          </div>
        )}

        <div className={styles.claimActions}>
          <Button
            onClick={handleClaim}
            loading={loading}
            disabled={!isConnected || !isCorrectNetwork || availableToClaim === 0}
            fullWidth
            size="large"
          >
            {!isConnected 
              ? 'Connect Wallet to Claim' 
              : !isCorrectNetwork 
              ? 'Switch Network' 
              : availableToClaim === 0
              ? 'No Tokens Available'
              : 'Claim Tokens'}
          </Button>

          <p className={styles.claimNote}>
            Tokens will be sent directly to your connected wallet address.
          </p>
        </div>
      </Card>

      <Card className={styles.infoCard}>
        <h4>Token Distribution Schedule</h4>
        <ul className={styles.scheduleList}>
          <li>🗓️ Presale End Date: <strong>TBA</strong></li>
          <li>🚀 Token Launch: <strong>TBA</strong></li>
          <li>📅 First Claim: <strong>After token launch</strong></li>
          <li>⏰ Claim Period: <strong>Anytime after launch</strong></li>
        </ul>
        <p className={styles.infoText}>
          You can claim your tokens anytime after the token launch date. 
          There is no deadline for claiming your purchased tokens.
        </p>
      </Card>
    </div>
  );
};

