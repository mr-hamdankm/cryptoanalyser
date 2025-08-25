import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { WalletOverview } from './pages/WalletOverview';
import { TransactionDetail } from './pages/TransactionDetail';
import { TokenApprovals } from './pages/TokenApprovals';
import { Swaps } from './pages/Swaps';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wallet" element={<WalletOverview />} />
              <Route path="/transaction/:hash?" element={<TransactionDetail />} />
              <Route path="/approvals" element={<TokenApprovals />} />
              <Route path="/swaps" element={<Swaps />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;