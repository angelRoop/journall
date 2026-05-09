import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TagBadge from '@/components/TagBadge.jsx';
import EmotionBadge from '@/components/EmotionBadge.jsx';
import WinLossBadge from '@/components/WinLossBadge.jsx';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TradeCard = ({ trade }) => {
  const isProfitable = trade.pnl > 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{trade.indexName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(trade.tradeDate), 'MMM dd, yyyy')}
            </div>
          </div>
          <WinLossBadge isWin={trade.winLoss} />
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">P&L:</span>
            <span className={`text-2xl font-bold ${isProfitable ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>
              {isProfitable ? '+' : ''}{trade.pnl.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {trade.numberOfTrades} {trade.numberOfTrades === 1 ? 'trade' : 'trades'}
          </div>
        </div>

        {trade.tags && trade.tags.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {trade.tags.map((tag, index) => (
                <TagBadge key={index} tag={tag} />
              ))}
            </div>
          </div>
        )}

        {trade.emotions && trade.emotions.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Emotions</p>
            <div className="flex flex-wrap gap-2">
              {trade.emotions.map((emotion, index) => (
                <EmotionBadge key={index} emotion={emotion} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeCard;