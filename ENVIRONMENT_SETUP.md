# Environment Configuration Guide

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Reown AppKit Configuration
VITE_WALLETCONNECT_PROJECT_ID=100579ee447f951899564b2848186293

# Network Environment ('mainnet' or 'testnet')
VITE_NETWORK_ENV=testnet

# Smart Contract Addresses
VITE_PRESALE_CONTRACT_ADDRESS=<your_presale_contract_address>
VITE_USDT_TOKEN_ADDRESS=<your_usdt_token_address>
VITE_TOKEN_CONTRACT=<optional_token_contract_address>
```

## Setup Instructions

### 1. Reown Dashboard Configuration

1. **Get Project ID:**
   - Visit: https://dashboard.reown.com
   - Create a new project or use existing
   - Copy your Project ID

2. **Configure Allowed Origins:**
   Go to Project Settings → Allowed Origins and add:
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   ```

3. **Save Changes**
   - Click Save and wait 30-60 seconds for propagation

### 2. Contract Addresses

#### Ethereum Sepolia (Testnet)
- **Chain ID:** 11155111
- **RPC URL:** https://rpc.sepolia.org
- **Explorer:** https://sepolia.etherscan.io
- **Presale Contract:** [To be provided]
- **USDT Contract:** [To be provided - may need mock deployment]

#### Ethereum Mainnet
- **Chain ID:** 1
- **RPC URL:** https://cloudflare-eth.com
- **Explorer:** https://etherscan.io
- **Presale Contract:** [To be provided]
- **USDT Contract:** `0xdac17f958d2ee523a2206206994597c13d831ec7`

### 3. Get Testnet Tokens

For Sepolia testnet testing:

1. **Get Sepolia ETH (for gas):**
   - https://sepoliafaucet.com
   - https://sepolia-faucet.pk910.de

2. **Get Test USDT:**
   - Request from backend team
   - Or deploy mock USDT contract for testing

## Network Configuration

The application automatically selects the correct network based on `VITE_NETWORK_ENV`:

- `testnet` → Ethereum Sepolia (11155111)
- `mainnet` → Ethereum Mainnet (1)

## Troubleshooting

### Error: "MISSING PROJECT ID"
**Solution:** Ensure `VITE_WALLETCONNECT_PROJECT_ID` is set in your `.env` file

### Error: 403 Forbidden (API calls)
**Solution:** 
1. Check domain is whitelisted in Reown Dashboard
2. Clear browser cache
3. Restart dev server

### Error: "Contract address not configured"
**Solution:** Set `VITE_PRESALE_CONTRACT_ADDRESS` and `VITE_USDT_TOKEN_ADDRESS`

### Error: Wrong network / Can't connect
**Solution:**
1. Check MetaMask is on Sepolia network
2. Verify `VITE_NETWORK_ENV` matches your intended network
3. Clear browser cache and reconnect wallet

### Error: "Insufficient USDT balance"
**Solution:** 
1. Get test USDT from faucet or backend team
2. Verify USDT contract address is correct
3. Check you're on the correct network

## Development Workflow

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Connect Wallet:**
   - Click "Connect Wallet" button
   - Select MetaMask or preferred wallet
   - Approve connection

3. **Switch to Sepolia (if testing):**
   - MetaMask will prompt to switch networks
   - Or manually switch in MetaMask

4. **Test Purchase Flow:**
   - Enter USDT amount
   - Click "Approve USDT"
   - Wait for approval confirmation
   - Click "Buy BCRW Tokens"
   - Confirm transaction

## Production Deployment

Before deploying to production:

1. **Update .env for production:**
   ```bash
   VITE_NETWORK_ENV=mainnet
   VITE_PRESALE_CONTRACT_ADDRESS=<mainnet_address>
   VITE_USDT_TOKEN_ADDRESS=0xdac17f958d2ee523a2206206994597c13d831ec7
   ```

2. **Add production domain to Reown Dashboard**

3. **Test on mainnet with small amounts first**

4. **Monitor transactions:**
   - View on Etherscan
   - Check contract events
   - Monitor error logs

## Additional Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/react/core/installation)
- [Ethereum Sepolia Explorer](https://sepolia.etherscan.io)
- [Ethereum Mainnet Explorer](https://etherscan.io)
- [USDT Contract (Mainnet)](https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7)

## Contact

For contract addresses or additional support, contact the backend team.

