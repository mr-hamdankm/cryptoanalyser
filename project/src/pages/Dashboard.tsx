import React from 'react';
import { Card } from '../components/common/Card';
import { Wallet, TrendingUp, Shield, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      icon: <Wallet className="h-6 w-6 text-blue-500" />,
      label: 'Wallet Analysis',
      value: 'Available',
      description: 'Analyze any wallet address'
    },
    {
      icon: <Activity className="h-6 w-6 text-green-500" />,
      label: 'Transaction Decoder',
      value: 'Ready',
      description: 'Decode any transaction'
    },
    {
      icon: <Shield className="h-6 w-6 text-yellow-500" />,
      label: 'Token Approvals',
      value: 'Monitor',
      description: 'Check token permissions'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      label: 'Swap Tracking',
      value: 'Track',
      description: 'Monitor DEX activity'
    }
  ];

  const quickActions = [
    {
      title: 'Analyze Wallet',
      description: 'Get detailed insights into any wallet address',
      href: '/wallet',
      icon: <Wallet className="h-6 w-6" />,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Check Approvals',
      description: 'Review and manage token approvals',
      href: '/approvals',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: 'Track Swaps',
      description: 'Monitor your trading activity',
      href: '/swaps',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crypto Analysis Dashboard
          </h1>
          <p className="text-gray-400">
            Comprehensive tools for blockchain analysis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
                <span className="text-lg font-bold text-white">{stat.value}</span>
              </div>
              <h3 className="font-medium text-white mb-1">{stat.label}</h3>
              <p className="text-sm text-gray-400">{stat.description}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`p-4 rounded-lg text-white transition-colors ${action.color} block`}
              >
                <div className="flex items-center mb-2">
                  {action.icon}
                  <h3 className="ml-2 font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* Getting Started */}
        <Card title="Getting Started" className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-white">Analyze a Wallet</h4>
                <p className="text-gray-300 text-sm">Enter a wallet address to start analyzing transactions and holdings</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-white">Review Approvals</h4>
                <p className="text-gray-300 text-sm">Check which dApps have permission to spend tokens</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-white">Track Activity</h4>
                <p className="text-gray-300 text-sm">Monitor swaps, gas usage, and transaction patterns</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};