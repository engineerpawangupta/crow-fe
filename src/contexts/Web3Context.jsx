import { createContext, useContext } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';

const Web3Context = createContext(null);

// 0. Setup queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 1. Get projectId from environment (keep in .env file)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Validate projectId - REQUIRED!
if (!projectId || projectId === 'your_project_id_here') {
  throw new Error(
    '🚨 MISSING PROJECT ID!\n\n' +
    'Get your free Project ID from: https://dashboard.reown.com\n' +
    'Then add it to your .env file:\n' +
    'VITE_WALLETCONNECT_PROJECT_ID=100579ee447f951899564b2848186293'
  );
}

// 2. Determine current network from environment
const currentEnv = import.meta.env.VITE_NETWORK_ENV || 'testnet';
const networks = currentEnv === 'mainnet' 
  ? [mainnet, sepolia] 
  : [sepolia, mainnet];

// 3. Create metadata - URL MUST match your domain & subdomain
const metadata = {
  name: 'Blackcroww ICO',
  description: 'Blackcroww Token Presale - Powered by Reown',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false // Set to false for Vite client-side apps
});

// 5. Create modal - Ensure single instance
let modal;
try {
  if (!modal) {
    modal = createAppKit({
      adapters: [wagmiAdapter],
      networks,
      projectId,
      metadata,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#00d4ff',
        '--w3m-border-radius-master': '8px',
        '--w3m-z-index': '9999'
      },
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'  // Coinbase
      ],
      features: {
        analytics: false, // Disable to reduce API calls
        socials: false,
        email: false,
        onramp: false,
        swaps: false,
      },
      enableWalletConnect: true,
      enableInjected: true,
      enableCoinbase: true,
      allWallets: 'SHOW',
      allowUnsupportedChain: false,
    });
    
    console.log('✅ AppKit initialized successfully');
    console.log('📋 Project ID:', projectId);
    console.log('🌐 Networks:', networks.map(n => n.name).join(', '));
    console.log('🔗 Origin:', metadata.url);
    console.log('⛓️  Primary Network:', currentEnv === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet');
  }
} catch (error) {
  console.error('❌ AppKit initialization error:', error);
  console.error('💡 Troubleshooting:');
  console.error('1. Add your domain to Reown Dashboard: https://dashboard.reown.com');
  console.error('2. Whitelist: http://localhost:5173');
  console.error('3. Current Project ID:', projectId);
  console.error('4. Current Origin:', metadata.url);
}

// Web3Provider component (follows AppKit docs pattern)
export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3Context.Provider value={{}}>
          {children}
        </Web3Context.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// Alternative export for compatibility
export function AppKitProvider({ children }) {
  return <Web3Provider>{children}</Web3Provider>;
}

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};