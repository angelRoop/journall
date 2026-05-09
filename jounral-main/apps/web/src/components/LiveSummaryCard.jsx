import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, Activity, ShieldCheck } from 'lucide-react';

const LiveSummaryCard = ({ metrics, formData }) => {
  const isWin = metrics.netPnL > 0;
  const isLoss = metrics.netPnL < 0;

  return (
    <Card className="glass-card sticky top-24">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Live Summary
          <Badge variant={isWin ? 'default' : isLoss ? 'destructive' : 'secondary'} className={isWin ? 'bg-[hsl(var(--success))]' : ''}>
            {metrics.winLossStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Net P&L</p>
          <div className={`text-4xl font-bold flex items-center justify-center gap-2 ${isWin ? 'text-[hsl(var(--success))]' : isLoss ? 'text-destructive' : 'text-foreground'}`}>
            {isWin ? <TrendingUp className="w-8 h-8" /> : isLoss ? <TrendingDown className="w-8 h-8" /> : <Minus className="w-8 h-8" />}
            ${Math.abs(metrics.netPnL).toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Target className="w-4 h-4" /> R:R Ratio
            </div>
            <div className="text-lg font-semibold">1:{metrics.riskRewardRatio.toFixed(2)}</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Activity className="w-4 h-4" /> R-Multiple
            </div>
            <div className="text-lg font-semibold">{metrics.rMultiple.toFixed(2)}R</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ShieldCheck className="w-4 h-4" /> Quality
            </div>
            <div className="text-lg font-semibold">{metrics.tradeQualityScore.toFixed(0)}/100</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" /> ROI
            </div>
            <div className="text-lg font-semibold">{metrics.roi.toFixed(2)}%</div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rules Followed</span>
            <span className="font-medium">{formData.rulesFollowed ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discipline Score</span>
            <span className="font-medium">{formData.disciplineScore}/10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Points Captured</span>
            <span className="font-medium">{formData.pointsCaptured}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveSummaryCard;