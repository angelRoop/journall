import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { fetchTrades } from '@/lib/apiClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';
import SessionPieChart from '@/components/SessionPieChart.jsx';
import SymbolStatistics from '@/components/SymbolStatistics.jsx';
import TagsUsage from '@/components/TagsUsage.jsx';

const StatisticsPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      const records = await fetchTrades();
      setTrades(records);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Statistics - TradeJournal</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
              {!loading && trades.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Trades by Session</h2>
                  <p className="text-muted-foreground">Click a segment for detailed win/loss breakdown</p>
                </div>
                <div className="grid grid-cols-1">
                  <SessionPieChart trades={trades} />
                </div>
              </section>
            )}

            {!loading && trades.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Performance by Symbol</h2>
                  <p className="text-muted-foreground">Average profit/loss and direction accuracy for each symbol</p>
                </div>
                <div className="grid grid-cols-1">
                  <SymbolStatistics trades={trades} />
                </div>
              </section>
            )}

            {!loading && trades.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Strategy Tags Analytics</h2>
                  <p className="text-muted-foreground">Performance metrics for your tagged strategies</p>
                </div>
                <div className="grid grid-cols-1">
                  <TagsUsage trades={trades} />
                </div>
              </section>
            )}
            
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StatisticsPage;