# Environment Variables Setup Guide

## Quick Start

The project uses environment variables to configure network settings, API keys, and contract addresses.

## Files Created

- **`.env`** - Main configuration (already has a demo Project ID)
- **`.env.example`** - Template for reference
- **`.env.local`** - Your personal local development (Git ignored)
- **`.env.testnet`** - BSC Testnet configuration
- **`.env.mainnet`** - BSC Mainnet configuration

## Required Environment Variables

### 1. WalletConnect / Reown Project ID ⭐ REQUIRED

**What it does**: Powers the wallet connection modal (Web3Modal/Reown)

**How to get it** (FREE):

1. Visit: https://cloud.reown.com/
2. Click "Sign Up" (or "Log In" if you have an account)
3. Create a new project
4. Give it a name: "Blackcroww ICO"
5. Copy the **Project ID**
6. Paste it in your `.env` file:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Current Status**: Using demo ID (`a21854a77c3b6670a9c1b857e35ef5ea`)
- ✅ Works for development
- ⚠️ **Get your own ID before production launch!**

---

### 2. Network Configuration

**BSC Testnet** (for development):
```bash
VITE_NETWORK_ENV=testnet
VITE_CHAIN_ID=97
VITE_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

**BSC Mainnet** (for production):
```bash
VITE_NETWORK_ENV=mainnet
VITE_CHAIN_ID=56
VITE_BSC_RPC_URL=https://bsc-dataseed.binance.org/
```

---

### 3. Smart Contract Addresses (Add when ready)

```bash
# Your presale contract address
VITE_PRESALE_CONTRACT=0x1234567890abcdef...

# Your CROWW token contract address
VITE_TOKEN_CONTRACT=0xabcdef1234567890...
```

**When to add**:
- After deploying contracts on BSC Testnet
- Before enabling real token purchases

---

### 4. Optional: BSCScan API Key

**What it does**: Allows verified contract interactions and better error messages

**How to get it** (FREE):

1. Visit: https://bscscan.com/apis
2. Sign up for a free account
3. Go to "API Keys"
4. Create a new API key
5. Add to `.env`:

```bash
VITE_EXPLORER_API_KEY=your_api_key_here
```

---

## Using Different Environments

### Development (Testnet)
```bash
cp .env.testnet .env
npm run dev
```

### Production (Mainnet)
```bash
cp .env.mainnet .env
npm run build
```

---

## Security Best Practices

### ✅ DO:
- Keep `.env.local` for your personal keys
- Use `.env.example` as a template for team members
- Add sensitive keys only to `.env.local` (Git ignored)
- Use different Project IDs for dev/staging/prod

### ❌ DON'T:
- Never commit `.env` or `.env.local` to Git
- Don't share your personal Project ID publicly
- Don't hardcode keys in source code

---

## Environment Variables in Code

Access environment variables in your code:

```javascript
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const contractAddress = import.meta.env.VITE_PRESALE_CONTRACT;
const isTestnet = import.meta.env.VITE_NETWORK_ENV === 'testnet';
```

**Note**: All Vite env variables must start with `VITE_` to be exposed to the client.

---

## Verification Checklist

Before launching, verify:

- [ ] Got your own Reown Project ID
- [ ] Added Project ID to `.env`
- [ ] Deployed smart contracts
- [ ] Added contract addresses to `.env`
- [ ] Tested on BSC Testnet
- [ ] Switched to mainnet config for production
- [ ] Removed demo/test keys

---

## Current Configuration

Your current `.env` file is set up with:

✅ **Network**: BSC Testnet (Chain ID: 97)
✅ **Project ID**: Demo ID (replace before production!)
⏳ **Contracts**: Not yet added (add after deployment)

---

## Getting Help

If you need help:

1. **Reown Support**: https://docs.reown.com/
2. **BSC Network Info**: https://docs.bnbchain.org/
3. **Check Configuration**: Look at `src/config/networks.js` and `src/config/constants.js`

---

## Quick Reference

| Variable | Required | Where to Get |
|----------|----------|--------------|
| `VITE_WALLETCONNECT_PROJECT_ID` | ✅ Yes | https://cloud.reown.com/ |
| `VITE_PRESALE_CONTRACT` | ⏳ Later | Deploy your contract |
| `VITE_TOKEN_CONTRACT` | ⏳ Later | Deploy your contract |
| `VITE_EXPLORER_API_KEY` | ❌ Optional | https://bscscan.com/apis |

---

**Ready to go!** Start with the demo Project ID, then get your own from Reown before launching. 🚀

