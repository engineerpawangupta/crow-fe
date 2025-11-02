# Blackcroww ICO - Token Presale Platform

A modern React application for the Blackcroww Token (BCRW) presale, built with Vite and Web3 integration for BSC blockchain.

## Features

- 🔐 Multi-wallet support (MetaMask, WalletConnect, Social Login)
- 🌐 BSC Testnet/Mainnet support with easy network switching
- 💰 Token purchase interface with multiple payment currencies (USDT, BNB, ETH)
- 📊 Real-time presale statistics and leaderboard
- 🎯 User dashboard with transaction history
- 📱 Fully responsive design
- 🎨 Modern UI with Blackcroww theme

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Blockchain**: Binance Smart Chain (BSC)
- **Web3 Library**: Ethers.js v6
- **Wallet Integration**: Web3Modal v3
- **Routing**: React Router v6
- **Styling**: CSS Modules

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Base components (Button, Card, Input, Modal)
│   ├── Header/         # Navigation header
│   ├── PresaleStats/   # Presale statistics display
│   ├── PurchaseForm/   # Token purchase form
│   ├── Leaderboard/    # Top holders leaderboard
│   ├── UserBalance/    # User balance cards
│   └── WalletConnect/  # Wallet connection button
├── contexts/           # React contexts
│   └── Web3Context.jsx # Web3 wallet state management
├── pages/              # Page components
│   ├── PurchasePage.jsx    # Main presale page
│   └── DashboardPage.jsx   # User dashboard
├── config/             # Configuration files
│   ├── networks.js     # BSC network configs
│   └── constants.js    # Token and contract constants
├── utils/              # Utility functions
│   ├── formatters.js   # Number and address formatting
│   └── web3.js         # Web3 helper functions
├── styles/             # Global styles
│   ├── variables.css   # CSS design tokens
│   └── global.css      # Global CSS
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MetaMask or another Web3 wallet browser extension

### Installation

1. **Clone the repository**
```bash
cd crow-fe
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

For testnet (development):
```bash
cp .env.testnet .env
```

For mainnet (production):
```bash
cp .env.mainnet .env
```

4. **Configure environment variables**

Edit `.env` file and add:
```
VITE_NETWORK_ENV=testnet
VITE_CHAIN_ID=97
VITE_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
VITE_PRESALE_CONTRACT=YOUR_PRESALE_CONTRACT_ADDRESS
VITE_TOKEN_CONTRACT=YOUR_TOKEN_CONTRACT_ADDRESS
VITE_WALLETCONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Preview production build:
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Configuration

### Token Configuration

Edit `src/config/constants.js` to update token details:

```javascript
export const TOKEN_CONFIG = {
  name: 'Blackcroww Token',
  symbol: 'BCRW',
  decimals: 18,
  totalSupply: 800_000_000,
  presaleAllocation: 200_000_000,
  initialPrice: 0.25 // Confirm with team
};
```

### Network Configuration

The app supports both BSC Testnet and Mainnet. Toggle between them using the `VITE_NETWORK_ENV` environment variable.

**BSC Testnet** (for testing):
- Chain ID: 97
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
- Explorer: https://testnet.bscscan.com

**BSC Mainnet** (for production):
- Chain ID: 56
- RPC: https://bsc-dataseed.binance.org/
- Explorer: https://bscscan.com

### Smart Contract Integration

Once you have the presale contract deployed:

1. Add the contract address to `.env`:
```
VITE_PRESALE_CONTRACT=0x...
```

2. Add the contract ABI to `src/config/contracts.js` (create this file):
```javascript
export const PRESALE_ABI = [
  // Add your contract ABI here
];
```

3. Update the contract interaction logic in components (PurchaseForm, etc.)

## Features Overview

### Purchase Page
- Presale statistics (coins remaining, price, progress)
- Multi-currency purchase form (USDT, BNB, ETH)
- Real-time token amount calculation
- Leaderboard of top holders
- User balance display
- Referral code support

### Dashboard Page
- Wallet connection status
- Total BCRW balance
- Coin worth at launch estimation
- Referral earnings
- Transaction history
- Token claiming (post-presale)

## Wallet Integration

The app uses Web3Modal v3 which supports:
- MetaMask
- WalletConnect (various mobile wallets)
- Coinbase Wallet
- Social login options

### Testing with Testnet

1. Switch MetaMask to BSC Testnet
2. Get test BNB from BSC Testnet Faucet
3. Get test USDT (if needed for testing)
4. Connect wallet and test the purchase flow

## Styling

The app uses CSS Modules with design tokens defined in `src/styles/variables.css`. The theme matches the Blackcroww brand:

- Dark blue backgrounds
- Cyan/blue accent colors
- Gradient effects
- Responsive design for mobile/tablet/desktop

## Contributing

1. Follow the existing code structure and naming conventions
2. Use named exports (no default exports)
3. Keep components small and reusable
4. Add comments for complex logic
5. Test on both testnet and mainnet before deployment

## Support

For questions or issues:
- Check the code comments
- Review the configuration files
- Test on BSC Testnet first
- Contact the development team

## License

Private - Blackcroww Project

---

Built with ❤️ for the Blackcroww community
