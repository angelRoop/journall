import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { fetchTrades } from '@/lib/apiClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import SessionPieChart from '@/components/SessionPieChart.jsx';

const StatisticsPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All Trades');

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

  const getAllTags = () => {
    const tags = new Set();
    trades.forEach(t => {
      if (t.customTags) t.customTags.forEach(tag => tags.add(tag));
      if (t.tags) t.tags.forEach(tag => tags.add(tag));
    });
    return ['All Trades', ...Array.from(tags)];
  };

  const getFilteredTrades = () => {
    if (selectedTag === 'All Trades') return trades;
    return trades.filter(t => 
      (t.customTags && t.customTags.includes(selectedTag)) || 
      (t.tags && t.tags.includes(selectedTag))
    );
  };

  const getTagStats = () => {
    const filtered = getFilteredTrades();
    if (filtered.length === 0) return null;

    const wins = filtered.filter(t => (t.netPnL || t.pnl) > 0).length;
    const losses = filtered.filter(t => (t.netPnL || t.pnl) < 0).length;
    const flat = filtered.length - wins - losses;
    const totalPnL = filtered.reduce((sum, t) => sum + (t.netPnL || t.pnl || 0), 0);
    const avgRR = filtered.reduce((sum, t) => sum + (t.riskRewardRatio || 0), 0) / filtered.length;

    return {
      total: filtered.length,
      wins,
      losses,
      flat,
      winRate: (wins / filtered.length) * 100,
      avgPnL: totalPnL / filtered.length,
      avgRR,
      pieData: [
        { name: 'Wins', value: wins, color: 'hsl(var(--chart-win))' },
        { name: 'Losses', value: losses, color: 'hsl(var(--chart-loss))' },
        { name: 'Flat', value: flat, color: 'hsl(var(--chart-flat))' }
      ].filter(d => d.value > 0)
    };
  };

  const tags = getAllTags();
  const stats = getTagStats();

  return (
    <>
      <Helmet>
        <title>Statistics - TradeJournal</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <section>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Performance Metrics</h1>
                <p className="text-muted-foreground mb-8">Filter your performance by custom strategy tags</p>
              </div>

              {loading ? (
                <Skeleton className="h-[400px] w-full rounded-2xl" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-3 space-y-2">
                    <Card className="glass-card shadow-sm h-full">
                      <CardHeader className="pb-3 border-b"><CardTitle className="text-lg">Filter Tags</CardTitle></CardHeader>
                      <CardContent className="p-3">
                        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {tags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(tag)}
                              className={`text-left px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${selectedTag === tag ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-9">
                    {stats ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="glass-card shadow-sm h-full flex flex-col">
                          <CardHeader className="pb-2">
                            <CardTitle>Win/Loss Breakdown</CardTitle>
                            <CardDescription>Based on selected tag</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex items-center justify-center min-h-[420px]">
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie 
                                  data={stats.pieData} 
                                  dataKey="value" 
                                  nameKey="name" 
                                  cx="50%" 
                                  cy="50%" 
                                  innerRadius={60}
                                  outerRadius={90} 
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {stats.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--background)" strokeWidth={2} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  itemStyle={{ fontWeight: 500 }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        <Card className="glass-card shadow-sm h-full flex flex-col">
                          <CardHeader className="pb-2">
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Tag: {selectedTag}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 min-h-[420px]">
                            <div className="grid grid-cols-2 gap-4 h-full">
                              <div className="bg-muted/40 p-5 rounded-2xl border flex flex-col justify-center">
                                <div className="text-sm font-medium text-muted-foreground mb-1">Total Trades</div>
                                <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
                              </div>
                              <div className="bg-muted/40 p-5 rounded-2xl border flex flex-col justify-center">
                                <div className="text-sm font-medium text-muted-foreground mb-1">Win Rate</div>
                                <div className="text-3xl font-bold tracking-tight">{stats.winRate.toFixed(1)}%</div>
                              </div>
                              <div className="bg-muted/40 p-5 rounded-2xl border flex flex-col justify-center">
                                <div className="text-sm font-medium text-muted-foreground mb-1">Avg Net P&L</div>
                                <div className={`text-3xl font-bold tracking-tight ${stats.avgPnL > 0 ? 'text-[hsl(var(--success))]' : stats.avgPnL < 0 ? 'text-destructive' : ''}`}>
                                  ${stats.avgPnL.toFixed(2)}
                                </div>
                              </div>
                              <div className="bg-muted/40 p-5 rounded-2xl border flex flex-col justify-center">
                                <div className="text-sm font-medium text-muted-foreground mb-1">Avg Risk:Reward</div>
                                <div className="text-3xl font-bold tracking-tight">{stats.avgRR.toFixed(2)}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <Card className="glass-card border-dashed flex items-center justify-center min-h-[400px]">
                        <div className="text-center text-muted-foreground">
                          <div className="text-lg font-medium mb-1">No data available</div>
                          <p className="text-sm">There are no trades matching the selected tag.</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </section>

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
            
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StatisticsPage;