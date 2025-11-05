import { useEffect, useState } from 'react';
import { useWeb3Wallet } from '@hooks/useWeb3Wallet';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { UserBalance } from '@components/UserBalance/UserBalance';
import { Modal } from '@components/common/Modal/Modal';
import { formatAddress, formatDate } from '@utils/formatters';

export const DashboardPage = () => {
  const { isConnected, walletAddress, connectWallet } = useWeb3Wallet();
  const [showConnectModal, setShowConnectModal] = useState(!isConnected);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT;
  const moralisApiKey = import.meta.env.VITE_MORALIS_API_KEY;
  const chain = 'bsc testnet';//eth

  const walletAddress1 = '0xafD97c52E1aC658ebaAef0913AAc69722d12cFC8'

  const fetchTransactions = async () => {
    if (!walletAddress || !tokenAddress) return;

    setLoading(true);
    setError('');

    try {

      // Fetch token transactions of the connected wallet
      const url = `https://deep-index.moralis.io/api/v2.2/${walletAddress1}/erc20/transfers?chain=${chain}&contract_addresses=${tokenAddress}&limit=20&order=DESC`;
      const res = await fetch(url, {
        headers: {
          accept: 'application/json',
          'X-API-Key': moralisApiKey,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch transactions');

      const data = await res.json();
      const txList = (data.result || []).map((tx) => ({
        date: new Date(tx.block_timestamp),
        type:
          tx.from_address.toLowerCase() === walletAddress.toLowerCase()
            ? 'Sent'
            : 'Received',
        amount: (Number(tx.value) / 1e18).toFixed(4),
        tokens: (Number(tx.value) / 1e18).toFixed(4),
        status: 'Confirmed',
        hash: tx.transaction_hash,
      }));

      setTransactions(txList);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchTransactions();
    }
  }, [isConnected, walletAddress]);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Modal
        isOpen={showConnectModal && !isConnected}
        onClose={() => setShowConnectModal(false)}
        title="Welcome to Blackcroww Dashboard"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ marginBottom: '30px', color: 'var(--color-text-muted)' }}>
            To reach dashboard connect your wallet first!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => setShowConnectModal(false)}>
              Go Home
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                connectWallet();
                setShowConnectModal(false);
              }}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </Modal>

      {isConnected ? (
        <>
          <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Dashboard</h1>

          <Card style={{ marginBottom: '30px', padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '8px',
                  }}
                >
                  Connected Wallet
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '16px',
                  }}
                >
                   {walletAddress}
                </p>
              </div>
            </div>
          </Card>

          <UserBalance />

          <Card style={{ marginTop: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Transaction History</h2>

            {loading ? (
              <p style={{ textAlign: 'center', color: 'gray' }}>Loading transactions...</p>
            ) : error ? (
              <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>
            ) : transactions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: 'var(--color-text-muted)',
                }}
              >
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                  Last Transactions
                </p>
                <p>There are no finalized transactions yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>CROWW</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: '1px solid var(--color-border-light)',
                        }}
                      >
                        <td style={{ padding: '12px' }}>{formatDate(tx.date)}</td>
                        <td style={{ padding: '12px' }}>{tx.type}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {tx.amount}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {tx.tokens}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {tx.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card style={{ marginTop: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Claim Tokens</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Token claiming will be available after the presale ends and mainnet launch.
            </p>
            <Button variant="primary" disabled>
              Claim Tokens (Coming Soon)
            </Button>
          </Card>
        </>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Welcome to Blackcroww Dashboard</h2>
            <p
              style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}
            >
              Please connect your wallet to access the dashboard
            </p>
            <Button variant="primary" size="large" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
