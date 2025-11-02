# Environment Configuration Guide

## Quick Setup

### 1. Get Your Reown Project ID (Free)

1. Visit: **https://cloud.reown.com/**
2. Sign up / Log in
3. Click "Create Project"
4. Give it a name: `Blackcroww ICO`
5. Copy your **Project ID**

### 2. Update .env File

The `.env` file is already created. Just update these values:

```bash
# Open .env file and update:
VITE_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here
```

### 3. Add Contract Addresses (When Deployed)

Once your smart contracts are deployed on BSC:

```bash
# Update these in .env:
VITE_PRESALE_CONTRACT=0xYourPresaleContractAddress
VITE_TOKEN_CONTRACT=0xYourBCRWTokenAddress
```

## Environment Files

- **`.env`** - Your local configuration (NOT committed to git)
- **`.env.example`** - Template for other developers
- **`.env.testnet`** - Pre-configured for BSC Testnet
- **`.env.mainnet`** - Pre-configured for BSC Mainnet

## Switching Networks

### For Testnet (Development)
```bash
VITE_NETWORK_ENV=testnet
VITE_CHAIN_ID=97
```

### For Mainnet (Production)
```bash
VITE_NETWORK_ENV=mainnet
VITE_CHAIN_ID=56
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_NETWORK_ENV` | Network environment (testnet/mainnet) | ✅ |
| `VITE_CHAIN_ID` | Blockchain chain ID (97 for testnet, 56 for mainnet) | ✅ |
| `VITE_WALLETCONNECT_PROJECT_ID` | Your Reown/WalletConnect Project ID | ✅ |
| `VITE_PRESALE_CONTRACT` | Deployed presale contract address | ⏳ (Add when deployed) |
| `VITE_TOKEN_CONTRACT` | Deployed BCRW token address | ⏳ (Add when deployed) |
| `VITE_BSC_TESTNET_RPC` | BSC Testnet RPC endpoint | ✅ (Pre-filled) |
| `VITE_BSC_MAINNET_RPC` | BSC Mainnet RPC endpoint | ✅ (Pre-filled) |

## Security Notes

⚠️ **Important:**
- Never commit `.env` to git (already in `.gitignore`)
- Never share your private keys or sensitive data
- The Project ID is safe to use publicly (it's for app identification)
- Contract addresses are public once deployed

## Testing Your Configuration

After updating `.env`:

1. Restart the development server:
```bash
npm run dev
```

2. Click "Connect Wallet"
3. You should see the Reown modal popup!

## Getting Help

- **Reown Docs**: https://docs.reown.com/
- **BSC Testnet Faucet**: https://testnet.bnbchain.org/faucet-smart
- **BSC Scan (Testnet)**: https://testnet.bscscan.com/

## Example Valid Configuration

```bash
# Example of properly configured .env
VITE_NETWORK_ENV=testnet
VITE_CHAIN_ID=97
VITE_BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
VITE_BSC_MAINNET_RPC=https://bsc-dataseed.binance.org/
VITE_WALLETCONNECT_PROJECT_ID=a21854a77c3b6670a9c1b857e35ef5ea
VITE_PRESALE_CONTRACT=0x1234567890abcdef1234567890abcdef12345678
VITE_TOKEN_CONTRACT=0xabcdef1234567890abcdef1234567890abcdef12
```

---

**Ready to go!** 🚀

Just get your Reown Project ID and paste it in `.env`, then restart the server!

