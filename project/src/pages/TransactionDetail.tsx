import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/forms/Button';
import { decodeTransaction } from '../api';
import { DecodedTransaction } from '../types';
import { Search, ExternalLink, Hash } from 'lucide-react';

export const TransactionDetail: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [txHash, setTxHash] = useState(hash || '');
  const [chain, setChain] = useState('ethereum');
  const [data, setData] = useState<DecodedTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hash) {
      handleDecode();
    }
  }, [hash]);

  const handleDecode = async () => {
    if (!txHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await decodeTransaction(txHash.trim(), chain);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to decode transaction');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transaction Decoder</h1>
          <p className="text-gray-400">Decode and analyze blockchain transactions</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-6 gap-4">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transaction Hash
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && !loading && (
                <p className="mt-1 text-xs text-red-400">{error}</p>
              )}
            </div>
            <div className="md:col-span-1">
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
            <div className="md:col-span-1 flex items-end">
              <Button
                onClick={handleDecode}
                loading={loading}
                disabled={!txHash.trim()}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Decode
              </Button>
            </div>
          </div>
        </Card>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-blue-500" />
          </div>
        )}

        {error && !loading && !data && (
          <ErrorState message={error} onRetry={handleDecode} />
        )}

        {data && !loading && (
          <div className="space-y-6">
            {/* Transaction Overview */}
            <Card title="Transaction Overview">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Hash</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-sm">{formatAddress(data.hash)}</span>
                    <a
                      href={getExplorerUrl(data.hash, data.chain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Chain</h4>
                  <span className="text-white uppercase">{data.chain}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Method</h4>
                  <span className="text-white bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                    {data.method}
                  </span>
                </div>
              </div>
            </Card>

            {/* Human Readable Description */}
            {data.humanReadable && (
              <Card title="What This Transaction Does">
                <p className="text-white text-lg leading-relaxed">
                  {data.humanReadable}
                </p>
              </Card>
            )}

            {/* Method Parameters */}
            {data.parameters && data.parameters.length > 0 && (
              <Card title="Method Parameters">
                <div className="space-y-4">
                  {data.parameters.map((param, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <div className="mb-2 md:mb-0 md:w-1/4">
                          <span className="text-sm font-medium text-gray-300">
                            {param.name || `Parameter ${index + 1}`}
                          </span>
                          {param.type && (
                            <div className="text-xs text-gray-500 mt-1">{param.type}</div>
                          )}
                        </div>
                        <div className="md:flex-1">
                          <pre className="text-white bg-gray-700 p-2 rounded text-sm overflow-x-auto">
                            {typeof param.value === 'object' 
                              ? JSON.stringify(param.value, null, 2)
                              : String(param.value)
                            }
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Raw Decoded Data */}
            {data.decodedData && (
              <Card title="Raw Decoded Data">
                <pre className="text-white bg-gray-700 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(data.decodedData, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};