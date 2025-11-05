import { useCallback } from 'react';
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { ethereumMainnet, sepoliaTestnet } from '@config/ethereumNetworks';
import { CONTRACT_ADDRESSES } from '@config/constants';

export const useWeb3Wallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Get current network from environment
  const currentEnv = import.meta.env.VITE_NETWORK_ENV || 'testnet';
  const expectedChainId = currentEnv === 'mainnet' ? ethereumMainnet.id : sepoliaTestnet.id;
  const isCorrectNetwork = chainId === expectedChainId;

  const connectWallet = useCallback(() => {
    try {
      if (typeof open === 'function') {
        void open();
      }
    } catch (error) {
      console.error('Error opening wallet modal:', error);
    }
  }, [open]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [disconnect]);

  const switchNetwork = useCallback(async () => {
    try {
      await switchChain({ chainId: expectedChainId });
    } catch (error) {
      console.error('Error switching network:', error);
    }
  }, [switchChain, expectedChainId]);

  return {
    address,
    walletAddress: address,
    chainId,
    isConnected,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    currentNetwork: {
      chainId: expectedChainId,
      name: currentEnv === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'
    },
    contractAddresses: CONTRACT_ADDRESSES
  };
};

