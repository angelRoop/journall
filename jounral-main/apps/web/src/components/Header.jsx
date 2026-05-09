import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <TrendingUp className="w-6 h-6" />
            TradeJournal
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/add-trade"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/add-trade') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Add Trade
            </Link>
            <Link
              to="/statistics"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/statistics') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Statistics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;