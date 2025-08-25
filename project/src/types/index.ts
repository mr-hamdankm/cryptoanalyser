// API Response Types
export interface WalletOverview {
  address: string;
  chain: string;
  balance: string;
  balanceUsd: number;
  tokens: Token[];
  transactions: Transaction[];
  totalValue: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price?: number;
  valueUsd?: number;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  status: string;
}

export interface DecodedTransaction {
  hash: string;
  chain: string;
  method: string;
  parameters: any[];
  decodedData: any;
  humanReadable: string;
}

export interface TokenApproval {
  token: string;
  spender: string;
  amount: string;
  allowance: string;
  symbol: string;
  name: string;
}

export interface Swap {
  txHash: string;
  timestamp: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  valueUsd: number;
  dex: string;
}

export interface GasInsight {
  averageGasPrice: string;
  totalGasUsed: string;
  totalGasCostUsd: number;
  transactions: number;
  period: string;
}