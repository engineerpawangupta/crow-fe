// Token and Contract Configuration

export const TOKEN_CONFIG = {
  name: 'Blackcroww Token',
  symbol: 'CROWW',
  decimals: 18,
  totalSupply: 800000000,
  presaleAllocation: 200000000,
  initialPrice: 0.25 // Price per CROWW in USDT - TBD, confirm with Saurav
};

export const CONTRACT_ADDRESSES = {
  presale: import.meta.env.VITE_PRESALE_CONTRACT_ADDRESS || '',
  token: import.meta.env.VITE_TOKEN_CONTRACT || '',
  usdt: import.meta.env.VITE_USDT_TOKEN_ADDRESS || ''
};

// Presale configuration
export const PRESALE_CONFIG = {
  minPurchaseUSDT: 10, // Minimum purchase amount in USDT
  maxPurchaseUSDT: 100000, // Maximum purchase amount in USDT
  referralBonus: 0.25, // 25% referral bonus
  buyerBonus: 0.05 // 5% bonus for first purchase
};

// Supported payment currencies
export const PAYMENT_CURRENCIES = {
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    address: import.meta.env.VITE_USDT_TOKEN_ADDRESS || ''
  },
  // BNB: {
  //   symbol: 'BNB',
  //   name: 'Binance Coin',
  //   decimals: 18,
  //   address: '0x0000000000000000000000000000000000000000' // Native token
  // },
  // ETH: {
  //   symbol: 'ETH',
  //   name: 'Ethereum',
  //   decimals: 18,
  //   address: '' // To be filled
  // }
};

// Mock data for leaderboard (to be replaced with contract data)
export const MOCK_LEADERBOARD = [
  { rank: 1, address: '0x578e...ea4', amount: 4498617.41, tier: 'whale' },
  { rank: 2, address: '0x2222...5c1', amount: 4377560.49, tier: 'whale' },
  { rank: 3, address: '0x277c...6f3', amount: 3884079.28, tier: 'whale' },
  { rank: 4, address: '0x2fd6...25c', amount: 3135925.25, tier: 'whale' },
  { rank: 5, address: '0x1eff...baf', amount: 2533333.32, tier: 'whale' },
  { rank: 6, address: '0xb6e4...596', amount: 2428908.92, tier: 'whale' },
  { rank: 7, address: '0x4e5a...b57', amount: 2320645.74, tier: 'whale' },
  { rank: 8, address: '0x8798...8ce', amount: 1858041.00, tier: 'whale' },
  { rank: 9, address: '0x0c13...bd6', amount: 1740530.22, tier: 'whale' },
  { rank: 10, address: '0x8406...aee', amount: 1598687.48, tier: 'whale' }
];

// Mock presale stats
export const MOCK_PRESALE_STATS = {
  coinsRemaining: 200000000,
  totalRaised: 0,
  currentPrice: 0.1,
  nextPrice: 0.125,
  soldPercentage: 0
};

// USDT deployment references
export const USDT_CONFIG = {
  symbol: 'USDT',
  name: 'Tether USD',
  decimals: 18, // Testnet mock uses 18 decimals (mainnet USDT uses 6)
  mainnetAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  sepoliaAddress: '0x31a1f621900A5bc7BEb2860bbd37773Ce426bDb3'
};

// Approval related constants
export const APPROVAL_CONSTANTS = {
  MAX_UINT256: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  USE_UNLIMITED_APPROVAL: true
};
