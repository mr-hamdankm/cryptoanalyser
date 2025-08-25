import React from 'react';
import { Wallet } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Wallet className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold text-white">CryptoAnalyzer</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 CryptoAnalyzer. Built for blockchain transparency.
          </div>
        </div>
      </div>
    </footer>
  );
};