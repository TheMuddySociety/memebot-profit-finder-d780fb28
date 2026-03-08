import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import {
  ExternalLink, TrendingUp, TrendingDown, Users, Droplets,
  BarChart3, Clock, Copy, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { MemeToken } from '@/types/memeToken';
import { cn } from '@/lib/utils';

interface TokenDetailModalProps {
  token: MemeToken | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Generate realistic-looking mock price data
function generatePriceHistory(token: MemeToken) {
  const points = 48;
  const data = [];
  let price = token.price * (1 - Math.abs(token.change24h) / 100);
  const trend = token.change24h >= 0 ? 1 : -1;

  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.45) * price * 0.06;
    const drift = (trend * price * 0.003);
    price = Math.max(price * 0.5, price + noise + drift);
    const time = new Date(Date.now() - (points - i) * 30 * 60000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: +price.toPrecision(4),
      volume: Math.floor(Math.random() * token.volume24h / points * 2),
    });
  }
  return data;
}

// Generate mock holder distribution
function generateHolderDistribution(token: MemeToken) {
  return [
    { name: 'Top 10', value: 28 + Math.random() * 15, color: 'hsl(var(--primary))' },
    { name: 'Top 11-50', value: 15 + Math.random() * 10, color: 'hsl(var(--accent))' },
    { name: 'Top 51-200', value: 12 + Math.random() * 8, color: 'hsl(var(--muted-foreground))' },
    { name: 'Others', value: 0, color: 'hsl(var(--muted))' },
  ].map((item, _, arr) => {
    if (item.name === 'Others') {
      item.value = Math.max(5, 100 - arr.slice(0, 3).reduce((s, x) => s + x.value, 0));
    }
    return item;
  });
}

// Generate mock trade history
function generateTradeHistory(token: MemeToken) {
  const trades = [];
  for (let i = 0; i < 15; i++) {
    const isBuy = Math.random() > 0.45;
    const amount = +(Math.random() * token.price * 50000).toPrecision(4);
    const solAmount = +(amount / 67).toFixed(3);
    const time = new Date(Date.now() - i * (60000 + Math.random() * 120000));
    trades.push({
      id: i,
      type: isBuy ? 'buy' : 'sell',
      amount,
      solAmount,
      price: +(token.price * (1 + (Math.random() - 0.5) * 0.02)).toPrecision(4),
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      wallet: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
    });
  }
  return trades;
}

const fmt = (v: number, type: 'usd' | 'compact' | 'pct' = 'usd') => {
  if (type === 'pct') return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
  if (type === 'compact') {
    if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(2)}K`;
    return v.toLocaleString();
  }
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(2)}K`;
  if (v < 0.001) return `$${v.toExponential(2)}`;
  return `$${v.toFixed(4)}`;
};

export function TokenDetailModal({ token, open, onOpenChange }: TokenDetailModalProps) {
  const priceData = useMemo(() => token ? generatePriceHistory(token) : [], [token?.id]);
  const holders = useMemo(() => token ? generateHolderDistribution(token) : [], [token?.id]);
  const trades = useMemo(() => token ? generateTradeHistory(token) : [], [token?.id]);

  if (!token) return null;

  const isPositive = token.change24h >= 0;

  const copyAddress = () => {
    if (token.tokenAddress) {
      navigator.clipboard.writeText(token.tokenAddress);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border p-0">
        {/* Header */}
        <DialogHeader className="p-5 pb-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-border">
              <img
                src={token.logoUrl}
                alt={token.name}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg flex items-center gap-2">
                {token.name}
                <Badge variant="outline" className="text-xs font-mono">
                  {token.symbol}
                </Badge>
                {token.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
              </DialogTitle>
              {token.tokenAddress && (
                <button
                  onClick={copyAddress}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-0.5 font-mono transition-colors"
                >
                  {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}
                  <Copy className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold font-mono text-foreground">
                {fmt(token.price)}
              </div>
              <div className={cn(
                "text-sm font-medium flex items-center justify-end gap-1",
                isPositive ? "text-accent" : "text-destructive"
              )}>
                {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {fmt(token.change24h, 'pct')}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Market Cap', value: fmt(token.marketCap), icon: BarChart3 },
              { label: 'Volume 24h', value: fmt(token.volume24h), icon: BarChart3 },
              { label: 'Liquidity', value: fmt(token.liquidity), icon: Droplets },
              { label: 'Holders', value: fmt(token.holders, 'compact'), icon: Users },
            ].map(stat => (
              <div key={stat.label} className="rounded-lg bg-muted/40 border border-border/50 p-3">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                  <stat.icon className="h-3 w-3" /> {stat.label}
                </div>
                <div className="text-sm font-semibold font-mono text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Price Chart */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Price Chart (24h)
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isPositive ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    interval={7}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                    tickFormatter={(v) => fmt(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    formatter={(value: number) => [fmt(value), 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'}
                    fill="url(#priceGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Holder Distribution + Trade History side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Holder Distribution */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Holder Distribution
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={holders}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      strokeWidth={2}
                      stroke="hsl(var(--card))"
                    >
                      {holders.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
                {holders.map(h => (
                  <div key={h.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: h.color }} />
                    {h.name} ({h.value.toFixed(1)}%)
                  </div>
                ))}
              </div>
            </div>

            {/* Trade History */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Recent Trades
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin">
                {trades.map(trade => (
                  <div
                    key={trade.id}
                    className={cn(
                      "flex items-center justify-between text-[11px] rounded-md px-2 py-1.5",
                      trade.type === 'buy' ? 'bg-accent/5' : 'bg-destructive/5'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {trade.type === 'buy' ? (
                        <ArrowUpRight className="h-3 w-3 text-accent" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-destructive" />
                      )}
                      <span className={cn(
                        "font-medium",
                        trade.type === 'buy' ? 'text-accent' : 'text-destructive'
                      )}>
                        {trade.type === 'buy' ? 'BUY' : 'SELL'}
                      </span>
                      <span className="text-muted-foreground font-mono">{trade.wallet}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-mono">{trade.solAmount} SOL</span>
                      <span className="text-muted-foreground">{trade.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {token.tokenAddress && (
              <>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1" asChild>
                  <a
                    href={`https://solscan.io/token/${token.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" /> Solscan
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1" asChild>
                  <a
                    href={`https://birdeye.so/token/${token.tokenAddress}?chain=solana`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" /> Birdeye
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1" asChild>
                  <a
                    href={`https://pump.fun/${token.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" /> Pump.Fun
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
