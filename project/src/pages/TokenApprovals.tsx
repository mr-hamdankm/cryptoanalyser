import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { InputField } from '../components/forms/InputField';
import { Button } from '../components/forms/Button';
import { listTokenApprovals } from '../api';
import { TokenApproval } from '../types';
import { Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

export const TokenApprovals: React.FC = () => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [approvals, setApprovals] = useState<TokenApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await listTokenApprovals(address.trim(), chain);
      setApprovals(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch token approvals');
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num === 0) return '0';
    if (num >= 1e18) return '∞ (Unlimited)';
    return num.toLocaleString();
  };

  const getRiskLevel = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1e18) return { level: 'high', color: 'text-red-400', bg: 'bg-red-900' };
    if (num > 1000) return { level: 'medium', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { level: 'low', color: 'text-green-400', bg: 'bg-green-900' };
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getExplorerUrl = (address: string, chain: string) => {
    const explorers = {
      ethereum: `https://etherscan.io/address/${address}`,
      polygon: `https://polygonscan.com/address/${address}`,
      bsc: `https://bscscan.com/address/${address}`,
      arbitrum: `https://arbiscan.io/address/${address}`
    };
    return explorers[chain as keyof typeof explorers] || explorers.ethereum;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Token Approvals</h1>
          <p className="text-gray-400">Monitor and manage your token permissions</p>
        </div>

        {/* Security Warning */}
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">Security Notice</h3>
              <p className="text-yellow-200 text-sm">
                Token approvals allow smart contracts to spend your tokens. Always review unlimited approvals carefully 
                and revoke permissions you no longer need.
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-3 gap-4">
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
          </div>
          <Button
            onClick={handleCheck}
            loading={loading}
            className="mt-4"
            disabled={!address.trim()}
          >
            <Shield className="h-4 w-4 mr-2" />
            Check Approvals
          </Button>
        </Card>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-blue-500" />
          </div>
        )}

        {error && !loading && (
          <ErrorState message={error} onRetry={handleCheck} />
        )}

        {approvals.length > 0 && !loading && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {approvals.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Approvals</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {approvals.filter(a => getRiskLevel(a.allowance).level === 'high').length}
                  </div>
                  <div className="text-sm text-gray-400">High Risk</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {approvals.filter(a => getRiskLevel(a.allowance).level === 'medium').length}
                  </div>
                  <div className="text-sm text-gray-400">Medium Risk</div>
                </div>
              </Card>
            </div>

            {/* Approvals List */}
            <Card title="Active Token Approvals">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-300 font-medium">Token</th>
                      <th className="text-left py-3 text-gray-300 font-medium">Spender</th>
                      <th className="text-right py-3 text-gray-300 font-medium">Allowance</th>
                      <th className="text-center py-3 text-gray-300 font-medium">Risk</th>
                      <th className="text-center py-3 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((approval, index) => {
                      const risk = getRiskLevel(approval.allowance);
                      return (
                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="py-4">
                            <div>
                              <div className="text-white font-medium">{approval.symbol}</div>
                              <div className="text-gray-400 text-sm">{approval.name}</div>
                              <div className="text-gray-500 text-xs font-mono mt-1">
                                {formatAddress(approval.token)}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-mono text-sm">
                                {formatAddress(approval.spender)}
                              </span>
                              <a
                                href={getExplorerUrl(approval.spender, chain)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="text-white font-medium">
                              {formatAmount(approval.allowance)}
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${risk.color} ${risk.bg}`}>
                              {getRiskIcon(risk.level)}
                              <span className="ml-1 capitalize">{risk.level}</span>
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            <Button
                              variant="danger"
                              className="text-xs px-2 py-1"
                              onClick={() => {
                                // This would typically revoke the approval
                                // Implementation depends on wallet connection
                                alert('Revoke functionality requires wallet connection');
                              }}
                            >
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {approvals.length === 0 && !loading && !error && address && (
          <Card>
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Active Approvals</h3>
              <p className="text-gray-400">This wallet has no active token approvals.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};