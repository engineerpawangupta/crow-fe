# Blackcroww ICO - Setup Guide

## Quick Start (For Development)

### Step 1: Install Node.js
Make sure you have Node.js 18+ installed. Check with:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

### Step 2: Install Dependencies
```bash
cd /Users/engineerpawangupta21gmail.com/Desktop/crow-fe
npm install
```

This will install all required packages:
- React 18
- Vite
- Ethers.js v6
- Web3Modal v3
- React Router DOM v6
- And more...

### Step 3: Configure Environment
The project is pre-configured for BSC Testnet. The `.env.testnet` file contains:

```
VITE_NETWORK_ENV=testnet
VITE_CHAIN_ID=97
VITE_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
VITE_PRESALE_CONTRACT=
VITE_TOKEN_CONTRACT=
VITE_WALLETCONNECT_PROJECT_ID=
```

**Important**: You need to fill in:
1. `VITE_PRESALE_CONTRACT` - Your deployed presale contract address
2. `VITE_TOKEN_CONTRACT` - Your BCRW token contract address
3. `VITE_WALLETCONNECT_PROJECT_ID` - Get free ID from https://cloud.walletconnect.com/

### Step 4: Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 5: Connect Wallet
1. Install MetaMask browser extension
2. Switch to BSC Testnet in MetaMask:
   - Network Name: BSC Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
   - Chain ID: 97
   - Currency Symbol: BNB
   - Block Explorer: https://testnet.bscscan.com

3. Get test BNB from faucet: https://testnet.bnbchain.org/faucet-smart

4. Click "Connect Wallet" in the app

## Smart Contract Integration

### Adding Your Contract

Once your presale contract is deployed on BSC:

1. **Update .env file**:
```
VITE_PRESALE_CONTRACT=0xYourContractAddress
VITE_TOKEN_CONTRACT=0xYourTokenAddress
```

2. **Add Contract ABI**:

Create `src/config/contracts.js`:
```javascript
export const PRESALE_ABI = [
  // Paste your presale contract ABI here
  // Example:
  {
    "inputs": [],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // ... more ABI entries
];

export const TOKEN_ABI = [
  // Paste your token contract ABI here
];
```

3. **Update Purchase Logic**:

In `src/components/PurchaseForm/PurchaseForm.jsx`, replace the mock transaction with real contract call:

```javascript
import { ethers } from 'ethers';
import { useWeb3 } from '@contexts/Web3Context';
import { PRESALE_ABI } from '@config/contracts';
import { CONTRACT_ADDRESSES } from '@config/constants';

const handleBuy = async () => {
  try {
    // Get contract instance
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.presale,
      PRESALE_ABI,
      signer
    );

    // Call buyTokens function
    const tx = await contract.buyTokens(
      ethers.parseUnits(amount, 18),
      { value: ethers.parseEther(amount) }
    );

    // Wait for confirmation
    await tx.wait();

    alert('Purchase successful!');
  } catch (error) {
    console.error('Purchase error:', error);
    alert('Purchase failed');
  }
};
```

## Switching to Mainnet

When ready for production:

1. **Update environment**:
```bash
cp .env.mainnet .env
```

2. **Verify contract addresses** are for mainnet

3. **Build for production**:
```bash
npm run build
```

4. **Deploy** the `dist/` folder to your hosting

## Project Structure Explained

```
crow-fe/
├── src/
│   ├── components/          # All UI components
│   │   ├── common/         # Reusable: Button, Card, Input, Modal
│   │   ├── Header/         # Top navigation
│   │   ├── PresaleStats/   # Stats display
│   │   ├── PurchaseForm/   # Buy tokens form
│   │   ├── Leaderboard/    # Top holders
│   │   ├── UserBalance/    # Balance cards
│   │   └── WalletConnect/  # Wallet button
│   │
│   ├── contexts/           # React contexts
│   │   └── Web3Context.jsx # Manages wallet state
│   │
│   ├── pages/              # Route pages
│   │   ├── PurchasePage.jsx    # Main page (/)
│   │   └── DashboardPage.jsx   # Dashboard (/dashboard)
│   │
│   ├── config/             # Configuration
│   │   ├── networks.js     # BSC network configs
│   │   └── constants.js    # Token & presale settings
│   │
│   ├── utils/              # Helper functions
│   │   ├── formatters.js   # Format numbers, addresses
│   │   └── web3.js         # Web3 utilities
│   │
│   ├── styles/             # Global styles
│   │   ├── variables.css   # Design tokens
│   │   └── global.css      # Global CSS
│   │
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
│
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── .env                    # Environment variables
```

## Customization

### Updating Token Details

Edit `src/config/constants.js`:

```javascript
export const TOKEN_CONFIG = {
  name: 'Blackcroww Token',
  symbol: 'BCRW',
  decimals: 18,
  totalSupply: 800_000_000,
  presaleAllocation: 200_000_000,
  initialPrice: 0.25  // ← Update this
};

export const PRESALE_CONFIG = {
  minPurchaseUSDT: 10,      // ← Update minimum
  maxPurchaseUSDT: 100000,  // ← Update maximum
  referralBonus: 0.25,      // 25%
  buyerBonus: 0.05          // 5%
};
```

### Updating Colors

Edit `src/styles/variables.css`:

```css
:root {
  --color-bg-primary: #0a1628;      /* Background */
  --color-primary: #00d4ff;         /* Accent color */
  --color-accent: #00a8cc;          /* Secondary accent */
  /* ... update other colors */
}
```

### Adding Logo

1. Add your logo image to `public/` folder (e.g., `logo.png`)
2. Update `src/components/Header/Header.jsx`:

```jsx
<img 
  src="/logo.png" 
  alt="Blackcroww" 
  className={styles.logoImage} 
/>
```

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Network switches to BSC correctly
- [ ] Purchase form validates input
- [ ] Token calculation is accurate
- [ ] Dashboard shows connected wallet
- [ ] Leaderboard displays data
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error messages are clear
- [ ] Loading states work properly
- [ ] Transaction completes successfully

## Common Issues

### "Cannot find module" errors
```bash
npm install
```

### Wallet not connecting
- Make sure MetaMask is installed
- Check if BSC network is added
- Try refreshing the page

### Wrong network error
- Click "Switch Network" button in the app
- Or manually switch in MetaMask

### Transaction fails
- Check you have enough BNB for gas
- Verify contract addresses are correct
- Check presale is active

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Run development server
4. ⏳ Add your contract addresses
5. ⏳ Add contract ABIs
6. ⏳ Implement contract integration
7. ⏳ Test on testnet
8. ⏳ Deploy to mainnet

## Support

If you encounter any issues:
1. Check the console for errors (F12 in browser)
2. Review the configuration files
3. Test with BSC Testnet first
4. Contact the development team

---

Happy coding! 🚀

