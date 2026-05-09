import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-win))',
  'hsl(var(--chart-loss))',
  'hsl(var(--chart-flat))',
  'hsl(var(--accent-foreground))',
];

const MarketConditionPieChart = ({ trades }) => {
  const conditionData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const counts = trades.reduce((acc, trade) => {
      const condition = trade.marketCondition || 'Unknown';
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value], index) => ({
        name,
        value,
        fill: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [trades]);

  if (!conditionData.length) return null;

  return (
    <Card className="glass-card shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Market Condition</CardTitle>
        <CardDescription>Distribution of trades by market condition</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[420px] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center h-full">
          <div className="h-full min-h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conditionData.map((entry) => (
                  <TableRow key={entry.name}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                      {entry.name}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{entry.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketConditionPieChart;
