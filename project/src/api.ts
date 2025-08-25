import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
});

// Wallet endpoints
export const getWalletOverview = (address: string, chain: string, lookbackDays?: number) =>
  api.get(`/api/wallet/${address}`, { params: { chain, lookbackDays } });

export const decodeTransaction = (txHash: string, chain: string) =>
  api.get(`/api/tx/${txHash}`, { params: { chain } });

export const listTokenApprovals = (address: string, chain: string) =>
  api.get(`/api/approvals/${address}`, { params: { chain } });

export const findSwaps = (address: string, chain: string, minUsd?: number, since?: string) =>
  api.get(`/api/swaps/${address}`, { params: { chain, minUsd, since } });

export const getGasInsight = (params: any) =>
  api.get("/api/gas", { params });

export default api;