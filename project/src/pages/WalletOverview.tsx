import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { InputField } from '../components/forms/InputField';
import { Button } from '../components/forms/Button';
import { getWalletOverview } from '../api';
import { WalletOverview as WalletOverviewType } from '../types';
import { Wallet, DollarSign, Coins, Activity } from 'lucide-react';

export const WalletOverview: React.FC = () => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [lookbackDays, setLookbackDays] = useState(30);
  const [data, setData] = useState<WalletOverviewType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await getWalletOverview(address.trim(), chain, lookbackDays);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch wallet data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet Overview</h1>
          <p className="text-gray-400">Analyze any wallet's holdings and transaction history</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <InputField
                label="Wallet Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                error={error && !loading ? error : undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Chain</label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </div>
            <div>
              <InputField
                label="Lookback Days"
                type="number"
                value={lookbackDays}
                onChange={(e) => setLookbackDays(Number(e.target.value))}
                min="1"
                max="365"
              />
            </div>
          </div>
          <Button
            onClick={handleAnalyze}
            loading={loading}
            className="mt-4"
            disabled={!address.trim()}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Analyze Wallet
          </Button>
        </Card>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-blue-500" />
          </div>
        )}

        {error && !loading && (
          <ErrorState message={error} onRetry={handleAnalyze} />
        )}

        {data && !loading && (
          <div className="space-y-6">
            {/* Wallet Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="h-6 w-6 text-blue-500" />
                  <span className="text-sm text-gray-400">{chain.toUpperCase()}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">Address</h3>
                <p className="text-lg font-semibold text-white">{formatAddress(data.address)}</p>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <span className="text-2xl font-bold text-white">{formatCurrency(data.totalValue)}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-300">Total Value</h3>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">{data.tokens?.length || 0}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-300">Tokens</h3>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-6 w-6 text-purple-500" />
                  <span className="text-2xl font-bold text-white">{data.transactions?.length || 0}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-300">Transactions</h3>
              </Card>
            </div>

            {/* Token Holdings */}
            {data.tokens && data.tokens.length > 0 && (
              <Card title="Token Holdings" subtitle="Current token balances">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-300 font-medium">Token</th>
                        <th className="text-right py-2 text-gray-300 font-medium">Balance</th>
                        <th className="text-right py-2 text-gray-300 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tokens.map((token, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          <td className="py-3">
                            <div>
                              <div className="text-white font-medium">{token.symbol}</div>
                              <div className="text-gray-400 text-sm">{token.name}</div>
                            </div>
                          </td>
                          <td className="py-3 text-right text-white">
                            {parseFloat(token.balance).toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-white">
                            {token.valueUsd ? formatCurrency(token.valueUsd) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Recent Transactions */}
            {data.transactions && data.transactions.length > 0 && (
              <Card title="Recent Transactions" subtitle="Latest transaction activity">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-300 font-medium">Hash</th>
                        <th className="text-left py-2 text-gray-300 font-medium">From/To</th>
                        <th className="text-right py-2 text-gray-300 font-medium">Value</th>
                        <th className="text-right py-2 text-gray-300 font-medium">Gas</th>
                        <th className="text-center py-2 text-gray-300 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactions.slice(0, 10).map((tx, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          <td className="py-3">
                            <a
                              href={`/transaction/${tx.hash}`}
                              className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                            >
                              {formatAddress(tx.hash)}
                            </a>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">
                              <div className="text-gray-400">From: {formatAddress(tx.from)}</div>
                              <div className="text-gray-400">To: {formatAddress(tx.to)}</div>
                            </div>
                          </td>
                          <td className="py-3 text-right text-white">
                            {parseFloat(tx.value).toFixed(4)} ETH
                          </td>
                          <td className="py-3 text-right text-gray-400 text-sm">
                            {parseFloat(tx.gasUsed).toLocaleString()}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === 'success' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};