import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SymbolStatistics = ({ trades }) => {
  const symbolStats = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const stats = {};

    trades.forEach(trade => {
      const symbol = trade.symbol || 'Unknown';
      if (!stats[symbol]) {
        stats[symbol] = {
          symbol,
          totalTrades: 0,
          winCount: 0,
          lossCount: 0,
          flatTrades: 0,
          winningPoints: [],
          losingPoints: [],
          directionCorrect: 0,
          analysisCorrect: 0,
          trades: [],
        };
      }

      const pnl = trade.netPnL || trade.pnl || 0;
      const entry = parseFloat(trade.entryPrice) || 0;
      const exit = parseFloat(trade.exitPrice) || 0;
      const points = exit - entry;

      stats[symbol].totalTrades += 1;
      stats[symbol].trades.push(trade);

      if (pnl > 0) {
        stats[symbol].winCount += 1;
        stats[symbol].winningPoints.push(points);
      } else if (pnl < 0) {
        stats[symbol].lossCount += 1;
        stats[symbol].losingPoints.push(points);
      } else {
        stats[symbol].flatTrades += 1;
      }

      if (trade.directionCorrect === true) {
        stats[symbol].directionCorrect += 1;
      }
      if (trade.analysisCorrect === true) {
        stats[symbol].analysisCorrect += 1;
      }
    });

    return Object.values(stats)
      .map(stat => ({
        ...stat,
        winRate: stat.totalTrades ? (stat.winCount / stat.totalTrades) * 100 : 0,
        avgWinningPoints: stat.winningPoints.length > 0 ? stat.winningPoints.reduce((a, b) => a + b, 0) / stat.winningPoints.length : 0,
        avgLosingPoints: stat.losingPoints.length > 0 ? stat.losingPoints.reduce((a, b) => a + b, 0) / stat.losingPoints.length : 0,
        directionAccuracy: stat.totalTrades ? (stat.directionCorrect / stat.totalTrades) * 100 : 0,
        analysisAccuracy: stat.totalTrades ? (stat.analysisCorrect / stat.totalTrades) * 100 : 0,
      }))
      .sort((a, b) => b.totalTrades - a.totalTrades);
  }, [trades]);

  return (
    <Card className="glass-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Performance by Symbol</CardTitle>
        <CardDescription>Detailed statistics for each traded symbol</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {symbolStats.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b hover:bg-muted/50">
                <TableHead className="font-semibold">Symbol</TableHead>
                <TableHead className="text-right font-semibold">Trades</TableHead>
                <TableHead className="text-right font-semibold">Win Rate</TableHead>
                <TableHead className="text-right font-semibold">Avg Winning Points</TableHead>
                <TableHead className="text-right font-semibold">Avg Losing Points</TableHead>
                <TableHead className="text-center font-semibold">Direction ✓</TableHead>
                <TableHead className="text-center font-semibold">Analysis ✓</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symbolStats.map((stat) => {
                return (
                  <TableRow key={stat.symbol} className="hover:bg-muted/50">
                    <TableCell className="font-semibold font-mono">{stat.symbol}</TableCell>
                    <TableCell className="text-right">{stat.totalTrades}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-muted/30">
                        {stat.winRate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-[hsl(var(--success))]">
                      +{stat.avgWinningPoints.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      {stat.avgLosingPoints.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge variant={stat.directionAccuracy >= 70 ? 'default' : stat.directionAccuracy >= 50 ? 'secondary' : 'destructive'} className="text-xs">
                          {stat.directionAccuracy.toFixed(0)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge variant={stat.analysisAccuracy >= 70 ? 'default' : stat.analysisAccuracy >= 50 ? 'secondary' : 'destructive'} className="text-xs">
                          {stat.analysisAccuracy.toFixed(0)}%
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No symbol data available yet. Start logging trades to see statistics by symbol.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SymbolStatistics;
