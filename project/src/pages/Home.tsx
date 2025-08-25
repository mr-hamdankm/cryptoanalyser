import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Shield, TrendingUp, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const features = [
    {
      icon: <Wallet className="h-8 w-8 text-blue-500" />,
      title: 'Wallet Analysis',
      description: 'Get comprehensive insights into your crypto wallet holdings and transaction history.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Token Approvals',
      description: 'Monitor and manage your token approvals to stay secure from malicious contracts.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: 'Swap Tracking',
      description: 'Track all your DEX swaps and analyze your trading performance over time.'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Gas Insights',
      description: 'Understand your gas usage patterns and optimize transaction costs.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Understand Your 
            <span className="text-blue-500"> Crypto Wallet</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Get deep insights into your blockchain transactions, token approvals, and wallet activity. 
            Make informed decisions with our comprehensive analysis tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/wallet"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Analyze Wallet
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Powerful Features for Crypto Analysis
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to analyze your wallet?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Start exploring your crypto transactions and get insights into your blockchain activity.
          </p>
          <Link
            to="/wallet"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Start Analysis
          </Link>
        </div>
      </div>
    </div>
  );
};