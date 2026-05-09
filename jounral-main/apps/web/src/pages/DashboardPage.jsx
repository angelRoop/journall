import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { fetchTrades as fetchTradesFromApi } from '@/lib/apiClient.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import TradesTable from '@/components/TradesTable.jsx';
import MarketConditionPieChart from '@/components/MarketConditionPieChart.jsx';
import { Plus, Activity, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [previewTrade, setPreviewTrade] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedNotesTrade, setSelectedNotesTrade] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageOpen, setSelectedImageOpen] = useState(false);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      const records = await fetchTradesFromApi();
      setTrades(records);
    } catch (error) {
      toast.error('Failed to load trades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getParsedDate = (trade) => {
    const dateValue = trade.tradeDate || trade.createdAt || trade.created || trade.date;
    const parsed = new Date(dateValue);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  };

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const tradeDate = getParsedDate(trade);
      if (!tradeDate) return true;

      if (startDate) {
        const start = new Date(startDate);
        if (tradeDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (tradeDate > end) return false;
      }

      return true;
    });
  }, [trades, startDate, endDate]);

  const stats = useMemo(() => {
    const records = filteredTrades;
    const total = records.length;
    const wins = records.filter((t) => (t.netPnL || t.pnl) > 0).length;
    const totalPnL = records.reduce((sum, t) => sum + (t.netPnL || t.pnl || 0), 0);
    const avgRR = records.reduce((sum, t) => sum + (t.riskRewardRatio || 0), 0) / Math.max(records.length, 1);

    return {
      total,
      winRate: total ? (wins / total) * 100 : 0,
      avgRR,
      totalPnL,
    };
  }, [filteredTrades]);

  const handlePreviewImages = (trade) => {
    setPreviewTrade(trade);
    setPreviewOpen(true);
  };

  const handlePreviewNotes = (trade) => {
    setSelectedNotesTrade(trade);
    setNotesOpen(true);
  };

  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setSelectedImageOpen(true);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - TradeJournal</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your trading performance</p>
              </div>
              <Link to="/add-trade">
                <Button className="gap-2 shadow-md">
                  <Plus className="w-4 h-4" /> New Trade
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">From</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">To</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Reset filters
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Activity className="w-4 h-4" /> Total Trades
                  </div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Target className="w-4 h-4" /> Win Rate
                  </div>
                  <div className="text-3xl font-bold">{stats.winRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <TrendingUp className="w-4 h-4" /> Avg R:R
                  </div>
                  <div className="text-3xl font-bold">{stats.avgRR.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Activity className="w-4 h-4" /> Net P&L
                  </div>
                  <div className={`text-3xl font-bold ${stats.totalPnL >= 0 ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>
                    ${stats.totalPnL.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <MarketConditionPieChart trades={filteredTrades} />
            </div>

            {loading ? (
              <Card className="glass-card"><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
            ) : (
              <TradesTable
                trades={filteredTrades}
                onPreviewImages={handlePreviewImages}
                onPreviewNotes={handlePreviewNotes}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trade Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {previewTrade ? (
              ['beforeEntryImage', 'duringTradeImage', 'exitImage'].some(field => previewTrade[field]) ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['beforeEntryImage', 'duringTradeImage', 'exitImage'].map((field) => (
                    previewTrade[field] ? (
                      <div key={field} className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground capitalize">{field.replace(/([A-Z])/g, ' $1')}</div>
                        <button
                          type="button"
                          className="block w-full overflow-hidden rounded-xl border bg-slate-950/5"
                          onClick={() => handleOpenImage(previewTrade[field])}
                        >
                          <img src={previewTrade[field]} alt={field} className="w-full h-56 object-cover transition-transform hover:scale-105" />
                        </button>
                      </div>
                    ) : null
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No images available for this trade.</div>
              )
            ) : (
              <div className="text-center text-muted-foreground">Select a trade to preview images.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedImageOpen} onOpenChange={setSelectedImageOpen}>
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedImage ? (
              <img src={selectedImage} alt="Trade preview" className="w-full max-h-[75vh] object-contain rounded-2xl" />
            ) : (
              <div className="text-center text-muted-foreground">No image selected.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedImageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trade Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedNotesTrade ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Market Condition</p>
                  <p className="font-medium">{selectedNotesTrade.marketCondition || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Why was this trade taken?</p>
                  <p className="whitespace-pre-wrap">{selectedNotesTrade.whyTradeTaken || 'No notes provided.'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">What went right?</p>
                  <p className="whitespace-pre-wrap">{selectedNotesTrade.whatWentRight || 'No notes provided.'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">What went wrong?</p>
                  <p className="whitespace-pre-wrap">{selectedNotesTrade.whatWentWrong || 'No notes provided.'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Select a trade with notes to preview.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setNotesOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardPage;