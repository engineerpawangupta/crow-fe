# Blackcroww ICO - Setup Instructions

## Quick Start

### 1. Install Node.js

If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies

```bash
npm install
```

Or using pnpm (faster):
```bash
npm install -g pnpm
pnpm install
```

### 3. Setup Environment

Copy the testnet environment file:
```bash
cp .env.testnet .env
```

Or create your own `.env` file based on `.env.example`

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Environment Configuration

### For Testnet (Development)
```bash
cp .env.testnet .env
```

### For Mainnet (Production)
```bash
cp .env.mainnet .env
```

## Smart Contract Integration

Once you have your smart contract deployed:

1. Open `.env` file
2. Add your contract addresses:
```env
VITE_PRESALE_CONTRACT=0xYourPresaleContractAddress
VITE_TOKEN_CONTRACT=0xYourTokenContractAddress
```

3. If using Web3Modal with WalletConnect:
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a project
   - Copy the Project ID
   - Add to `.env`:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Testing on BSC Testnet

1. Get testnet BNB:
   - Visit [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)
   - Enter your wallet address
   - Request test BNB

2. Add BSC Testnet to MetaMask:
   - The app will prompt you to add the network
   - Or add manually:
     - Network Name: BSC Testnet
     - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
     - Chain ID: 97
     - Symbol: BNB
     - Explorer: https://testnet.bscscan.com

## Production Build

Build the production version:
```bash
npm run build
```

The build will be created in the `dist` folder.

Preview the production build:
```bash
npm run preview
```

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Deploy to your server
1. Build the project: `npm run build`
2. Upload the `dist` folder to your server
3. Configure your web server to serve the files

## Common Issues

### Port already in use
If port 3000 is in use, Vite will automatically try the next available port (3001, 3002, etc.)

### MetaMask not detected
- Make sure MetaMask extension is installed
- Refresh the page after installation
- Try in a different browser

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
Make sure you're using Node.js v18 or higher:
```bash
node --version
```

## Development Tips

### Hot Module Replacement (HMR)
Vite supports HMR. Your changes will reflect instantly without page reload.

### ESLint
Check code quality:
```bash
npm run lint
```

### Mock Data
The app uses mock data by default (see `src/config/constants.js`)
Replace with real contract calls after integration.

## File Structure Overview

```
crow-fe/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Web3)
│   ├── pages/           # Page components
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # Documentation
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Run development server
3. 🔲 Add your contract addresses to `.env`
4. 🔲 Test wallet connection
5. 🔲 Test on BSC Testnet
6. 🔲 Deploy to production

## Support

For help, check:
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [BSC Documentation](https://docs.bnbchain.org/)
