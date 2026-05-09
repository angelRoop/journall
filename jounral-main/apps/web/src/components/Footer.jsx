import React from 'react';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted text-muted-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">TradeJournal</span>
          </div>
          
          <p className="text-sm">
            © {new Date().getFullYear()} TradeJournal. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;