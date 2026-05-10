import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, BookOpen } from 'lucide-react';
import { format, isValid } from 'date-fns';

const TradesTable = ({ trades, onPreviewImages, onPreviewNotes }) => {
  const navigate = useNavigate();

  const formatNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
  };

  if (!trades || trades.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">No trades found.</div>;
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Symbol</TableHead>
              <TableHead className="font-semibold">Dir</TableHead>
              <TableHead className="text-right font-semibold">Qty</TableHead>
              <TableHead className="text-right font-semibold">Entry</TableHead>
              <TableHead className="text-right font-semibold">Exit</TableHead>
              <TableHead className="text-right font-semibold">Net P&L</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">R:R</TableHead>
              <TableHead className="text-center font-semibold">Market</TableHead>
              <TableHead className="text-center font-semibold">Dir ✓</TableHead>
              <TableHead className="text-center font-semibold">Analysis ✓</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => {
              const isWin = trade.netPnL > 0;
              const isLoss = trade.netPnL < 0;
              return (
                <TableRow 
                  key={trade.id} 
                  className="hover:bg-muted/80 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/add-trade/${trade.id}`)}
                >
                  <TableCell className="whitespace-nowrap text-muted-foreground group-hover:text-foreground transition-colors">
                    {(() => {
                      const dateValue = trade.tradeDate || trade.createdAt || trade.created || trade.date;
                      const parsedDate = new Date(dateValue);
                      return isValid(parsedDate) ? format(parsedDate, 'MMM dd, yyyy') : 'Unknown';
                    })()}
                  </TableCell>
                  <TableCell className="font-medium">{trade.symbol || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={trade.direction === 'Buy' ? 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900' : 'text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-900'}>
                      {trade.direction || 'Buy'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{trade.quantity || 0}</TableCell>
                  <TableCell className="text-right text-muted-foreground">${formatNumber(trade.entryPrice)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">${formatNumber(trade.exitPrice)}</TableCell>
                  <TableCell className={`text-right font-bold ${isWin ? 'text-[hsl(var(--success))]' : isLoss ? 'text-destructive' : ''}`}>
                    ${formatNumber(trade.netPnL)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={isWin ? 'default' : isLoss ? 'destructive' : 'secondary'} className={isWin ? 'bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))/90]' : ''}>
                      {isWin ? 'Win' : isLoss ? 'Loss' : 'Flat'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {trade.riskRewardRatio ? Number(trade.riskRewardRatio).toFixed(2) : '-'}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {trade.marketCondition || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {trade.directionCorrect === true ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">✓</Badge>
                    ) : trade.directionCorrect === false ? (
                      <Badge variant="destructive">✗</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {trade.analysisCorrect === true ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">✓</Badge>
                    ) : trade.analysisCorrect === false ? (
                      <Badge variant="destructive">✗</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                      {trade.whyTradeTaken || trade.whatWentRight || trade.whatWentWrong ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewNotes?.(trade);
                          }}
                        >
                          <BookOpen className="w-4 h-4" />
                        </Button>
                      ) : null}

                      {['beforeEntryImage', 'duringTradeImage', 'exitImage'].some((field) => trade[field]) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewImages?.(trade);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : null}

                      {!trade.whyTradeTaken && !trade.whatWentRight && !trade.whatWentWrong && !['beforeEntryImage', 'duringTradeImage', 'exitImage'].some((field) => trade[field]) && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradesTable;