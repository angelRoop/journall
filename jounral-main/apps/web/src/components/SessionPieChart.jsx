import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-xl font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-sm font-medium">
        {`${value} Trades`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

const SessionPieChart = ({ trades }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSessionData, setSelectedSessionData] = useState(null);

  const sessionData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const sessions = {};
    trades.forEach(t => {
      const session = t.tradingSession || 'Unknown';
      if (!sessions[session]) {
        sessions[session] = { name: session, trades: [], wins: 0, losses: 0, flat: 0, totalPnL: 0 };
      }
      sessions[session].trades.push(t);
      
      const pnl = t.netPnL || t.pnl || 0;
      sessions[session].totalPnL += pnl;
      
      if (pnl > 0) sessions[session].wins += 1;
      else if (pnl < 0) sessions[session].losses += 1;
      else sessions[session].flat += 1;
    });

    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--chart-win))',
      'hsl(var(--chart-loss))',
      'hsl(var(--chart-flat))',
      'hsl(var(--accent-foreground))'
    ];

    return Object.values(sessions).map((s, idx) => ({
      ...s,
      value: s.trades.length,
      fill: colors[idx % colors.length],
      winRate: s.trades.length > 0 ? (s.wins / s.trades.length) * 100 : 0
    })).sort((a, b) => b.value - a.value);
  }, [trades]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieClick = (data) => {
    setSelectedSessionData(data.payload);
    setModalOpen(true);
  };

  if (!sessionData.length) return null;

  return (
    <>
      <Card className="glass-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Trades by Session</CardTitle>
          <CardDescription>Click a segment for detailed win/loss breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={sessionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onClick={onPieClick}
                    className="cursor-pointer outline-none"
                  >
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right text-[hsl(var(--success))]">Wins</TableHead>
                    <TableHead className="text-right text-destructive">Losses</TableHead>
                    <TableHead className="text-right font-semibold">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionData.map((session) => (
                    <TableRow key={session.name} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => onPieClick({ payload: session })}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: session.fill }} />
                        {session.name}
                      </TableCell>
                      <TableCell className="text-right font-medium">{session.value}</TableCell>
                      <TableCell className="text-right">{session.wins}</TableCell>
                      <TableCell className="text-right">{session.losses}</TableCell>
                      <TableCell className="text-right font-bold">{session.winRate.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSessionData?.name} Session Details</DialogTitle>
            <DialogDescription>
              Performance breakdown for trades taken during this session.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSessionData && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center justify-center">
                  <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                  <div className="text-3xl font-bold">{selectedSessionData.winRate.toFixed(1)}%</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center justify-center">
                  <div className="text-sm text-muted-foreground mb-1">Net P&L</div>
                  <div className={`text-3xl font-bold ${selectedSessionData.totalPnL >= 0 ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>
                    ${selectedSessionData.totalPnL.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Wins', value: selectedSessionData.wins, fill: 'hsl(var(--chart-win))' },
                        { name: 'Losses', value: selectedSessionData.losses, fill: 'hsl(var(--chart-loss))' },
                        { name: 'Flat', value: selectedSessionData.flat, fill: 'hsl(var(--chart-flat))' }
                      ].filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {/* Cells already mapped in data via fill */}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionPieChart;