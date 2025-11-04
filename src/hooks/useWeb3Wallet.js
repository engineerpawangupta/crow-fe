import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { bscMainnet, bscTestnet } from '@config/bscNetworks';
import { CONTRACT_ADDRESSES } from '@config/constants';

export const useWeb3Wallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Get current network from environment
  const currentEnv = import.meta.env.VITE_NETWORK_ENV || 'testnet';
  const expectedChainId = currentEnv === 'mainnet' ? bscMainnet.id : bscTestnet.id;
  const isCorrectNetwork = chainId === expectedChainId;

  const connectWallet = async () => {
    await open();
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  const switchNetwork = async () => {
    try {
      await switchChain({ chainId: expectedChainId });
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

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
      name: currentEnv === 'mainnet' ? 'BSC Mainnet' : 'BSC Testnet'
    },
    contractAddresses: CONTRACT_ADDRESSES
  };
};

