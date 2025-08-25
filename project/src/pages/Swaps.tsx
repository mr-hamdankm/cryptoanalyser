import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { InputField } from '../components/forms/InputField';
import { Button } from '../components/forms/Button';
import { findSwaps } from '../api';
import { Swap } from '../types';
import { TrendingUp, ArrowRight, ExternalLink, Filter } from 'lucide-react';

export const Swaps: React.FC = () => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [minUsd, setMinUsd] = useState('');
  const [since, setSince] = useState('');
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await findSwaps(
        address.trim(), 
        chain, 
        minUsd ? parseFloat(minUsd) : undefined,
        since || undefined
      );
      setSwaps(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch swaps');
      setSwaps([]);
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExplorerUrl = (hash: string, chain: string) => {
    const explorers = {
      ethereum: `https://etherscan.io/tx/${hash}`,
      polygon: `https://polygonscan.com/tx/${hash}`,
      bsc: `https://bscscan.com/tx/${hash}`,
      arbitrum: `https://arbiscan.io/tx/${hash}`
    };
    return explorers[chain as keyof typeof explorers] || explorers.ethereum;
  };

  const totalVolume = swaps.reduce((sum, swap) => sum + swap.valueUsd, 0);
  const averageSwapSize = swaps.length > 0 ? totalVolume / swaps.length : 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Swap History</h1>
          <p className="text-gray-400">Track and analyze your DEX trading activity</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
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
                label="Min USD Value"
                type="number"
                value={minUsd}
                onChange={(e) => setMinUsd(e.target.value)}
                placeholder="e.g. 100"
                hint="Filter swaps above this value"
              />
            </div>
            <div>
              <InputField
                label="Since Date"
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
                hint="Filter swaps after this date"
              />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            loading={loading}
            className="mt-4"
            disabled={!address.trim()}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Find Swaps
          </Button>
        </Card>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-blue-500" />
          </div>
        )}

        {error && !loading && (
          <ErrorState message={error} onRetry={handleSearch} />
        )}

        {swaps.length > 0 && !loading && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {swaps.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Swaps</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {formatCurrency(totalVolume)}
                  </div>
                  <div className="text-sm text-gray-400">Total Volume</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {formatCurrency(averageSwapSize)}
                  </div>
                  <div className="text-sm text-gray-400">Avg. Swap Size</div>
                </div>
              </Card>
            </div>

            {/* Swaps List */}
            <Card title="Swap Transactions">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-300 font-medium">Date</th>
                      <th className="text-left py-3 text-gray-300 font-medium">Trade</th>
                      <th className="text-right py-3 text-gray-300 font-medium">Value</th>
                      <th className="text-left py-3 text-gray-300 font-medium">DEX</th>
                      <th className="text-center py-3 text-gray-300 font-medium">TX</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swaps.map((swap, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-4">
                          <div className="text-white text-sm">
                            {formatDate(swap.timestamp)}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <div className="bg-gray-700 px-2 py-1 rounded text-xs text-white font-mono">
                              {swap.tokenIn}
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <div className="bg-gray-700 px-2 py-1 rounded text-xs text-white font-mono">
                              {swap.tokenOut}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                            <span>{parseFloat(swap.amountIn).toLocaleString()}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{parseFloat(swap.amountOut).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="text-white font-medium">
                            {formatCurrency(swap.valueUsd)}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                            {swap.dex}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <a
                            href={getExplorerUrl(swap.txHash, chain)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1"
                          >
                            <span className="font-mono text-xs">
                              {formatAddress(swap.txHash)}
                            </span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {swaps.length === 0 && !loading && !error && address && (
          <Card>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Swaps Found</h3>
              <p className="text-gray-400">
                No swap transactions found for the specified criteria. Try adjusting your filters.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};