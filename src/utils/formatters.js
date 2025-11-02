// Utility functions for formatting

// Format wallet address to short form
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Format number with commas
export const formatNumber = (num, decimals = 2) => {
  if (!num && num !== 0) return 'N/A';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return 'N/A';
  
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Format large numbers with K, M, B suffixes
export const formatCompactNumber = (num) => {
  if (!num && num !== 0) return 'N/A';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return 'N/A';
  
  const absNum = Math.abs(number);
  
  if (absNum >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B';
  }
  if (absNum >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M';
  }
  if (absNum >= 1e3) {
    return (number / 1e3).toFixed(2) + 'K';
  }
  
  return number.toFixed(2);
};

// Format currency (USD)
export const formatCurrency = (amount, currency = 'USD', decimals = 2) => {
  if (!amount && amount !== 0) return 'N/A';
  
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(number)) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Format token amount
export const formatTokenAmount = (amount, decimals = 2, symbol = '') => {
  if (!amount && amount !== 0) return 'N/A';
  
  const formatted = formatNumber(amount, decimals);
  return symbol ? `${formatted} ${symbol}` : formatted;
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  if (!value && value !== 0) return 'N/A';
  
  const number = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(number)) return 'N/A';
  
  return `${number.toFixed(decimals)}%`;
};

// Format time remaining (countdown)
export const formatTimeRemaining = (seconds) => {
  if (!seconds || seconds < 0) return '00:00:00';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Parse token amount to BigNumber compatible string
export const parseTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  
  const [whole, fraction = ''] = amount.toString().split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  
  return whole + paddedFraction;
};

// Format date
export const formatDate = (timestamp, format = 'short') => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) return 'N/A';
  
  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString();
};

// Validate ETH/BSC address
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Get transaction link
export const getTransactionLink = (txHash, blockExplorer) => {
  return `${blockExplorer}/tx/${txHash}`;
};

// Get address link
export const getAddressLink = (address, blockExplorer) => {
  return `${blockExplorer}/address/${address}`;
};
