import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TagsUsage = ({ trades }) => {
  const tagsStats = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const stats = {};

    trades.forEach(trade => {
      const tags = [...(trade.customTags || []), ...(trade.tags || [])];
      const pnl = trade.netPnL || trade.pnl || 0;

      tags.forEach(tag => {
        if (!stats[tag]) {
          stats[tag] = {
            tag,
            totalTrades: 0,
            profitableTrades: 0,
            losingTrades: 0,
            totalPnL: 0,
            directionCorrect: 0,
            analysisCorrect: 0,
          };
        }

        stats[tag].totalTrades += 1;
        stats[tag].totalPnL += pnl;

        if (pnl > 0) {
          stats[tag].profitableTrades += 1;
        } else if (pnl < 0) {
          stats[tag].losingTrades += 1;
        }

        if (trade.directionCorrect === true) {
          stats[tag].directionCorrect += 1;
        }
        if (trade.analysisCorrect === true) {
          stats[tag].analysisCorrect += 1;
        }
      });
    });

    return Object.values(stats)
      .map(stat => ({
        ...stat,
        winRate: stat.totalTrades ? (stat.profitableTrades / stat.totalTrades) * 100 : 0,
        avgPnL: stat.totalTrades ? stat.totalPnL / stat.totalTrades : 0,
        directionAccuracy: stat.totalTrades ? (stat.directionCorrect / stat.totalTrades) * 100 : 0,
        analysisAccuracy: stat.totalTrades ? (stat.analysisCorrect / stat.totalTrades) * 100 : 0,
      }))
      .sort((a, b) => b.totalTrades - a.totalTrades);
  }, [trades]);

  const getTagColor = (tag, positive = true) => {
    if (positive) {
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
    }
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
  };

  return (
    <Card className="glass-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Strategy Tags Performance</CardTitle>
        <CardDescription>Analytics for your custom strategy tags</CardDescription>
      </CardHeader>
      <CardContent>
        {tagsStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tagsStats.map((stat) => (
              <div
                key={stat.tag}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="outline" className="font-semibold text-sm">
                    {stat.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.totalTrades} trades
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className={`font-semibold ${stat.winRate >= 50 ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>
                      {stat.winRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg P&L:</span>
                    <span className={`font-bold ${stat.avgPnL > 0 ? 'text-[hsl(var(--success))]' : stat.avgPnL < 0 ? 'text-destructive' : ''}`}>
                      ${stat.avgPnL.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 space-y-1 border-t">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Direction ✓:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`cursor-help font-semibold px-2 py-0.5 rounded ${stat.directionAccuracy >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : stat.directionAccuracy >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                              {stat.directionAccuracy.toFixed(0)}%
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{stat.directionCorrect} out of {stat.totalTrades} directions were correct</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Analysis ✓:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`cursor-help font-semibold px-2 py-0.5 rounded ${stat.analysisAccuracy >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : stat.analysisAccuracy >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                              {stat.analysisAccuracy.toFixed(0)}%
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{stat.analysisCorrect} out of {stat.totalTrades} analyses were correct</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No tags used yet. Add custom tags to your trades to see analytics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TagsUsage;
