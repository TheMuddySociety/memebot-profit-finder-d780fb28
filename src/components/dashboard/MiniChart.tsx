import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MiniChartProps {
  data?: Array<{ value: number; timestamp: number }>;
  title?: string;
  currentValue?: number;
  change?: number;
}

const generateMockData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    value: 50 + Math.sin(i / 4) * 20 + Math.random() * 10,
    timestamp: Date.now() - (23 - i) * 3600000
  }));
};

export function MiniChart({ 
  data = generateMockData(), 
  title = "Market Trend", 
  currentValue = 67.4,
  change = 12.3 
}: MiniChartProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className="retro-terminal">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono text-primary flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-retro-green" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-400" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-mono text-primary">
            ${currentValue.toFixed(2)}
          </span>
          <span className={`text-xs font-mono ${isPositive ? 'text-retro-green' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#00ff00' : '#ff0000'}
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 2, fill: isPositive ? '#00ff00' : '#ff0000' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}